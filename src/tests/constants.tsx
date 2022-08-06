import BigNumber from "bignumber.js";
import { MigrationParams } from "modules/creator/state";

export const bobPrivKey = "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt";
console.log("bobPrivKey: ", bobPrivKey);
export const alicePrivKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq";

export const network = "devnet";

export const url = "http://localhost:3000";

export const metadataParams: any = {
  keyName: "metadataKey",
  metadata: {
    frozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is the DAO",
      governanceToken: {
        address: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
        tokenId: "0",
        tokenMetadata: {
          contract: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "devnet",
          supply: "1e+25",
        },
      },
      administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      decimals: 18,
    },
    unfrozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is the DAO",
      governanceToken: {
        address: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
        tokenId: "0",
        tokenMetadata: {
          contract: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "ithacanet",
          supply: "1e+25",
        },
      },
      administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      decimals: 18,
    },
    description: "This is the DAO",
    authors: ["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"],
    template: "registry",
  },
};

export const params: MigrationParams = {
  template: "registry",
  orgSettings: {
    name: "Test DAO",
    symbol: "TEST",
    description: "This is the DAO",
    governanceToken: {
      address: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
      tokenId: "0",
      tokenMetadata: {
        id: '',
        contract: "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx",
        level: 717794,
        token_id: 0,
        symbol: "TEST",
        name: "Test",
        decimals: 18,
        network: "devnet",
        supply: new BigNumber("1e+25"),
      },
    },
    administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
  },
  votingSettings: {
    votingBlocks: 10,
    proposeStakeRequired: 5,
    returnedTokenPercentage: 25,
    minXtzAmount: 5,
    maxXtzAmount: 10,
    proposalFlushBlocks: 18,
    proposalExpiryBlocks: 22,
  },
  quorumSettings: {
    quorumThreshold: 2,
    minQuorumAmount: 1,
    maxQuorumAmount: 99,
    quorumChange: 5,
    quorumMaxChange: 19,
  },
};