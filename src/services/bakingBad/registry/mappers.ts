import { RegistryDTO, RegistryStorageItem } from "./types";

export const dtoToRegistry = (dto: RegistryDTO): RegistryStorageItem[] =>
  dto.map((d) => ({
    key: d.data.key.value,
    value: d.data.value.children[0].value,
    lastUpdated: d.data.value.children[2].value,
  }));
