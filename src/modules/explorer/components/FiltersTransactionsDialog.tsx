import React, { useEffect, useState } from "react"
import { Grid, TextField, Typography, styled, withStyles } from "@material-ui/core"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"
import { TransactionsFilters } from "../pages/Treasury"

export enum TransactionStatus {
  COMPLETED = "applied",
  PENDING = "pending",
  FAILED = "failed"
}

interface Props {
  currentFilters: TransactionsFilters | undefined
  open: boolean
  handleClose: () => void
  saveFilters: (options: TransactionsFilters) => void
}

const SectionTitle = styled(Typography)({
  fontSize: "18px !important",
  fontWeight: 600
})

const Container = styled(Grid)({
  marginTop: 6,
  gap: 24
})

const CustomTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
      background: "#2F3438",
      borderRadius: 8,
      padding: 16
    },
    "& .MuiInputBase-root": {
      textWeight: 300
    },
    "& .MuiInput-underline": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none !important"
    }
  }
})(TextField)

const StatusButton = styled(Grid)(({ theme }) => ({
  "background": theme.palette.primary.main,
  "padding": "8px 16px",
  "borderRadius": 50,
  "marginRight": 16,
  "marginBottom": 16,
  "cursor": "pointer",
  "textTransform": "capitalize",
  "&:hover": {
    background: "rgba(129, 254, 183, .4)"
  }
}))

interface StatusOption {
  label: string
}

export const FilterTransactionsDialog: React.FC<Props> = ({ open, handleClose, saveFilters, currentFilters }) => {
  const [status, setStatus] = useState<StatusOption[]>([])
  const [token, setToken] = useState<string | null>("")
  const [sender, setSender] = useState<string | null>("")
  const [receiver, setReceiver] = useState<string | null>("")

  const [filters, setFilters] = useState<StatusOption>()
  const ariaLabel = { "aria-label": "description" }

  useEffect(() => {
    setStatus([])
    setStatusOptions()
    if (currentFilters) {
      setToken(currentFilters?.token)
      setSender(currentFilters.sender)
      setReceiver(currentFilters.receiver)
      setFilters(currentFilters.status)
    }
  }, [currentFilters])

  const setStatusOptions = () => {
    const values = Object.values(TransactionStatus)
    for (const item in values) {
      const obj = {
        label: values[item]
      }
      setStatus(oldArray => [...oldArray, obj])
    }
  }

  const isSelected = (item: StatusOption) => {
    return filters && filters.label === item.label ? true : false
  }

  const saveStatus = (status: StatusOption) => {
    if (status.label === filters?.label) {
      setFilters(undefined)
    } else {
      setFilters(status)
    }
  }

  const showFilters = () => {
    const filterObject: TransactionsFilters = {
      token: token,
      receiver: receiver,
      sender: sender,
      status: filters
    }
    saveFilters(filterObject)
    handleClose()
  }

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        <Container container direction="column">
          <Grid item>
            <SectionTitle>Sort by</SectionTitle>
          </Grid>
          <Grid item>
            <Grid item container direction="row">
              {status.length > 0 &&
                status.map((item, index) => {
                  return (
                    <StatusButton
                      item
                      key={`status-${index}`}
                      style={isSelected(item) ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
                    >
                      <Typography onClick={() => saveStatus(item)}>{item.label}</Typography>
                    </StatusButton>
                  )
                })}
            </Grid>
          </Grid>
          <Grid item>
            <SectionTitle>Token</SectionTitle>
          </Grid>
          <Grid item>
            <CustomTextField
              onChange={event => setToken(event.target.value)}
              style={{ width: "40%" }}
              name="test"
              value={token}
              placeholder="Token"
              inputProps={ariaLabel}
            />
          </Grid>

          <Grid item>
            <SectionTitle>Receiving Address</SectionTitle>
          </Grid>
          <Grid item>
            <CustomTextField
              onChange={event => setReceiver(event.target.value)}
              name="test"
              value={receiver}
              placeholder="Address"
              inputProps={ariaLabel}
            />
          </Grid>

          <Grid item>
            <SectionTitle>Sending Address</SectionTitle>
          </Grid>
          <Grid item>
            <CustomTextField
              onChange={event => setSender(event.target.value)}
              name="test"
              value={sender}
              placeholder="Address"
              inputProps={ariaLabel}
            />
          </Grid>
        </Container>

        <Container container direction="row" justifyContent="flex-end">
          <SmallButton color="secondary" variant="contained" onClick={showFilters}>
            Apply
          </SmallButton>
        </Container>
      </ResponsiveDialog>
    </>
  )
}
