import { describe, expect, it } from "bun:test";

import { FEATURE_FLAGS, isFeatureEnabled } from "./flags";

describe("isFeatureEnabled", () => {
  it("returns true when NEXT_PUBLIC flag is set", () => {
    const key = `NEXT_PUBLIC_FEATURE_${FEATURE_FLAGS.CROP_BULK_IMPORT.toUpperCase().replace(/-/g, "_")}`;
    const previous = process.env[key];
    process.env[key] = "true";
    expect(isFeatureEnabled(FEATURE_FLAGS.CROP_BULK_IMPORT)).toBe(true);
    if (previous === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = previous;
    }
  });

  it("returns false when flag is unset", () => {
    const key = `NEXT_PUBLIC_FEATURE_${FEATURE_FLAGS.BUYER_INVENTORY_VIEW.toUpperCase().replace(/-/g, "_")}`;
    const previous = process.env[key];
    delete process.env[key];
    delete process.env[`FEATURE_${FEATURE_FLAGS.BUYER_INVENTORY_VIEW.toUpperCase().replace(/-/g, "_")}`];
    expect(isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW)).toBe(false);
    if (previous !== undefined) {
      process.env[key] = previous;
    }
  });
});
