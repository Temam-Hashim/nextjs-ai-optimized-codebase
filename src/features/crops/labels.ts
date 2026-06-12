import type { CropType } from "./schemas";

export const CROP_TYPE_LABELS: Record<CropType, string> = {
  grains: "Grains",
  vegetables: "Vegetables",
  fruits: "Fruits",
  legumes: "Legumes",
  other: "Other",
};

export const CROP_TYPES: CropType[] = [
  "grains",
  "vegetables",
  "fruits",
  "legumes",
  "other",
];
