import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { crops } from "@/core/database/schema";

export { crops };

export type Crop = InferSelectModel<typeof crops>;
export type NewCrop = InferInsertModel<typeof crops>;
