import {
  FA2Transfer,
  FA2TransferDTO,
  RegistryProposal,
  RegistryProposalsDTO,
  Transfer,
  TreasuryProposal,
  Voter,
  VotersDTO,
  XTZTransferDTO,
} from "./types";
import {
  TreasuryProposalsDTO,
} from "services/bakingBad/proposals/types";
import { Parser } from "@taquito/michel-codec";
import { mutezToXtz } from "services/contracts/utils";

const parser = new Parser()

export const dtoToTreasuryProposals = (
  proposalsDTO: TreasuryProposalsDTO
): TreasuryProposal[] => {
  return proposalsDTO.map((dto) => {
    return {
      id: dto.data.key.value,
      upVotes: Number(dto.data.value.children[7].value),
      downVotes: Number(dto.data.value.children[0].value),
      startDate: dto.data.value.children[6].value,
      agoraPostId: dto.data.value.children[1].children[0].value,
      proposer: dto.data.value.children[3].value,
      proposerFrozenTokens: dto.data.value.children[5].value,
      transfers: mapTransfers(dto.data.value.children[1].children[1].value),
      cycle: Number(dto.data.value.children[2].value),
      voters: dtoToVoters(dto.data.value.children[8]),
    }
  });
};

const decodeXTZTransfer = (dto: XTZTransferDTO): Transfer => {
  return {
    amount: mutezToXtz(dto.args[0].args[0].int),
    beneficiary: dto.args[0].args[1].string,
    type: "XTZ"
  }
}

const decodeFA2Transfer = (dto: FA2TransferDTO): FA2Transfer => {
  return {
    contractAddress: dto.args[0].args[0].string,
    beneficiary: dto.args[0].args[1][0].args[1][0].args[0].string,
    tokenId: dto.args[0].args[1][0].args[1][0].args[1].args[0].int,
    amount: dto.args[0].args[1][0].args[1][0].args[1].args[1].int,
    type: "FA2"
  }
}

const dtoToVoters = (
  votersDTO: VotersDTO
): Voter[] => {

  const voters = votersDTO.children

  if (!voters) {
    return [];
  }

  return voters.map((voter) => ({
    address: voter.children[2].value,
    value: Number(voter.children[0].value),
    support: Boolean(voter.children[1].value)
  }));
};

const mapTransfers = (
  transferMichelsonString: string
): TreasuryProposal["transfers"] => {
  if(transferMichelsonString === "{ { } }") {
    return []
  }

  const transferStringNoBraces = transferMichelsonString.substr(3, transferMichelsonString.length - 6)
  return transferStringNoBraces.split(" ; ").map(transferString => {
    const transfer = parser.parseData(transferString) as XTZTransferDTO | FA2TransferDTO
    if(transfer.prim === "Left") {
      return decodeXTZTransfer(transfer)
    } else {
      return decodeFA2Transfer(transfer)
    }
  })
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
  //TODO: CHANGE THIS
  return proposalsDTO.map((dto) => ({
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[0].value),
    downVotes: Number(dto.data.value.children[1].value),
    startDate: dto.data.value.children[2].value,
    agoraPostId: dto.data.value.children[3].children[0].children[0].value,
    proposer: dto.data.value.children[4].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    list: mapRegistryList(dto),
    voters: [],
    cycle: 0,
    // dtoToVoters(dto),
  }));
};
