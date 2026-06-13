/**
 * Safrico feature flags — toggle via environment variables.
 * Client UI flags use NEXT_PUBLIC_FEATURE_<NAME>=true
 */
export const FEATURE_FLAGS = {
  CROP_BULK_IMPORT: "crop-bulk-import",
  BUYER_INVENTORY_VIEW: "buyer-inventory-view",
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

function flagToEnvKeys(flag: FeatureFlag): string[] {
  const normalized = flag.toUpperCase().replace(/-/g, "_");
  return [
    `NEXT_PUBLIC_FEATURE_${normalized}`,
    `FEATURE_${normalized}`,
    `NEXT_PUBLIC_${normalized}`,
    normalized,
  ];
}

function isTruthyEnv(keys: string[]): boolean {
  return keys.some((key) => process.env[key] === "true");
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return isTruthyEnv(flagToEnvKeys(flag));
}

/** Client components — only NEXT_PUBLIC_* vars are available in the browser. */
export function isClientFeatureEnabled(flag: FeatureFlag): boolean {
  const normalized = flag.toUpperCase().replace(/-/g, "_");
  const clientKeys = [`NEXT_PUBLIC_FEATURE_${normalized}`, `NEXT_PUBLIC_${normalized}`];
  return isTruthyEnv(clientKeys);
}
