import { Grid, Radio, TextField, Typography, styled } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { DelegationsType, matchTextToStatus } from "./DelegationBanner"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"

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
  setDelegationStatus: (value: DelegationsType | undefined) => void
}> = ({ status, onClose, open, setDelegationStatus }) => {
  const [options, setOptions] = useState<ActionTypes[]>([])
  const [selectedOption, setSelectedOption] = useState()

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
      return setDelegationStatus(DelegationsType.DELEGATING)
    }
    if (selectedOption === ActionTypes.STOP_ACCEPTING_DELEGATIONS || ActionTypes.STOP_DELEGATING) {
      return setDelegationStatus(DelegationsType.NOT_ACCEPTING_DELEGATION)
    }
    if (selectedOption === ActionTypes.ACCEPT_DELEGATIONS) {
      return setDelegationStatus(DelegationsType.ACCEPTING_DELEGATION)
    }
  }

  const getOptionsByStatus = (status: DelegationsType | undefined) => {
    switch (status) {
      case DelegationsType.NOT_ACCEPTING_DELEGATION:
        const optionsOne = [ActionTypes.ACCEPT_DELEGATIONS, ActionTypes.DELEGATE]
        setOptions(optionsOne)
        break
      case DelegationsType.ACCEPTING_DELEGATION:
        const optionsTwo = [ActionTypes.STOP_ACCEPTING_DELEGATIONS, ActionTypes.DELEGATE]
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
            {matchTextToStatus(status)}
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
                  <AddressTextField type="text" placeholder="Enter Address" InputProps={{ disableUnderline: true }} />
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
