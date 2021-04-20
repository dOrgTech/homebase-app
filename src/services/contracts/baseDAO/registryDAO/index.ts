import { getRegistry } from "./../../../bakingBad/registry/index";
import { RegistryProposal } from "./../../../bakingBad/proposals/types";
import { dtoToRegistryProposals } from "./../../../bakingBad/proposals/mappers";
import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  ContractProvider,
} from "@taquito/taquito";
import { Tzip16ContractAbstraction } from "@taquito/tzip16";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import {
  RegistryProposalsDTO,
} from "services/bakingBad/proposals/types";
import { getStorage } from "services/bakingBad/storage";
import {
  RegistryStorage,
  RegistryStorageDTO,
} from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { getContract } from "..";
import { getDAOListMetadata } from "../../metadataCarrier";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { BaseConstructorParams, BaseDAO } from "..";
import { RegistryItem } from "./types";

interface RegistryConstructorParams extends BaseConstructorParams {
  storage: RegistryStorage;
}

export class RegistryDAO extends BaseDAO {
  protected constructor(params: RegistryConstructorParams) {
    super(params);

    this.storage = params.storage;
  }

  private static storageMapper = (dto: RegistryStorageDTO): RegistryStorage => {
    try {
      const result = {
        slashDivisionValue: Number(dto.children[1].children[8].value),
        slashScaleValue: Number(dto.children[1].children[9].value),
        frozenExtraValue: Number(dto.children[1].children[0].value),
        maxProposalSize: Number(dto.children[1].children[2].value),
        proposalReceivers: dto.children[1].children[5].value,
        lastPeriodChange: {
          timestamp: dto.children[5].children[0].value,
          periodNumber: Number(dto.children[5].children[1].value),
        },
        registry: dto.children[1].children[6].value,
        registryAffected: dto.children[1].children[7].value,
        votingPeriod: Number(dto.children[17].value),
        quorumTreshold: Number(dto.children[13].children[0].value),
        proposalsMapNumber: dto.children[12].value,
        ledgerMapNumber: dto.children[6].value,
        proposalsToFlush: dto.children[11].value || [],
        totalSupply: {
          0: Number(dto.children[15].children[0].value),
          1: Number(dto.children[15].children[1].value)
        },
        fixedProposalFeeInToken: Number(dto.children[2].value),
        admin: dto.children[0].value,
      };

      return result;
    } catch (e) {
      throw new Error(
        `Storage mapping failed in RegistryDAO. Probably was wrongly instantiated? Error: ${e}`
      );
    }
  };

  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    prefetched?: {
      contract?: ContractAbstraction<Wallet> & {
        tzip16(
          this: ContractAbstraction<Wallet | ContractProvider>
        ): Tzip16ContractAbstraction;
      };
      metadata?: DAOListMetadata;
    }
  ) => {
    const contract =
      (prefetched && prefetched.contract) ||
      (await getContract(tezos, contractAddress));
    const storageDTO = (await getStorage(
      contractAddress,
      network
    )) as RegistryStorageDTO;
    const storage = RegistryDAO.storageMapper(storageDTO);
    const metadataToUse =
      (prefetched && prefetched.metadata) ||
      (await getDAOListMetadata(contract));
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);

    return new RegistryDAO({
      address: contractAddress,
      ledger,
      template: "registry",
      originationTime,
      storage,
      metadata: metadataToUse,
      tezos,
      network,
    });
  };

  public fetchStorage = async (): Promise<RegistryStorage> => {
    const storageDTO = await getStorage(this.address, this.network);
    return RegistryDAO.storageMapper(storageDTO as RegistryStorageDTO);
  };

  public proposals = async (): Promise<RegistryProposal[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = (await getProposalsDTO(
      proposalsMapNumber,
      this.network
    )) as RegistryProposalsDTO;

    const proposals = dtoToRegistryProposals(proposalsDTO);

    return proposals;
  };

  public propose = async ({
    tokensToFreeze,
    agoraPostId,
    items,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    items: RegistryItem[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    // const michelsonType = parser.parseData(`(list (or (pair %xtz_transfer_type (mutez %amount) (address %recipient))
    // (pair %token_transfer_type
    //    (address %contract_address)
    //    (list %transfer_list
    //       (pair (address %from_)
    //             (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))))))`);
    // const schema = new Schema(michelsonType as Expr);
    // const data = schema.Encode()
    const diff = items.map(({ key, newValue }) => ({
      key,
      new_value: newValue,
    }));

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      "proposal_type",
      agoraPostId,
      diff
    );

    const result = await contractMethod.send();

    return result;
  };

  public getRegistry = async () => {
    const registry = await getRegistry(0, this.network);

    return registry;
  };
}
