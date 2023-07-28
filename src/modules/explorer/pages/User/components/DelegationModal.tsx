import { Grid, Radio, TextField, Typography, styled } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { DelegationsType, matchTextToStatus } from "./DelegationBanner"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"
import { useTokenDelegate } from "services/contracts/token/hooks/useTokenDelegate"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../../DAO/router"
import { useTezos } from "services/beacon/hooks/useTezos"

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
  ACCEPT_DELEGATIONS = "ACCEPT_DELEGATIONS",
  DELEGATE = "DELEGATE",
  CHANGE_DELEGATE = "CHANGE_DELEGATE",
  STOP_ACCEPTING_DELEGATIONS = "STOP_ACCEPTING_DELEGATIONS",
  STOP_DELEGATING = "STOP_DELEGATING"
}

const matchTextToAction = (value: ActionTypes) => {
  switch (value) {
    case ActionTypes.ACCEPT_DELEGATIONS:
      return "Accept Delegations"
    case ActionTypes.DELEGATE:
      return "Delegate"
    case ActionTypes.CHANGE_DELEGATE:
      return "Change Delegate"
    case ActionTypes.STOP_ACCEPTING_DELEGATIONS:
      return "Stop Accepting Delegations"
    case ActionTypes.STOP_DELEGATING:
      return "Stop Delegating"
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
}> = ({ status, onClose, open, setDelegationStatus, delegationStatus, delegatedTo }) => {
  const [options, setOptions] = useState<ActionTypes[]>([])
  const [selectedOption, setSelectedOption] = useState()
  const { mutate: delegateToken } = useTokenDelegate()
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const { tezos, connect, network, account } = useTezos()
  const [newDelegate, setNewDelegate] = useState("")

  useEffect(() => {
    getOptionsByStatus(status)
  }, [status])

  const closeDialog = () => {
    setSelectedOption(undefined)
    onClose()
  }

  const saveInfo = () => {
    updateStatus()
    closeDialog()
  }

  const updateStatus = () => {
    if (selectedOption === ActionTypes.DELEGATE || selectedOption === ActionTypes.CHANGE_DELEGATE) {
      if (newDelegate && data?.data.token.contract) {
        delegateToken({ tokenAddress: data?.data.token.contract, delegateAddress: newDelegate })
      }
    } else if (
      selectedOption === ActionTypes.STOP_ACCEPTING_DELEGATIONS ||
      selectedOption === ActionTypes.STOP_DELEGATING
    ) {
      if (data?.data.token.contract) {
        delegateToken({ tokenAddress: data?.data.token.contract, delegateAddress: null })
      }
    } else if (selectedOption === ActionTypes.ACCEPT_DELEGATIONS) {
      if (data?.data.token.contract && account) {
        delegateToken({ tokenAddress: data?.data.token.contract, delegateAddress: account })
      }
    }
  }

  const getOptionsByStatus = (status: DelegationsType | undefined) => {
    switch (status) {
      case DelegationsType.NOT_ACCEPTING_DELEGATION:
        const optionsOne = [ActionTypes.ACCEPT_DELEGATIONS, ActionTypes.DELEGATE]
        setOptions(optionsOne)
        break
      case DelegationsType.ACCEPTING_DELEGATION:
        const optionsTwo = [ActionTypes.STOP_ACCEPTING_DELEGATIONS]
        setOptions(optionsTwo)
        break
      case DelegationsType.DELEGATING:
        const optionsThree = [ActionTypes.CHANGE_DELEGATE, ActionTypes.STOP_DELEGATING, ActionTypes.ACCEPT_DELEGATIONS]
        setOptions(optionsThree)
        break
    }
  }

  return (
    <ResponsiveDialog open={open} onClose={closeDialog} title={"Delegation Status"}>
      <Grid container direction={"column"} style={{ gap: 20 }}>
        <Grid item style={{ gap: 8 }} container direction="column">
          <Typography color="textPrimary">Current Status</Typography>
          <Typography color="secondary" style={{ fontWeight: 200 }}>
            {matchTextToStatus(status)} {delegationStatus === DelegationsType.DELEGATING ? delegatedTo : null}
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
                {item === selectedOption &&
                (selectedOption === ActionTypes.DELEGATE || selectedOption === ActionTypes.CHANGE_DELEGATE) ? (
                  <AddressTextField
                    onChange={e => {
                      setNewDelegate(e.target.value)
                    }}
                    type="text"
                    placeholder="Enter Address"
                    InputProps={{ disableUnderline: true }}
                  />
                ) : null}
              </Grid>
            </>
          )
        })}

        <Grid container direction="row" justifyContent="flex-end">
          <SmallButton onClick={saveInfo}>Submit</SmallButton>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  )
}
