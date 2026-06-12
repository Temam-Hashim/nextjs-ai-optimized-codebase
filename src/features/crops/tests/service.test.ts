import { beforeEach, describe, expect, it, mock } from "bun:test";

import type { Crop } from "../models";

const mockRepository = {
  findById: mock<(id: string) => Promise<Crop | undefined>>(() => Promise.resolve(undefined)),
  findByOwnerId: mock<(ownerId: string, filter?: unknown) => Promise<Crop[]>>(() =>
    Promise.resolve([]),
  ),
  findByIdAndOwner: mock<(id: string, ownerId: string) => Promise<Crop | undefined>>(() =>
    Promise.resolve(undefined),
  ),
  create: mock<(data: unknown) => Promise<Crop>>(() => Promise.resolve({} as Crop)),
  update: mock<(id: string, data: unknown) => Promise<Crop | undefined>>(() =>
    Promise.resolve(undefined),
  ),
  deleteById: mock<(id: string) => Promise<boolean>>(() => Promise.resolve(false)),
  countByOwnerId: mock<(ownerId: string, filter?: unknown) => Promise<number>>(() =>
    Promise.resolve(0),
  ),
  findUpcomingHarvests: mock<(ownerId: string, days: number) => Promise<Crop[]>>(() =>
    Promise.resolve([]),
  ),
  getSummaryByOwner: mock<(ownerId: string) => Promise<unknown[]>>(() => Promise.resolve([])),
  getPublicSummaryByType: mock<() => Promise<unknown[]>>(() => Promise.resolve([])),
};

mock.module("../repository", () => mockRepository);

const {
  createCrop,
  deleteCrop,
  getCrop,
  getCropSummaryByOwner,
  getCropsByOwner,
  getHarvestAlerts,
  getPublicInventorySummary,
  updateCrop,
} = await import("../service");

const ownerId = "550e8400-e29b-41d4-a716-446655440001";
const otherUserId = "550e8400-e29b-41d4-a716-446655440002";

const mockCrop: Crop = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Maize",
  cropType: "grains",
  quantity: 500,
  harvestDate: new Date("2026-06-01"),
  ownerId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createCrop", () => {
  beforeEach(() => {
    mockRepository.create.mockReset();
  });

  it("creates a crop for the owner", async () => {
    mockRepository.create.mockResolvedValue(mockCrop);

    const result = await createCrop(
      { name: "Maize", cropType: "grains", quantity: 500, harvestDate: new Date("2026-06-01") },
      ownerId,
    );

    expect(result).toEqual(mockCrop);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });
});

describe("getCrop", () => {
  beforeEach(() => {
    mockRepository.findByIdAndOwner.mockReset();
    mockRepository.findById.mockReset();
  });

  it("returns crop for owner", async () => {
    mockRepository.findByIdAndOwner.mockResolvedValue(mockCrop);

    const result = await getCrop(mockCrop.id, ownerId);
    expect(result).toEqual(mockCrop);
  });

  it("throws when crop not found", async () => {
    mockRepository.findByIdAndOwner.mockResolvedValue(undefined);
    mockRepository.findById.mockResolvedValue(undefined);

    await expect(getCrop("missing-id", ownerId)).rejects.toThrow("Crop not found");
  });

  it("throws when access denied", async () => {
    mockRepository.findByIdAndOwner.mockResolvedValue(undefined);
    mockRepository.findById.mockResolvedValue(mockCrop);

    await expect(getCrop(mockCrop.id, otherUserId)).rejects.toThrow("Access denied");
  });
});

describe("getCropsByOwner", () => {
  beforeEach(() => {
    mockRepository.findByOwnerId.mockReset();
  });

  it("lists crops with optional filter", async () => {
    mockRepository.findByOwnerId.mockResolvedValue([mockCrop]);

    const result = await getCropsByOwner(ownerId, { cropType: "grains" });
    expect(result).toHaveLength(1);
    expect(mockRepository.findByOwnerId).toHaveBeenCalledWith(ownerId, { cropType: "grains" });
  });
});

describe("updateCrop", () => {
  beforeEach(() => {
    mockRepository.findByIdAndOwner.mockReset();
    mockRepository.findById.mockReset();
    mockRepository.update.mockReset();
  });

  it("updates crop for owner", async () => {
    mockRepository.findByIdAndOwner.mockResolvedValue(mockCrop);
    mockRepository.update.mockResolvedValue({ ...mockCrop, quantity: 600 });

    const result = await updateCrop(mockCrop.id, { quantity: 600 }, ownerId);
    expect(result.quantity).toBe(600);
  });
});

describe("deleteCrop", () => {
  beforeEach(() => {
    mockRepository.findByIdAndOwner.mockReset();
    mockRepository.deleteById.mockReset();
  });

  it("deletes crop for owner", async () => {
    mockRepository.findByIdAndOwner.mockResolvedValue(mockCrop);
    mockRepository.deleteById.mockResolvedValue(true);

    await deleteCrop(mockCrop.id, ownerId);
    expect(mockRepository.deleteById).toHaveBeenCalledWith(mockCrop.id);
  });
});

describe("getHarvestAlerts", () => {
  beforeEach(() => {
    mockRepository.findUpcomingHarvests.mockReset();
  });

  it("maps upcoming crops to alerts with days until harvest", async () => {
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + 3);

    mockRepository.findUpcomingHarvests.mockResolvedValue([
      { ...mockCrop, harvestDate },
    ]);

    const alerts = await getHarvestAlerts(ownerId);
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.name).toBe("Maize");
    expect(alerts[0]?.daysUntilHarvest).toBeGreaterThanOrEqual(2);
    expect(alerts[0]?.daysUntilHarvest).toBeLessThanOrEqual(4);
  });
});

describe("getCropSummaryByOwner", () => {
  beforeEach(() => {
    mockRepository.getSummaryByOwner.mockReset();
  });

  it("returns summary from repository", async () => {
    mockRepository.getSummaryByOwner.mockResolvedValue([
      { cropType: "grains", totalQuantity: 500, cropCount: 2 },
    ]);

    const summary = await getCropSummaryByOwner(ownerId);
    expect(summary).toHaveLength(1);
    expect(summary[0]?.totalQuantity).toBe(500);
  });
});

describe("getPublicInventorySummary", () => {
  beforeEach(() => {
    mockRepository.getPublicSummaryByType.mockReset();
  });

  it("returns public aggregate without owner filter", async () => {
    mockRepository.getPublicSummaryByType.mockResolvedValue([
      { cropType: "vegetables", totalQuantity: 200, cropCount: 3 },
    ]);

    const summary = await getPublicInventorySummary();
    expect(summary[0]?.cropType).toBe("vegetables");
  });
});
