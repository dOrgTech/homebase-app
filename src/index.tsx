import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import express from "express"
import bodyParser from "body-parser"
import { DAOTemplate } from "./modules/creator/state"
import { Network } from "./services/beacon"
import { initTezosInstance } from "./services/beacon/hooks/useTezos"
import { TezosToolkit } from "@taquito/taquito"
import { deployMetadataCarrier } from "./services/contracts/metadataCarrier/deploy"
import { BaseDAO } from "./services/contracts/baseDAO"
import { InMemorySigner } from "@taquito/signer"
import { EnvKey, getEnv } from "services/config"
import cors from "cors"

// BigNumber.config({ DECIMAL_PLACES:  })

dayjs.extend(localizedFormat)

const app = express()
const port = 3001
const ALICE_PRIV_KEY = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(
  cors({
    origin: "*"
  })
)

app.post("/deploy", async (req, res) => {
  try {
    const body = req.body.deployParams
    const { metadataParams, params } = body

    const template: DAOTemplate = "lambda"
    const network: Network = "ghostnet"

    const newTezos: TezosToolkit = initTezosInstance("ghostnet")
    const signer = await InMemorySigner.fromSecretKey(ALICE_PRIV_KEY)
    newTezos.setProvider({ signer })

    params.orgSettings.administrator = await newTezos.wallet.pkh()

    const metadata = await deployMetadataCarrier({
      ...metadataParams,
      tezos: newTezos,
      connect: undefined
    })

    if (!metadata) {
      throw "No Metadata"
    }

    const contract = await BaseDAO.baseDeploy(template, {
      tezos: newTezos,
      metadata,
      params,
      network
    })

    if (!contract) {
      throw new Error(`Error deploying ${template}DAO`)
    }

    const tx = await BaseDAO.transfer_ownership(contract.address, contract.address, newTezos)

    if (!tx) {
      throw new Error(`Error transferring ownership of ${template}DAO to itself`)
    }
    res.send({ address: contract.address })
  } catch (error) {
    console.log("error: ", error)
    res.send("OOOppsiess")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
