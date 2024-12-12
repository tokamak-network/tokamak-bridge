import {
  LegacyTitanBridgeVersionEnum,
  LegacyTitanMaintenanceEnum,
} from "../types/legacyTitan";

export const BRIDGE_VERSION: LegacyTitanBridgeVersionEnum =
  LegacyTitanBridgeVersionEnum.V01;
export const LegacyTitanMaintenanceStatus: LegacyTitanMaintenanceEnum =
  LegacyTitanMaintenanceEnum.IN_PROGRESS;
export const BridgeShutdownDate = new Date("2025-01-20");
export const TitanShutdownDate = new Date("2024-12-27");
export const TitanMaintenanceDate = new Date("2024-12-27T00:00:00.000Z");
