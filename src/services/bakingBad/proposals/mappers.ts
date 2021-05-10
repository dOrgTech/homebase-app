import {
  FA2Transfer,
  FA2TransferDTO,
  RegistryItemDTO,
  RegistryUpdateProposal,
  RegistryUpdateProposalsDTO,
  Transfer,
  TransferProposal,
  TransferProposalsDTO,
  Voter,
  VotersDTO,
  XTZTransferDTO,
} from "./types";
import { Parser } from "@taquito/michel-codec";
import { bytes2Char } from "@taquito/tzip16";

const parser = new Parser()

export const dtoToTransferProposals = (
  dto: TransferProposalsDTO[number]
): TransferProposal => {
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
    type: "transfer"
  }
};

const decodeXTZTransfer = (dto: XTZTransferDTO): Transfer => {
  return {
    amount: dto.args[0].args[0].int,
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
): TransferProposal["transfers"] => {
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

export const mapProposalRegistryList = (
  listMichelsonString: string
): RegistryUpdateProposal["list"] => {
  if(listMichelsonString === "{ {} }") {
    return []
  }

  const listStringNoBraces = listMichelsonString.substr(3, listMichelsonString.length - 6)
  return listStringNoBraces.split(" ; ").map(listString => {
    const list = parser.parseData(listString) as RegistryItemDTO;

    return { 
      key: bytes2Char(list.args[0].string),
      value: bytes2Char(list.args[1].args[0].string)
    }
  })
};

export const dtoToRegistryUpdateProposals = (
  dto: RegistryUpdateProposalsDTO[number]
): RegistryUpdateProposal => {
  return {
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[7].value),
    downVotes: Number(dto.data.value.children[0].value),
    startDate: dto.data.value.children[6].value,
    agoraPostId: dto.data.value.children[1].children[0].value,
    proposer: dto.data.value.children[3].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    list: mapProposalRegistryList(dto.data.value.children[1].children[1].value),
    cycle: Number(dto.data.value.children[2].value),
    voters: dtoToVoters(dto.data.value.children[8]),
    type: "registryUpdate"
  };
};
