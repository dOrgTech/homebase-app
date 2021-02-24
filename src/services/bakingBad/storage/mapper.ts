import {
  StorageDTO,
  Storage,
  RegistryStorageDTO,
  TreasuryStorageDTO,
} from "services/bakingBad/storage/types";

const dtoTreasuryToStorage = (dto: TreasuryStorageDTO) => ({
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

const dtoRegistryToStorage = (dto: RegistryStorageDTO) => ({
  ledgerMapNumber: dto.children[0].value,
  votingPeriod: Number(dto.children[6].value),
  quorumTreshold: Number(dto.children[7].value),
  frozenScaleValue: Number(dto.children[8].children[1].value),
  frozenExtraValue: Number(dto.children[8].children[2].value),
  slashScaleValue: Number(dto.children[8].children[3].value),
  slashDivisionValue: Number(dto.children[8].children[4].value),
  minXtzAmount: dto.children[8].children[4].value,
  maxXtzAmount: dto.children[8].children[5].value,
  maxProposalSize: Number(dto.children[8].children[5].value),
  proposalsMapNumber: dto.children[9].value,
});

export const dtoToStorage = (dto: StorageDTO): Storage => {
  if (dto.children[8].children[0].name === "registry") {
    return dtoRegistryToStorage(dto as RegistryStorageDTO);
  }

  return dtoTreasuryToStorage(dto as TreasuryStorageDTO);
};
