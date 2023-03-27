import { BaseDAO } from "services/contracts/baseDAO"
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { metadataParams, params, network } from "./constants"

export const createTestDAO = async (Tezos: any) => {
  const metadata = await deployMetadataCarrier({
    ...metadataParams,
    tezos: Tezos
  })

  if (!metadata) {
    console.log("Error deploying treasury DAO: There's not address of metadata")
    return
  }

  const account = await Tezos.wallet.pkh()
  console.log("account: ", account)

  const contract = await BaseDAO.baseDeploy("lambda", {
    tezos: Tezos,
    metadata,
    params,
    network
  })
  console.log("contract: ", contract)

  const address = contract.address
  console.log("address: ", address)

  expect(address).not.toBe(null)

  const daoContract = await Tezos.wallet.at(address)

  return daoContract
}
