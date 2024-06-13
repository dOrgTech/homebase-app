import React, { useEffect, useState } from "react"
import { Grid, TextField, Typography, styled, withStyles } from "@material-ui/core"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"
import { TokensFilters } from "../pages/Treasury"

interface Props {
  currentFilters: TokensFilters | undefined
  open: boolean
  handleClose: () => void
  saveFilters: (options: TokensFilters) => void
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

export const FilterTokenDialog: React.FC<Props> = ({ open, handleClose, saveFilters, currentFilters }) => {
  const [token, setToken] = useState<string | null>("")
  const [balanceMin, setBalanceMin] = useState<string | undefined>()
  const [balanceMax, setBalanceMax] = useState<string | undefined>()

  const ariaLabel = { "aria-label": "description" }

  useEffect(() => {
    if (currentFilters) {
      setToken(currentFilters?.token)
      setBalanceMin(currentFilters.balanceMin)
      setBalanceMax(currentFilters.balanceMax)
    }
  }, [currentFilters])

  const showFilters = () => {
    const filterObject: TokensFilters = {
      token: token,
      balanceMin: balanceMin,
      balanceMax: balanceMax
    }
    saveFilters(filterObject)
    handleClose()
  }

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        <Container container direction="column">
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
            <SectionTitle>Balance</SectionTitle>
          </Grid>
          <Grid item container direction="row" justifyContent="space-between" spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                onChange={event => setBalanceMin(event.target.value)}
                name="test"
                value={balanceMin}
                placeholder="Min"
                inputProps={ariaLabel}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                onChange={event => setBalanceMax(event.target.value)}
                name="test"
                value={balanceMax}
                placeholder="Min"
                type="number"
                inputProps={ariaLabel}
              />
            </Grid>
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
