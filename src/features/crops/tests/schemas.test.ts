import { describe, expect, it } from "bun:test";

import { CreateCropSchema, CropFilterSchema, UpdateCropSchema } from "../schemas";

describe("CreateCropSchema", () => {
  it("validates valid input", () => {
    const result = CreateCropSchema.parse({
      name: "Maize",
      cropType: "grains",
      quantity: 500,
      harvestDate: "2026-06-01",
    });
    expect(result.name).toBe("Maize");
    expect(result.cropType).toBe("grains");
    expect(result.quantity).toBe(500);
    expect(result.harvestDate).toBeInstanceOf(Date);
  });

  it("rejects negative quantity", () => {
    expect(() =>
      CreateCropSchema.parse({
        name: "Maize",
        cropType: "grains",
        quantity: -1,
      }),
    ).toThrow();
  });

  it("rejects invalid crop type", () => {
    expect(() =>
      CreateCropSchema.parse({
        name: "Maize",
        cropType: "invalid",
        quantity: 10,
      }),
    ).toThrow();
  });
});

describe("UpdateCropSchema", () => {
  it("validates partial updates", () => {
    const result = UpdateCropSchema.parse({ quantity: 100 });
    expect(result.quantity).toBe(100);
  });

  it("allows clearing harvest date with null", () => {
    const result = UpdateCropSchema.parse({ harvestDate: null });
    expect(result.harvestDate).toBeNull();
  });
});

describe("CropFilterSchema", () => {
  it("validates crop type filter", () => {
    const result = CropFilterSchema.parse({ cropType: "vegetables" });
    expect(result.cropType).toBe("vegetables");
  });

  it("allows empty filter", () => {
    const result = CropFilterSchema.parse({});
    expect(result.cropType).toBeUndefined();
  });
});
