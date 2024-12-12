import {
  LegacyTitanBridgeVersionEnum,
  LegacyTitanMaintenanceEnum,
} from "../types/legacyTitan";

export const BRIDGE_VERSION: LegacyTitanBridgeVersionEnum =
  LegacyTitanBridgeVersionEnum.V01;
export const LegacyTitanMaintenanceStatus: LegacyTitanMaintenanceEnum =
  LegacyTitanMaintenanceEnum.DONE;
export const BridgeShutdownDate = new Date("2025-01-20");
export const TitanShutdownDate = new Date("2024-12-30");
export const TitanMaintenanceDate = new Date("2024-12-30T00:00:00.000Z");
