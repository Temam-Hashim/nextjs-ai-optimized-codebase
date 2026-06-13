import { and, count, eq, gte, lte, sum } from "drizzle-orm";

import { db } from "@/core/database/client";

import type { Crop, NewCrop } from "./models";
import { crops } from "./models";
import type { CropFilter } from "./schemas";

export async function findById(id: string): Promise<Crop | undefined> {
  const results = await db.select().from(crops).where(eq(crops.id, id)).limit(1);
  return results[0];
}

export async function findByOwnerId(ownerId: string, filter?: CropFilter): Promise<Crop[]> {
  const conditions = [eq(crops.ownerId, ownerId)];

  if (filter?.cropType) {
    conditions.push(eq(crops.cropType, filter.cropType));
  }

  return db
    .select()
    .from(crops)
    .where(and(...conditions));
}

export async function findByIdAndOwner(id: string, ownerId: string): Promise<Crop | undefined> {
  const results = await db
    .select()
    .from(crops)
    .where(and(eq(crops.id, id), eq(crops.ownerId, ownerId)))
    .limit(1);
  return results[0];
}

export async function create(data: NewCrop): Promise<Crop> {
  const results = await db.insert(crops).values(data).returning();
  const crop = results[0];
  if (!crop) {
    throw new Error("Failed to create crop");
  }
  return crop;
}

export async function createMany(data: NewCrop[]): Promise<Crop[]> {
  if (data.length === 0) {
    return [];
  }
  return db.insert(crops).values(data).returning();
}

export async function update(
  id: string,
  data: Partial<Pick<Crop, "name" | "cropType" | "quantity" | "harvestDate">>,
): Promise<Crop | undefined> {
  const results = await db
    .update(crops)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(crops.id, id))
    .returning();
  return results[0];
}

export async function deleteById(id: string): Promise<boolean> {
  const results = await db.delete(crops).where(eq(crops.id, id)).returning();
  return results.length > 0;
}

export async function countByOwnerId(ownerId: string, filter?: CropFilter): Promise<number> {
  const conditions = [eq(crops.ownerId, ownerId)];

  if (filter?.cropType) {
    conditions.push(eq(crops.cropType, filter.cropType));
  }

  const results = await db
    .select({ count: count() })
    .from(crops)
    .where(and(...conditions));
  return results[0]?.count ?? 0;
}

export async function findUpcomingHarvests(ownerId: string, withinDays: number): Promise<Crop[]> {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + withinDays);

  return db
    .select()
    .from(crops)
    .where(
      and(eq(crops.ownerId, ownerId), gte(crops.harvestDate, now), lte(crops.harvestDate, end)),
    );
}

export interface CropSummaryRow {
  cropType: Crop["cropType"];
  totalQuantity: number;
  cropCount: number;
}

export async function getSummaryByOwner(ownerId: string): Promise<CropSummaryRow[]> {
  const results = await db
    .select({
      cropType: crops.cropType,
      totalQuantity: sum(crops.quantity),
      cropCount: count(),
    })
    .from(crops)
    .where(eq(crops.ownerId, ownerId))
    .groupBy(crops.cropType);

  return results.map((row) => ({
    cropType: row.cropType,
    totalQuantity: Number(row.totalQuantity ?? 0),
    cropCount: Number(row.cropCount ?? 0),
  }));
}

export async function getPublicSummaryByType(): Promise<CropSummaryRow[]> {
  const results = await db
    .select({
      cropType: crops.cropType,
      totalQuantity: sum(crops.quantity),
      cropCount: count(),
    })
    .from(crops)
    .groupBy(crops.cropType);

  return results.map((row) => ({
    cropType: row.cropType,
    totalQuantity: Number(row.totalQuantity ?? 0),
    cropCount: Number(row.cropCount ?? 0),
  }));
}
