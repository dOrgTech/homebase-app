import BigNumber from "bignumber.js"
import { MigrationParams } from "modules/creator/state"

export const bobPrivKey = "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt"
export const alicePrivKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"

export const network = "ghostnet"

export const url = "http://localhost:3000"

export const metadataParams: any = {
  keyName: "metadataKey",
  metadata: {
    frozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is Test DAO",
      governanceToken: {
        address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        tokenId: "0",
        tokenMetadata: {
          id: "42096569352193",
          contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "ghostnet",
          supply: new BigNumber("100000000")
        }
      },
      administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      decimals: 18
    },
    unfrozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is Test DAO",
      governanceToken: {
        address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        tokenId: "0",
        tokenMetadata: {
          id: "42096569352193",
          contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "ghostnet",
          supply: "1.0000100000002e+30"
        }
      },
      administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      decimals: 18
    },
    description: "This is Test DAO",
    authors: ["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"],
    template: "lambda"
  }
}

export const params: MigrationParams = {
  template: "lambda",
  orgSettings: {
    name: "Test DAO",
    symbol: "TEST",
    description: "This is Test DAO",
    governanceToken: {
      address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
      tokenId: "0",
      tokenMetadata: {
        id: "42096569352193",
        contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        level: 717794,
        token_id: 0,
        symbol: "TEST",
        name: "Test",
        decimals: 18,
        network: "ghostnet",
        supply: new BigNumber("100000000"),
        standard: "FA2"
      }
    },
    administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    guardian: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
  },
  votingSettings: {
    votingBlocks: 2,
    proposeStakeRequired: 5,
    returnedTokenPercentage: 8,
    minXtzAmount: 1,
    maxXtzAmount: 10,
    proposalFlushBlocks: 4,
    proposalExpiryBlocks: 6
  },
  quorumSettings: {
    quorumThreshold: 2,
    minQuorumAmount: 1,
    maxQuorumAmount: 99,
    quorumChange: 5,
    quorumMaxChange: 19
  }
}
