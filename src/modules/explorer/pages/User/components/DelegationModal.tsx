import React, { useEffect, useState } from "react"
import { Grid, Radio, TextField, Typography, styled } from "@material-ui/core"
import { DelegationsType, matchTextToStatus } from "./DelegationBanner"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"
import { useTokenDelegate } from "services/contracts/token/hooks/useTokenDelegate"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../../DAO/router"
import { useTezos } from "services/beacon/hooks/useTezos"
import { toShortAddress } from "services/contracts/utils"

const AddressTextField = styled(TextField)({
  "backgroundColor": "#2f3438",
  "borderRadius": 8,
  "height": 56,
  "padding": "0px 24px",
  "alignItems": "flex-start",
  "boxSizing": "border-box",
  "justifyContent": "center",
  "display": "flex",
  "& .MuiInputBase-root": {
    "width": "100%",
    "& input": {
      textAlign: "initial"
    }
  }
})

export enum ActionTypes {
  SET_DELEGATE = "SET_DELEGATE",
  NOT_DELEGATING = "NOT_DELEGATING"
}

const matchTextToAction = (value: ActionTypes) => {
  switch (value) {
    case ActionTypes.SET_DELEGATE:
      return "Set delegate"
    case ActionTypes.NOT_DELEGATING:
      return "Not delegate"
    default:
      return
  }
}

export const DelegationDialog: React.FC<{
  open: boolean
  onClose: () => void
  status: DelegationsType | undefined
  setDelegationStatus: (value: DelegationsType) => void
  delegationStatus: DelegationsType
  delegatedTo: string | null | undefined
  setShouldRefetch: (value: boolean) => void
}> = ({ status, onClose, open, setShouldRefetch, delegationStatus, delegatedTo }) => {
  const [options, setOptions] = useState<ActionTypes[]>([ActionTypes.NOT_DELEGATING, ActionTypes.SET_DELEGATE])
  const [selectedOption, setSelectedOption] = useState()
  const { mutate: delegateToken, data: tokenData } = useTokenDelegate()
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const { tezos, connect, network, account } = useTezos()
  const [newDelegate, setNewDelegate] = useState("")

  const closeDialog = () => {
    setSelectedOption(undefined)
    onClose()
  }

  const saveInfo = () => {
    updateStatus()
    closeDialog()
  }

  const updateStatus = () => {
    if (selectedOption === ActionTypes.SET_DELEGATE) {
      if (newDelegate && data?.data.token.contract) {
        delegateToken(
          { tokenAddress: data?.data.token.contract, delegateAddress: newDelegate },
          { onSuccess: () => setShouldRefetch(true) }
        )
        return
      }
    } else if (selectedOption === ActionTypes.NOT_DELEGATING) {
      if (data?.data.token.contract) {
        delegateToken(
          { tokenAddress: data?.data.token.contract, delegateAddress: null },
          { onSuccess: () => setShouldRefetch(true) }
        )
      }
      return
    }
  }

  return (
    <ResponsiveDialog open={open} onClose={closeDialog} title={"Delegation Status"}>
      <Grid container direction={"column"} style={{ gap: 20 }}>
        <Grid item style={{ gap: 8 }} container direction="column">
          <Typography color="textPrimary">Current Status</Typography>
          <Typography color="secondary" style={{ fontWeight: 200 }}>
            {matchTextToStatus(status)}
            {delegationStatus === DelegationsType.DELEGATING ? toShortAddress(delegatedTo ? delegatedTo : "") : null}
          </Typography>
        </Grid>

        {options.map(item => {
          return (
            <>
              <Grid
                key={item}
                item
                style={{ gap: 8 }}
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="textPrimary">{matchTextToAction(item)}</Typography>
                <Radio
                  checked={selectedOption === item}
                  onChange={(e: any) => setSelectedOption(e.target.value)}
                  value={item}
                  name="radio-buttons"
                  inputProps={{ "aria-label": "A" }}
                />
                {item === ActionTypes.SET_DELEGATE ? (
                  <AddressTextField
                    onChange={e => {
                      setNewDelegate(e.target.value)
                    }}
                    type="text"
                    disabled={selectedOption !== ActionTypes.SET_DELEGATE}
                    placeholder="Enter Address"
                    InputProps={{ disableUnderline: true }}
                  />
                ) : null}
              </Grid>
            </>
          )
        })}

        <Grid container direction="row" justifyContent="flex-end">
          <SmallButton disabled={selectedOption === undefined} onClick={saveInfo}>
            Submit
          </SmallButton>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  )
}
