import { Grid, TableBody, Typography } from "@material-ui/core"
import { TableHead, useMediaQuery, useTheme } from "@material-ui/core"
import { Table } from "@material-ui/core"
import { TableCell } from "@material-ui/core"
import { TableRow } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import { AddressText } from "modules/creator/token/ui"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"

import { toShortAddress } from "services/contracts/utils"
import { useContext, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import ReactPaginate from "react-paginate"
import { useEvmDaoUiOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { Container, CustomContent, Header, VotesRow, StyledTableCell, StyledTableRow, CopyIcon } from "./styled"
interface IVoter {
  voter: string
  option: number
  weight: number
}

export const EvmProposalVoterList = () => {
  const [currentPage, setCurrentPage] = useState(0)

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { copyAddress, showProposalVoterList, setShowProposalVoterList } = useEvmDaoUiOps()
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
