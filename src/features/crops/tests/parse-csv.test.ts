import { describe, expect, it } from "bun:test";

import { CROP_CSV_TEMPLATE, parseCropCsv } from "../parse-csv";

describe("parseCropCsv", () => {
  it("parses template CSV with header", () => {
    const result = parseCropCsv(CROP_CSV_TEMPLATE);
    expect(result.errors).toHaveLength(0);
    expect(result.rows).toHaveLength(3);
    expect(result.rows[0]?.name).toBe("Maize");
    expect(result.rows[0]?.cropType).toBe("grains");
    expect(result.rows[1]?.harvestDate).toBeUndefined();
  });

  it("parses headerless rows", () => {
    const result = parseCropCsv("Wheat,grains,100,2026-08-01");
    expect(result.errors).toHaveLength(0);
    expect(result.rows[0]?.name).toBe("Wheat");
  });

  it("reports invalid crop type", () => {
    const result = parseCropCsv("name,cropType,quantity\nBad,cereal,10");
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]?.message).toContain("Invalid crop type");
  });

  it("reports empty file", () => {
    const result = parseCropCsv("   \n  ");
    expect(result.errors[0]?.message).toBe("CSV file is empty");
  });
});
