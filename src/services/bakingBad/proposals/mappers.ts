import { Proposal, ProposalsDTO } from "./types";

export const dtoToProposals = (proposalsDTO: ProposalsDTO): Proposal[] => {
  return proposalsDTO.map((dto) => ({
    id: dto.data.key.value,
    upVotes: dto.data.value.children[0].value,
    downVotes: dto.data.value.children[1].value,
    startDate: dto.data.value.children[2].value,
    agoraPostId: dto.data.value.children[3].children[0].value,
    proposer: dto.data.value.children[4].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
  }));
};
