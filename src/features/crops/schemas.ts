import { z } from "zod/v4";

export const CropTypeSchema = z.enum(["grains", "vegetables", "fruits", "legumes", "other"]);

export type CropType = z.infer<typeof CropTypeSchema>;

export const CreateCropSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  cropType: CropTypeSchema,
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  harvestDate: z.coerce.date().optional(),
});

export type CreateCropInput = z.infer<typeof CreateCropSchema>;

export const UpdateCropSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  cropType: CropTypeSchema.optional(),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater").optional(),
  harvestDate: z.coerce.date().nullable().optional(),
});

export type UpdateCropInput = z.infer<typeof UpdateCropSchema>;

export const CropFilterSchema = z.object({
  cropType: CropTypeSchema.optional(),
});

export type CropFilter = z.infer<typeof CropFilterSchema>;

export const CropResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cropType: CropTypeSchema,
  quantity: z.number().int(),
  harvestDate: z.date().nullable(),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CropResponse = z.infer<typeof CropResponseSchema>;

export const CropSummaryItemSchema = z.object({
  cropType: CropTypeSchema,
  totalQuantity: z.number().int(),
  cropCount: z.number().int(),
});

export type CropSummaryItem = z.infer<typeof CropSummaryItemSchema>;

export const HarvestAlertSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cropType: CropTypeSchema,
  quantity: z.number().int(),
  harvestDate: z.date(),
  daysUntilHarvest: z.number().int(),
});

export type HarvestAlert = z.infer<typeof HarvestAlertSchema>;
