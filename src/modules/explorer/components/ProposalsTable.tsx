import React from "react"
import { CircularProgress, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { ResponsiveTableContainer } from "./ResponsiveTable"
import { TableHeader } from "./styled/TableHeader"
import { ProposalTableRow } from "./ProposalTableRow"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"

const ProposalTableHeadText: React.FC = ({ children }) => (
  <ProposalTableHeadItem variant="subtitle1" color="textSecondary">
    {children}
  </ProposalTableHeadItem>
)

const ProposalTableHeadItem = styled(Typography)({
  fontWeight: "bold",
  paddingLeft: 20,
  paddingBottom: 9
})

const NoProposals = styled(Typography)(({ theme }) => ({
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 20,
  boxSizing: "border-box",

  [theme.breakpoints.down("sm")]: {
    textAlign: "center"
  }
}))

interface Props {
  status?: ProposalStatus
  proposals: Proposal[]
  isLoading: boolean
}

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
})

export const ProposalsTable: React.FC<Props> = ({ status, proposals, isLoading }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <ResponsiveTableContainer>
      {!isMobileSmall ? (
        <TableHeader container direction="row">
          <Grid item xs={3}>
            <ProposalTableHeadText>{`${status || "All"} proposals`.toUpperCase()}</ProposalTableHeadText>
          </Grid>
        </TableHeader>
      ) : null}

      {proposals.map((proposal, i) => (
        <ProposalTableRow key={`proposal-${i}`} proposal={proposal} />
      ))}

      {proposals.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No {status ? status : ""} proposals
        </NoProposals>
      ) : null}

      {isLoading && (
        <LoaderContainer container direction="row" justifyContent="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      )}
    </ResponsiveTableContainer>
  )
}
