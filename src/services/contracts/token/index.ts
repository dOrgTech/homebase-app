import { MichelsonMap, TezosToolkit } from "@taquito/taquito"
import BigNumber from "bignumber.js"
import { TokenContractParams } from "modules/creator/deployment/state/types"
import { formatUnits } from "../utils"
import fa2_single_asset_delegated from "./assets/fa2_single_asset_delegated"

interface Tezos {
  tezos: TezosToolkit
  account: string
}

export const deployTokenContract = async ({
  tokenSettings,
  tokenDistribution,
  tezos,
  account,
  currentBlock
}: TokenContractParams & Tezos & any) => {
  try {
    const metadata = MichelsonMap.fromLiteral({
      "": Buffer.from("tezos-storage:contents", "ascii").toString("hex"),
      "contents": Buffer.from(
        JSON.stringify({
          version: "v0.0.1",
          name: tokenSettings.name,
          description: tokenSettings.description,
          authors: ["Tezos Homebase"],
          source: {
            tools: ["Ligo"]
          },
          interfaces: ["TZIP-012", "TZIP-016"]
        }),
        "ascii"
      ).toString("hex")
    })
    const storage = {
      admin: {
        admin: account,
        paused: false
      },
      assets: {
        ledger: new MichelsonMap(),
        voting_power_history: new MichelsonMap(),
        voting_power_history_sizes: new MichelsonMap(),
        delegates: new MichelsonMap(),
        operators: new MichelsonMap(),
        token_metadata: new MichelsonMap(),
        total_supply: 0,
        minter: account
      },
      metadata: metadata
    }
    const index = 0
    const totalSupply =
      tokenSettings.totalSupply &&
      tokenSettings.decimals &&
      formatUnits(new BigNumber(tokenSettings.totalSupply), tokenSettings.decimals)

    storage.assets.total_supply = totalSupply.toString()
    tokenDistribution.holders.map((holder: { amount: BigNumber.Value; walletAddress: any }) => {
      if (holder.amount && tokenSettings.decimals) {
        storage.assets.ledger.set(
          holder.walletAddress,
          formatUnits(new BigNumber(holder.amount), tokenSettings.decimals).toString()
        )
        storage.assets.voting_power_history.set([holder.walletAddress, 0], {
          from_block: currentBlock,
          amount: formatUnits(new BigNumber(holder.amount), tokenSettings.decimals).toString()
        })
        storage.assets.voting_power_history_sizes.set(holder.walletAddress, 1)
      }
    })
    storage.assets.token_metadata.set(index, {
      token_id: index,
      token_info: MichelsonMap.fromLiteral({
        symbol: Buffer.from(tokenSettings.symbol, "ascii").toString("hex"),
        name: Buffer.from(tokenSettings.name, "ascii").toString("hex"),
        decimals: tokenSettings.decimals && Buffer.from(tokenSettings.decimals.toString(), "ascii").toString("hex"),
        shouldPreferSymbol: Buffer.from("true", "ascii").toString("hex"),
        description: Buffer.from(tokenSettings.description, "ascii").toString("hex"),
        thumbnailUri: Buffer.from(tokenSettings.icon, "ascii").toString("hex")
      })
    })
    const t = tezos.wallet.originate({
      code: fa2_single_asset_delegated,
      storage
    })
    const c = await t.send()
    const contract = await c.contract()

    return contract
  } catch (e) {
    throw e
  }
}
