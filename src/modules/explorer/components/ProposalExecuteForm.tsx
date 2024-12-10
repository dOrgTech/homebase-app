import { Form, Formik } from "formik"
import React, { useEffect } from "react"
import { genLambda, parseContract } from "../../../services/aci"
import { RenderItem } from "./aci/Fields"
import type { TezosToolkit } from "@taquito/taquito"
import type { BeaconWallet } from "@taquito/beacon-wallet"
import type BigNumber from "bignumber.js"
import { useTezos } from "services/beacon/hooks/useTezos"
import { SmallButtonDialog } from "modules/common/SmallButton"
import { useDAOID } from "../pages/DAO/router"
import { useDAO } from "services/services/dao/hooks/useDAO"

type contractStorage = { version: string } & {
  [key: string]: any
  proposal_counter: BigNumber
  balance: string
  threshold: BigNumber
  owners: Array<string>
}

type tezosState = {
  beaconWallet: BeaconWallet
  contracts: any // DAO Contracts
  address: string | null // Logged in User Address
  balance: string | null // Logged in user balance
  currentContract: string | null // Contract Address
  currentStorage: contractStorage | null
}

function ProposalExecuteForm(
  props: React.PropsWithoutRef<{
    address: string // Input contract Address
    amount: number
    shape: any
    reset: () => void
    setField: (lambda: string, metadata: string) => void
    setLoading: (x: boolean) => void
    setState: (shape: any) => void
    onReset?: () => void
    loading: boolean
    onShapeChange: (v: object) => void
  }>
) {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  const address = props.address
  const loading = props.loading
  const { tezos } = useTezos()

  useEffect(() => {
    if (!Object.keys(props.shape).length && !loading) {
      ;(async () => {
        try {
          const c = await tezos.contract.at(address)
          const initTokenTable: Record<string, any> = {}
          const token = await parseContract(c, initTokenTable)
          props.setState({ init: initTokenTable, token, contract: c })
        } catch (e) {
          console.error("Error fetching contract:", e)
        }
      })()
    }
  }, [address, loading, props, props.shape, tezos.contract])

  return (
    <div className="w-full text-white proposal-execute-form">
      <Formik
        enableReinitialize
        // this is the initial values of the form input-2 upto input-43
        initialValues={props?.shape?.init || {}}
        onSubmit={() => {}}
        validateOnMount={true}
        validate={values => {
          props.onShapeChange(values)
          try {
            // ACI: This sets the lambda and metadata fields
            if (dao?.data?.address) genLambda("1.0.0", props, values)
          } catch (e) {
            // setSubmitError((e as Error).message);
          }
        }}
      >
        {_ => {
          return (
            <Form className="align-self-center col-span-2 flex w-full grow flex-col items-center justify-center justify-self-center">
              <div className="h-fit-content md:min-h-96 mb-2 grid w-full grid-flow-row items-start gap-4 overflow-y-auto">
                {!!props.shape.token && <RenderItem token={props.shape?.token} showTitle={false} />}
              </div>
              {/* <div style={{ marginTop: "10px" }}>
                <SmallButtonDialog
                  variant="contained"
                  onClick={e => {
                    e.preventDefault()
                    props.reset()
                    props.onReset?.()
                  }}
                >
                  Reset
                </SmallButtonDialog>
              </div> */}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
export default ProposalExecuteForm
