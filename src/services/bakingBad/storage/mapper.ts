import { StorageDTO, Storage } from "./types";

export const dtoToStorage = (dto: StorageDTO): Storage => {
  return {
    ledgerMapNumber: dto.children[0].value,
    proposalsMapNumber: dto.children[9].value,
  };
};
