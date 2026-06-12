/**
 * Safrico feature flags — toggle via environment variables.
 * Client UI flags use NEXT_PUBLIC_FEATURE_<NAME>=true
 */
export const FEATURE_FLAGS = {
  CROP_BULK_IMPORT: "crop-bulk-import",
  BUYER_INVENTORY_VIEW: "buyer-inventory-view",
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

function flagToEnvKey(flag: FeatureFlag, publicPrefix: boolean): string {
  const normalized = flag.toUpperCase().replace(/-/g, "_");
  return publicPrefix ? `NEXT_PUBLIC_FEATURE_${normalized}` : `FEATURE_${normalized}`;
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const publicKey = flagToEnvKey(flag, true);
  const serverKey = flagToEnvKey(flag, false);
  return process.env[publicKey] === "true" || process.env[serverKey] === "true";
}

export function isClientFeatureEnabled(flag: FeatureFlag): boolean {
  const publicKey = flagToEnvKey(flag, true);
  return process.env[publicKey] === "true";
}
