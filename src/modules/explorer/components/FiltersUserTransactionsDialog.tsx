import React, { useEffect, useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { Grid, TextField, styled, withStyles } from "@material-ui/core"
import { Typography } from "@mui/material"
import { Dropdown } from "./Dropdown"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { SmallButton } from "modules/common/SmallButton"
import { Filters, TrxFilters } from "../pages/User/components/UserMovements"

export enum TrxStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed"
}

interface Props {
  open: boolean
  handleClose: () => void
  saveFilters: (filters: TrxFilters) => void
}

const SectionTitle = styled(Typography)({
  fontSize: "18px !important",
  fontWeight: 600,
  color: "#fff !important"
})

const Container = styled(Grid)(({ theme }) => ({
  marginTop: 6,
  gap: 24,
  [theme.breakpoints.down("sm")]: {
    marginTop: 30
  }
}))

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
    "& p": {
      position: "absolute",
      right: 16,
      fontWeight: 300
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
  "color": theme.palette.text.primary,
  "borderRadius": 50,
  "marginRight": 16,
  "marginBottom": 16,
  "cursor": "pointer",
  "textTransform": "capitalize",
  "&:hover": {
    background: "rgba(129, 254, 183, .4)"
  }
}))

const ariaLabel = { "aria-label": "description" }

export interface StatusOption {
  label: string
}

export const FilterUserTransactionsDialog: React.FC<Props> = ({ open, handleClose, saveFilters }) => {
  const [token, setToken] = useState<string | null>("")
  const [receiver, setReceiver] = useState<string | null>("")
  const [sender, setSender] = useState<string | null>("")
  const [status, setStatus] = useState<StatusOption[]>([])
  const [filters, setFilters] = useState<StatusOption>()

  const findStatus = () => {
    const values = Object.values(TrxStatus)
    for (const item in values) {
      const obj = {
        label: values[item]
      }
      setStatus(oldArray => [...oldArray, obj])
    }
  }

  useEffect(() => {
    setStatus([])
    findStatus()
  }, [])

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
    console.log("filters")
  }
  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        <Container container direction="column">
          <Grid item>
            <SectionTitle color="textPrimary">Transaction Status</SectionTitle>
          </Grid>
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

          <Grid item>
            <SectionTitle color="textPrimary">Token</SectionTitle>
          </Grid>
          <Grid item xs={12}>
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
            <SectionTitle color="textPrimary">Receiving Address</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              onChange={event => setReceiver(event.target.value)}
              style={{ width: "100%" }}
              name="test"
              value={receiver}
              placeholder="Address"
              inputProps={ariaLabel}
            />
          </Grid>

          <Grid item>
            <SectionTitle color="textPrimary">Sending Address</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              onChange={event => setSender(event.target.value)}
              style={{ width: "100%" }}
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
