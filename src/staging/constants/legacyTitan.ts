import {
  LegacyTitanBridgeVersionEnum,
  LegacyTitanMaintenanceEnum,
} from "../types/legacyTitan";

export const BRIDGE_VERSION: LegacyTitanBridgeVersionEnum =
  LegacyTitanBridgeVersionEnum.V01;
export const LegacyTitanMaintenanceStatus: LegacyTitanMaintenanceEnum =
  LegacyTitanMaintenanceEnum.IN_PROGRESS;
export const ClaimFeatureOpenDate = new Date("2025-01-06");
export const BridgeShutdownDate = new Date("2025-01-13");
export const TitanShutdownDate = new Date("2024-12-26");
export const TitanMaintenanceDate = new Date("2024-12-27T00:00:00Z");
