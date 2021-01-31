import { TokenHolder } from "../types";

type ExtraState = {
  extra: {
    frozenScaleValue: number;
    frozenExtraValue: number;
    slashScaleValue: number;
    slashDivisionValue: number;
    maxXtzAmount: number;
    minXtzAmount: number;
    maxProposalSize: number;
  };
};

type MigrationStatus = {
  notInMigration?: string;
  migratingTo?: string;
  migratedTo?: string;
};

export interface TreasuryDAOState {
  ledger: TokenHolder[];
  operators: any;
  tokenAddress: string;
  adminAddress: string;
  pendingOwner: string;
  migrationStatus: MigrationStatus;
  quorumThreshold: number;
  extra: ExtraState;
  proposals: any;
  proposalKeyListSortByDate: any;
  permitsCounter: number;
  metadata: any;
}
