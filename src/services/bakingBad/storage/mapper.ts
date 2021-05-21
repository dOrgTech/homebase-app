import { Storage, StorageDTO } from "./types";

export const storageDTOToStorage = (dto: StorageDTO): Storage => ({
  maxProposals: Number(dto.children[17].value),
  maxVotes: Number(dto.children[18].value),
  votingPeriod: Number(dto.children[22].value),
  quorumTreshold: Number(dto.children[20].children[0].value) / Number(dto.children[20].children[1].value),
  proposalsMapNumber: dto.children[12].value,
  ledgerMapNumber: dto.children[6].value,
  proposalsToFlush: dto.children[11].value,
  totalSupply: {
    0: Number(dto.children[14].children[0].value),
  },
  lastPeriodChange: {
    timestamp: dto.children[13].value,
    periodNumber: 0,
  },
  fixedProposalFeeInToken: Number(dto.children[2].value),
  admin: dto.children[0].value,
  freezeHistory: dto.children[3].value,
  frozenTokenId: Number(dto.children[4].value),
  extraMapNumber: dto.children[1].value,
  governanceToken: {
    address: dto.children[5].children[0].value,
    tokenId: Number(dto.children[5].children[1].value)
  }
})