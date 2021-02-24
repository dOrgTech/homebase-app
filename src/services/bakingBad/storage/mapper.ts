import { DAOTemplate } from "./../../../modules/creator/state/types";
import {
  StorageDTO,
  Storage,
  RegistryStorageDTO,
  TreasuryStorageDTO,
  TreasuryStorage,
  RegistryStorage,
} from "services/bakingBad/storage/types";

const dtoTreasuryToStorage = (dto: TreasuryStorageDTO): TreasuryStorage => ({
  ledgerMapNumber: dto.children[0].value,
  votingPeriod: Number(dto.children[6].value),
  quorumTreshold: Number(dto.children[7].value),
  frozenScaleValue: Number(dto.children[8].children[0].value),
  frozenExtraValue: Number(dto.children[8].children[1].value),
  slashScaleValue: Number(dto.children[8].children[2].value),
  slashDivisionValue: Number(dto.children[8].children[3].value),
  minXtzAmount: dto.children[8].children[4].value,
  maxXtzAmount: dto.children[8].children[5].value,
  maxProposalSize: Number(dto.children[8].children[6].value),
  proposalsMapNumber: dto.children[9].value,
});

const dtoRegistryToStorage = (dto: RegistryStorageDTO): RegistryStorage => ({
  ledgerMapNumber: dto.children[0].value,
  votingPeriod: Number(dto.children[6].value),
  quorumTreshold: Number(dto.children[7].value),
  registry: dto.children[8].children[0].value,
  frozenScaleValue: Number(dto.children[8].children[1].value),
  frozenExtraValue: Number(dto.children[8].children[2].value),
  slashScaleValue: Number(dto.children[8].children[3].value),
  slashDivisionValue: Number(dto.children[8].children[4].value),
  minXtzAmount: dto.children[8].children[4].value,
  maxXtzAmount: dto.children[8].children[5].value,
  maxProposalSize: Number(dto.children[8].children[5].value),
  proposalsMapNumber: dto.children[9].value,
});

const getDAOTemplateFromStorageDTO = (dto: StorageDTO): DAOTemplate => {
  if (dto.children[8].children[0].name === "registry") {
    return "registry";
  }

  return "treasury";
};

export const dtoToStorageAndType = (
  dto: StorageDTO
): { storage: Storage; template: DAOTemplate } => {
  const template = getDAOTemplateFromStorageDTO(dto);

  switch (template) {
    case "treasury":
      return {
        storage: dtoTreasuryToStorage(dto as TreasuryStorageDTO),
        template,
      };
    case "registry":
      return {
        storage: dtoRegistryToStorage(dto as RegistryStorageDTO),
        template,
      };
  }
};
