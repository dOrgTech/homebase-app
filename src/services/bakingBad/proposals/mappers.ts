import {
  RegistryProposal,
  RegistryProposalsDTO,
  TreasuryProposal,
} from "./types";
import {
  ProposalsDTO,
  TreasuryProposalsDTO,
} from "services/bakingBad/proposals/types";

export const dtoToTreasuryProposals = (
  proposalsDTO: TreasuryProposalsDTO
): TreasuryProposal[] => {
  return proposalsDTO.map((dto) => ({
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[0].value),
    downVotes: Number(dto.data.value.children[1].value),
    startDate: dto.data.value.children[2].value,
    agoraPostId: dto.data.value.children[3].children[0].value,
    proposer: dto.data.value.children[4].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    transfers: mapTransfers(dto),
    voters: dtoToVoters(dto),
  }));
};

const dtoToVoters = (
  proposalsDTO: ProposalsDTO[number]
): { address: string; value: number }[] => {
  const votersDTO = proposalsDTO.data.value.children[6].children;

  if (!votersDTO) {
    return [];
  }

  return votersDTO.map((voterDTO) => ({
    address: voterDTO.children[0].value,
    value: Number(voterDTO.children[1].value),
  }));
};

const mapTransfers = (
  dto: ProposalsDTO[number]
): TreasuryProposal["transfers"] => {
  const metadataDTO = dto.data.value.children[3].children[1];

  if (!metadataDTO || !metadataDTO.children) {
    return [];
  }

  const mutezTransfersDTO = metadataDTO.children;

  return mutezTransfersDTO.map((transfer) => ({
    beneficiary: transfer.children[0].children[1].value,
    amount: transfer.children[0].children[0].value,
    currency: transfer.children[0].children[0].type,
  }));
};

const mapRegistryList = (
  dto: RegistryProposalsDTO[number]
): RegistryProposal["list"] => {
  const listDto = dto.data.value.children[3].children[0].children[1].children;

  if (!listDto) {
    return [];
  }

  return listDto.map((listItem) => ({
    key: listItem.children[0].value,
    value: listItem.children[1].value,
  }));
};

export const dtoToRegistryProposals = (
  proposalsDTO: RegistryProposalsDTO
): RegistryProposal[] => {
  return proposalsDTO.map((dto) => ({
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[0].value),
    downVotes: Number(dto.data.value.children[1].value),
    startDate: dto.data.value.children[2].value,
    agoraPostId: dto.data.value.children[3].children[0].children[0].value,
    proposer: dto.data.value.children[4].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    list: mapRegistryList(dto),
    voters: dtoToVoters(dto),
  }));
};
