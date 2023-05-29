import { MichelsonMap, TezosToolkit } from "@taquito/taquito"
import BigNumber from "bignumber.js"
import { TokenContractParams } from "modules/creator/deployment/state/types"
import { formatUnits } from "../utils"
import fa2MultiAsset from "./assets/MultiAsset.json"

interface Tezos {
  tezos: TezosToolkit
  account: string
}

export const deployTokenContract = async ({
  tokenSettings,
  tokenDistribution,
  tezos,
  account
}: TokenContractParams & Tezos) => {
  try {
    const metadata = MichelsonMap.fromLiteral({
      "": Buffer.from("tezos-storage:contents", "ascii").toString("hex"),
      "contents": Buffer.from(
        JSON.stringify({
          version: "v0.0.1",
          name: tokenSettings.name,
          description: tokenSettings.description,
          authors: ["FA2 Bakery"],
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
        pending_admin: null,
        paused: false
      },
      assets: {
        token_total_supply: MichelsonMap.fromLiteral({}),
        ledger: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({})
      },
      metadata: metadata
    }
    const index = 0
    const totalSupply =
      tokenSettings.totalSupply &&
      tokenSettings.decimals &&
      formatUnits(new BigNumber(tokenSettings.totalSupply), tokenSettings.decimals)

    totalSupply && storage.assets.token_total_supply.set(index, totalSupply.toString())
    tokenDistribution.holders.map((holder, holderIndex) => {
      holder.amount &&
        tokenSettings.decimals &&
        storage.assets.ledger.set(
          [holder.walletAddress, index],
          formatUnits(new BigNumber(holder.amount), tokenSettings.decimals).toString()
        )
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
      code: fa2MultiAsset,
      storage
    })
    const c = await t.send()
    const contract = await c.contract()

    return contract
  } catch (e) {
    console.error(e)
  }
}
