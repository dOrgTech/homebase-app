import React, { useEffect, useState } from "react"
import { Grid, TextField, Typography, styled, withStyles } from "@material-ui/core"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { SmallButton } from "modules/common/SmallButton"
import { TokensFilters } from "../pages/NFTs"

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

export const FilterNFTDialog: React.FC<Props> = ({ open, handleClose, saveFilters, currentFilters }) => {
  const [owner, setOwner] = useState<string | null>("")
  const [valueMin, setValueMin] = useState<string | undefined>()
  const [valueMax, setValueMax] = useState<string | undefined>()

  const ariaLabel = { "aria-label": "description" }

  useEffect(() => {
    if (currentFilters) {
      setOwner(currentFilters?.owner)
      setValueMin(currentFilters.valueMin)
      setValueMax(currentFilters.valueMax)
    }
  }, [currentFilters])

  const showFilters = () => {
    const filterObject: TokensFilters = {
      owner: owner,
      valueMin: valueMin,
      valueMax: valueMax
    }
    saveFilters(filterObject)
    handleClose()
  }

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        <Container container direction="column">
          <Grid item>
            <SectionTitle color="textPrimary">Value</SectionTitle>
          </Grid>
          <Grid item container direction="row" justifyContent="space-between" spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                onChange={event => setValueMin(event.target.value)}
                name="test"
                value={valueMin}
                placeholder="Min"
                inputProps={ariaLabel}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                onChange={event => setValueMax(event.target.value)}
                name="test"
                value={valueMax}
                placeholder="Max"
                type="number"
                inputProps={ariaLabel}
              />
            </Grid>
          </Grid>

          <Grid item>
            <SectionTitle color="textPrimary">Owner Address</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              onChange={event => setOwner(event.target.value)}
              style={{ width: "100%" }}
              name="test"
              value={owner}
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
