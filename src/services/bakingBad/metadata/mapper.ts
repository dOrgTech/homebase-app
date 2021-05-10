import { bytes2Char } from "@taquito/tzip16";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";
import { MetadataDTO } from "./types";

export const metadataFromAPIDTOtoDAOListMetadata = (dto: MetadataDTO): DAOListMetadata => {

  const frozenTokenDTO = dto.views[3].implementations[0].michelsonStorageView.code[2].args[0][2].args[1][1].args[1]

  return {
    address: dto.address,
    authors: dto.authors,
    name: dto.name,
    template: dto.extras.template,
    description: dto.description,
    unfrozenToken: {
      symbol: bytes2Char(frozenTokenDTO[2].args[1].bytes),
      name: bytes2Char(frozenTokenDTO[1].args[1].bytes),
      decimals: bytes2Char(frozenTokenDTO[0].args[1].bytes),
    }
  }
}