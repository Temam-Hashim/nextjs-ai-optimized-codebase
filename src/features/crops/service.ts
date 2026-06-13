import { getLogger } from "@/core/logging";

import { CropAccessDeniedError, CropNotFoundError } from "./errors";
import type { Crop } from "./models";
import * as repository from "./repository";
import type { CreateCropInput, CropFilter, UpdateCropInput } from "./schemas";

const logger = getLogger("crops.service");

export async function createCrop(input: CreateCropInput, ownerId: string): Promise<Crop> {
  logger.info({ ownerId, name: input.name, cropType: input.cropType }, "crop.create_started");

  const crop = await repository.create({
    name: input.name,
    cropType: input.cropType,
    quantity: input.quantity,
    harvestDate: input.harvestDate ?? null,
    ownerId,
  });

  logger.info({ cropId: crop.id }, "crop.create_completed");
  return crop;
}

export async function bulkImportCrops(
  inputs: CreateCropInput[],
  ownerId: string,
): Promise<Crop[]> {
  logger.info({ ownerId, count: inputs.length }, "crop.bulk_import_started");

  const created = await repository.createMany(
    inputs.map((input) => ({
      name: input.name,
      cropType: input.cropType,
      quantity: input.quantity,
      harvestDate: input.harvestDate ?? null,
      ownerId,
    })),
  );

  logger.info({ ownerId, imported: created.length }, "crop.bulk_import_completed");
  return created;
}

export async function getCrop(id: string, userId: string): Promise<Crop> {
  logger.info({ cropId: id, userId }, "crop.get_started");

  const crop = await repository.findByIdAndOwner(id, userId);
  if (!crop) {
    const existing = await repository.findById(id);
    if (!existing) {
      logger.warn({ cropId: id }, "crop.get_failed");
      throw new CropNotFoundError(id);
    }
    logger.warn({ cropId: id, userId }, "crop.access_denied");
    throw new CropAccessDeniedError(id);
  }

  logger.info({ cropId: id }, "crop.get_completed");
  return crop;
}

export async function getCropsByOwner(ownerId: string, filter?: CropFilter): Promise<Crop[]> {
  logger.info({ ownerId, filter }, "crop.list_started");

  const cropList = await repository.findByOwnerId(ownerId, filter);

  logger.info({ ownerId, count: cropList.length }, "crop.list_completed");
  return cropList;
}

export async function updateCrop(
  id: string,
  input: UpdateCropInput,
  userId: string,
): Promise<Crop> {
  logger.info({ cropId: id, userId }, "crop.update_started");

  const existing = await repository.findByIdAndOwner(id, userId);
  if (!existing) {
    const crop = await repository.findById(id);
    if (!crop) {
      logger.warn({ cropId: id }, "crop.update_failed");
      throw new CropNotFoundError(id);
    }
    logger.warn({ cropId: id, userId }, "crop.access_denied");
    throw new CropAccessDeniedError(id);
  }

  const updateData: Partial<Pick<Crop, "name" | "cropType" | "quantity" | "harvestDate">> = {};
  if (input.name !== undefined) {
    updateData.name = input.name;
  }
  if (input.cropType !== undefined) {
    updateData.cropType = input.cropType;
  }
  if (input.quantity !== undefined) {
    updateData.quantity = input.quantity;
  }
  if (input.harvestDate !== undefined) {
    updateData.harvestDate = input.harvestDate;
  }

  const updated = await repository.update(id, updateData);
  if (!updated) {
    logger.error({ cropId: id }, "crop.update_failed");
    throw new CropNotFoundError(id);
  }

  logger.info({ cropId: id }, "crop.update_completed");
  return updated;
}

export async function deleteCrop(id: string, userId: string): Promise<void> {
  logger.info({ cropId: id, userId }, "crop.delete_started");

  const existing = await repository.findByIdAndOwner(id, userId);
  if (!existing) {
    const crop = await repository.findById(id);
    if (!crop) {
      logger.warn({ cropId: id }, "crop.delete_failed");
      throw new CropNotFoundError(id);
    }
    logger.warn({ cropId: id, userId }, "crop.access_denied");
    throw new CropAccessDeniedError(id);
  }

  const deleted = await repository.deleteById(id);
  if (!deleted) {
    logger.error({ cropId: id }, "crop.delete_failed");
    throw new CropNotFoundError(id);
  }

  logger.info({ cropId: id }, "crop.delete_completed");
}

export async function getCropCount(ownerId: string, filter?: CropFilter): Promise<number> {
  return repository.countByOwnerId(ownerId, filter);
}

const HARVEST_ALERT_DAYS = 7;

export async function getHarvestAlerts(ownerId: string) {
  logger.info({ ownerId, withinDays: HARVEST_ALERT_DAYS }, "crop.alerts_started");

  const upcoming = await repository.findUpcomingHarvests(ownerId, HARVEST_ALERT_DAYS);
  const now = new Date();

  const alerts = upcoming
    .filter((crop): crop is Crop & { harvestDate: Date } => crop.harvestDate !== null)
    .map((crop) => {
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysUntilHarvest = Math.ceil(
        (crop.harvestDate.getTime() - now.getTime()) / msPerDay,
      );
      return {
        id: crop.id,
        name: crop.name,
        cropType: crop.cropType,
        quantity: crop.quantity,
        harvestDate: crop.harvestDate,
        daysUntilHarvest,
      };
    })
    .sort((a, b) => a.daysUntilHarvest - b.daysUntilHarvest);

  logger.info({ ownerId, count: alerts.length }, "crop.alerts_completed");
  return alerts;
}

export async function getCropSummaryByOwner(ownerId: string) {
  logger.info({ ownerId }, "crop.summary_started");
  const summary = await repository.getSummaryByOwner(ownerId);
  logger.info({ ownerId, types: summary.length }, "crop.summary_completed");
  return summary;
}

export async function getPublicInventorySummary() {
  logger.info("inventory.public_summary_started");
  const summary = await repository.getPublicSummaryByType();
  logger.info({ types: summary.length }, "inventory.public_summary_completed");
  return summary;
}
