import { Proposal, ProposalsDTO } from "./types";

export const dtoToProposals = (proposalsDTO: ProposalsDTO): Proposal[] => {
  console.log(proposalsDTO);
  return proposalsDTO.map((dto) => ({
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[0].value),
    downVotes: Number(dto.data.value.children[1].value),
    startDate: dto.data.value.children[2].value,
    agoraPostId: dto.data.value.children[3].children[0].value,
    proposer: dto.data.value.children[4].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    voters: dto.data.value.children[6].value
  }));
};
