import React, { useEffect, useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { Grid, styled } from "@material-ui/core"
import { Typography } from "@mui/material"
import { Dropdown } from "./Dropdown"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { SmallButton } from "modules/common/SmallButton"

interface Props {
  open: boolean
  handleClose: () => void
}

const SectionTitle = styled(Typography)({
  fontSize: "18px !important",
  fontWeight: 600
})

const Container = styled(Grid)({
  marginTop: 6,
  gap: 24
})

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

export const FilterProposalsDialog: React.FC<Props> = ({ open, handleClose }) => {
  const [filters, setFilters] = useState<string[]>([])
  const [status, setStatus] = useState<any[]>([])

  const filterProposalByPopularity = (status: string | undefined) => {
    if (status) {
      setFilters([...status])
    }
  }

  const findStatus = () => {
    const values = Object.values(ProposalStatus)
    for (const item in values) {
      setStatus(oldArray => [...oldArray, values[item]])
    }
  }

  useEffect(() => {
    setStatus([])
    findStatus()
  }, [])

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        <Container container direction="column">
          <Grid item>
            <SectionTitle>Sort By</SectionTitle>
          </Grid>
          <Grid item>
            <Dropdown
              options={[
                { name: "Newest to Oldest", value: "recent" },
                { name: "Most Popular to Least Popular", value: "popular" }
              ]}
              value={"recent"}
              onSelected={filterProposalByPopularity}
              isFilter={true}
            />
          </Grid>
        </Container>
        <Container container direction="column">
          <Grid item>
            <SectionTitle>Proposal Status</SectionTitle>
          </Grid>
          <Grid item container direction="row">
            {status.length > 0 &&
              status.map((item, index) => {
                return (
                  <StatusButton item key={`status-${index}`}>
                    <Typography>{item}</Typography>
                  </StatusButton>
                )
              })}
          </Grid>
        </Container>
        <Container container direction="row" justifyContent="flex-end">
          <SmallButton color="secondary" variant="contained">
            Apply
          </SmallButton>
        </Container>
      </ResponsiveDialog>
    </>
  )
}
