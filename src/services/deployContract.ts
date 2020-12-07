import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import { code } from "../contracts/baseDAO";
import { importKey } from "@taquito/signer";

const Tezos = new TezosToolkit("https://api.tez.ie/rpc/carthagenet");
importKey(Tezos, "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq");

export const deployContract = async (tezos: TezosToolkit) => {
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
    const t = await tezos.wallet
      .originate({
        code,
        storage: {
          sLedger,
          sOperators,
          sTokenAddress: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          sAdmin: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
          sPendingOwner: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          sMigrationStatus: {
            migratingTo: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          },
          sVotingPeriod: 1,
          sQuorumThreshold: 1,
          sExtra: 1,
          sProposals,
          sProposalKeyListSortByDate: [""],
        },
      })
      .send();
    console.log("waiting for confirmation ", t);
    const c = await t.contract();
    console.log("deployment completed", c);
  } catch (e) {
    console.log("error ", e);
  }
};
