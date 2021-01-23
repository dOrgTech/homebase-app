import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import { treasuryCode } from "../contracts/treasuryDAO";
import { importKey, InMemorySigner } from "@taquito/signer";

const Tezos = new TezosToolkit("https://api.tez.ie/rpc/delphinet");
// importKey(Tezos, "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq");
// importKey(Tezos, "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq");

interface TreasuryContractParams {
  
}

export const deployContract = async (tezos: TezosToolkit, parameters) => {
  const sLedger = new MichelsonMap();
  sLedger.set({ 0: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb", 1: 1 }, 1);

  const sOperators = new MichelsonMap();
  sOperators.set(
    {
      owner: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
      operator: "tz1PXnvy7VLyKjKgzGDSdrJv4iHhCh78S25p",
    },
    1
  );

  const sProposals = new MichelsonMap();

  try {
    Tezos.setProvider({
      signer: await InMemorySigner.fromSecretKey("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"),
    });
    console.log("Originating");
    const t = await Tezos.contract.originate({
      code: treasuryCode,
      storage: {
        sLedger: new MichelsonMap(),
        sOperators: new MichelsonMap(),
        sTokenAddress: "tz1U1HAnn7E3TTfYc18quYXeGtAzHX1Z3jCC",
        sAdmin: "tz1U1HAnn7E3TTfYc18quYXeGtAzHX1Z3jCC",
        sPendingOwner: "tz1U1HAnn7E3TTfYc18quYXeGtAzHX1Z3jCC",
        sMigrationStatus: { notInMigration: "Unit" },
        sVotingPeriod: 1,
        sQuorumThreshold: 1,
        sExtra: {
          frozen_scale_value: 0,
          frozen_extra_value: 1,
          slash_scale_value: 0,
          slash_division_value: 1,
          min_xtz_amount: 1,
          max_xtz_amount: 10,
          max_proposal_size: 10,
        },
        sProposals: new MichelsonMap(),
        sProposalKeyListSortByDate: [["2021-01-06T05:14:43Z", "CAFE"]],
        sPermitsCounter: 0,
      },
    });
    console.log("waiting for confirmation ", t);
    const c = await t.contract();
    console.log("deployment completed", c);
  } catch (e) {
    console.log("error ", e);
  }
};
