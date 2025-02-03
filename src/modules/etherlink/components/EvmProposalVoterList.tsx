import { Grid, DialogContent, styled, TableBody, Typography } from "@material-ui/core"
import { TableHead, useMediaQuery, useTheme } from "@material-ui/core"
import { Table } from "@material-ui/core"
import { TableCell } from "@material-ui/core"
import { TableRow } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import { AddressText } from "modules/creator/token/ui"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"

import { toShortAddress } from "services/contracts/utils"
import { EVM_PROPOSAL_CHOICES } from "../config"
import { useContext, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { FileCopyOutlined } from "@material-ui/icons"
import ReactPaginate from "react-paginate"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"

interface IVoter {
  voter: string
  option: number
  weight: number
}

const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

const Container = styled(Grid)({
  gap: 16,
  padding: 16
})

const Header = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontWeight: 300
}))

const CustomContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  display: "grid",
  marginTop: 24,
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    display: "inline",
    paddingTop: "0px !important"
  }
}))

const VotesRow = styled(Typography)(({ theme }) => ({
  cursor: "default",
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: ".5rem 1rem",
  width: 400,
  [theme.breakpoints.down("sm")]: {
    width: 200,
    textAlign: "center"
  }
}))

const StyledTableCell = styled(TableCell)({
  "fontWeight": 300,
  "& p": {
    fontWeight: 300
  }
})
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}))

export const EvmProposalVoterList = () => {
  const [currentPage, setCurrentPage] = useState(0)

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { copyAddress, showProposalVoterList, setShowProposalVoterList } = useEvmDaoOps()
  const { daoProposalSelected, daoProposalVoters } = useContext(EtherlinkContext)

  const listOfVotes = [] as IVoter[]

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }
  const handleClose = () => {
    setShowProposalVoterList(false)
  }

  const pageCount = Math.ceil(daoProposalSelected?.totalVoteCount / 10)

  return (
    <div>
      <ResponsiveDialog
        open={showProposalVoterList}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        title={`${daoProposalSelected?.totalVoteCount} Votes: `}
        template="xs"
      >
        <CustomContent>
          <Table aria-label="customized table">
            {!isMobileSmall ? (
              <TableHead>
                <TableRow key={"header"}>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Option</TableCell>
                  <TableCell align="right">Votes</TableCell>
                </TableRow>
              </TableHead>
            ) : null}

            <TableBody>
              {daoProposalVoters
                ? daoProposalVoters.map((row: IVoter) => {
                    return isMobileSmall ? (
                      <Container key={row.voter} container direction="column" justifyContent="center">
                        <Grid item>
                          <Grid item direction="row" container justifyContent="center">
                            <Header color="textPrimary"> Address</Header>
                          </Grid>
                          <Grid
                            item
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            style={{ marginTop: 6 }}
                          >
                            <Blockie address={row.voter} size={24} />
                            <AddressText color="textPrimary"> {toShortAddress(row.voter)}</AddressText>
                            <CopyIcon onClick={() => copyAddress(row.voter)} color="secondary" fontSize="inherit" />
                          </Grid>
                        </Grid>{" "}
                        <Grid item>
                          <Grid item direction="row" container justifyContent="center">
                            <Header color="textPrimary"> Option</Header>
                          </Grid>
                          <Grid item container direction="row" alignItems="center" justifyContent="center">
                            <VotesRow color="textPrimary" variant="body1" className="test">
                              {" "}
                              {row.option}
                            </VotesRow>
                          </Grid>
                        </Grid>{" "}
                        <Grid item>
                          <Grid item direction="row" container justifyContent="center">
                            <Header color="textPrimary"> Weight</Header>
                          </Grid>
                          <Grid item container direction="row" alignItems="center" justifyContent="center">
                            <Typography color="textPrimary" variant="body1">
                              {row.weight}
                            </Typography>
                          </Grid>
                        </Grid>{" "}
                      </Container>
                    ) : (
                      <StyledTableRow key={row.voter}>
                        <StyledTableCell component="th" scope="row">
                          <Grid container direction="row" alignItems="center">
                            <Blockie address={row.voter} size={24} />
                            <AddressText color="textPrimary"> {toShortAddress(row.voter)}</AddressText>
                            <CopyIcon onClick={() => copyAddress(row.voter)} color="secondary" fontSize="inherit" />
                          </Grid>
                        </StyledTableCell>{" "}
                        <StyledTableCell align="center">
                          <VotesRow color="textPrimary" variant="body1" className="test">
                            {" "}
                            {row.option === 1 ? "Yes" : "No"}
                          </VotesRow>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {" "}
                          <Typography color="textPrimary" variant="body1">
                            {row.weight}
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                : null}
              {!listOfVotes ? <Typography>No info</Typography> : null}
            </TableBody>
          </Table>
          <Grid container direction="row" justifyContent="flex-end">
            <ReactPaginate
              previousLabel={"<"}
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={currentPage}
            />
          </Grid>
        </CustomContent>
      </ResponsiveDialog>
    </div>
  )
}
