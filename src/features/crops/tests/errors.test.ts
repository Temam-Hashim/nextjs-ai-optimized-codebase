import { describe, expect, it } from "bun:test";

import { CropAccessDeniedError, CropNotFoundError } from "../errors";

describe("CropNotFoundError", () => {
  it("has correct code and status", () => {
    const error = new CropNotFoundError("crop-123");
    expect(error.code).toBe("CROP_NOT_FOUND");
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("crop-123");
  });
});

describe("CropAccessDeniedError", () => {
  it("has correct code and status", () => {
    const error = new CropAccessDeniedError("crop-456");
    expect(error.code).toBe("CROP_ACCESS_DENIED");
    expect(error.statusCode).toBe(403);
  });
});
