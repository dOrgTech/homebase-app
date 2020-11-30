import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import "./App.css";
import { Navbar } from "./components/common/toolbar";
import { DAOCreate } from "./pages/daocreator";
import { Home } from "./pages/Home";

const Tezos = new TezosToolkit("https://api.tez.ie/rpc/carthagenet");
import { importKey } from "@taquito/signer";

import { code } from "./contracts/baseDAO";

importKey(Tezos, "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq");
const App: React.FC = () => {
  const deployContract = async () => {
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
    // sProposals.set("", {
    //   upvotes: 100,
    //   downvotes: 200,
    //   startDate: "1231223158132",
    //   metadata: "1",
    //   proposer: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    //   proposer_frozen_token: 1,
    //   voters: [],
    // });
    try {
      const t = await Tezos.contract.originate({
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
      });
      console.log("waiting for confirmation ", t);
      await t.contract();
      console.log("deployment completed");
    } catch (e) {
      console.log("error ", e);
    }
  };
  return (
    <div className="App">
      <button onClick={deployContract}>Deploy contract</button>
    </div>
  );
};

export default App;
