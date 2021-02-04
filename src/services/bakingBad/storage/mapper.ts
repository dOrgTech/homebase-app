import { StorageDTO, Storage } from "./types";

export const dtoToStorage = (dto: StorageDTO): Storage => {
  return {
    ledgerMapNumber: dto.children[0].value,
    votingPeriod: Number(dto.children[6].value),
    quorumTreshold: Number(dto.children[7].value),
    proposalsMapNumber: dto.children[9].value,
  };
};
