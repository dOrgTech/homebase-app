import { Storage, StorageDTO } from "./types";

export const storageDTOToStorage = (dto: StorageDTO): Storage => ({
  admin: dto.children[0].value,
  extraMapNumber: dto.children[1].value,
  freezeHistoryMapNumber: dto.children[2].value,
  frozenTokenId: Number(dto.children[3].value),
  governanceToken: {
    address: dto.children[4].children[0].value,
    tokenId: Number(dto.children[4].children[1].value),
  },
  guardian: dto.children[5].value,
  ledgerMapNumber: dto.children[6].value,
  proposalsToFlush:
    dto.children[11].children?.map((elem) => elem.children[1].value) || [],
  proposalsMapNumber: dto.children[12].value,
  quorumThresholdAtCycle: {
    lastUpdatedCycle: Number(dto.children[13].children[0].value),
    quorumThreshold: dto.children[13].children[1].value,
    staked: dto.children[13].children[2].value,
  },
  start_time: dto.children[14].value,
  totalSupply: {
    0: dto.children[15].children[0].value,
  },
  fixedProposalFeeInToken: dto.children[18].value,
  governanceTotalSupply: dto.children[19].value,
  maxProposals: Number(dto.children[20].value),
  maxQuorumChange: dto.children[21].value,
  maxQuorumThreshold: dto.children[22].value,
  maxVotes: dto.children[23].value,
  minQuorumThreshold: dto.children[24].value,
  votingPeriod: Number(dto.children[25].value),
  proposalExpiredTime: Number(dto.children[27].value),
  proposalFlushTime: Number(dto.children[28].value),
  quorumChange: dto.children[29].value,
});
