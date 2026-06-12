import type { HttpStatusCode } from "@/core/api/errors";

export type CropErrorCode = "CROP_NOT_FOUND" | "CROP_ACCESS_DENIED";

export class CropError extends Error {
  readonly code: CropErrorCode;
  readonly statusCode: HttpStatusCode;

  constructor(message: string, code: CropErrorCode, statusCode: HttpStatusCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class CropNotFoundError extends CropError {
  constructor(id: string) {
    super(`Crop not found: ${id}`, "CROP_NOT_FOUND", 404);
  }
}

export class CropAccessDeniedError extends CropError {
  constructor(cropId: string) {
    super(`Access denied to crop: ${cropId}`, "CROP_ACCESS_DENIED", 403);
  }
}
