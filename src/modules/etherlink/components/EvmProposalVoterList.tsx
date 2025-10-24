import {
  Grid,
  TableBody,
  Typography,
  TableHead,
  useMediaQuery,
  useTheme,
  Table,
  TableCell,
  TableRow,
  IconButton
} from "components/ui"
import { Blockie } from "modules/common/Blockie"
import { AddressText } from "modules/creator/token/ui"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"

import { toShortAddress } from "services/contracts/utils"
import { useContext, useMemo, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import ReactPaginate from "react-paginate"
import { useEvmDaoUiOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { etherlinkStyled as _est } from "components/ui"
const { Container, CustomContent, Header, VotesRow, StyledTableCell, StyledTableRow, CopyIcon } = _est
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { getBlockExplorerUrl } from "modules/etherlink/utils"
interface IVoter {
  voter: string
  option: number
  weight: number | string
  cast?: string // ISO datetime string (optional)
  hash?: string // tx hash (optional)
}

export const EvmProposalVoterList = () => {
  const [currentPage, setCurrentPage] = useState(0)

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { copyAddress, showProposalVoterList, setShowProposalVoterList } = useEvmDaoUiOps()
  const { daoProposalSelected, daoProposalVoters, network } = useContext(EtherlinkContext)

  // Sort votes by cast time (desc)
  const sortedVotes: IVoter[] = useMemo(() => {
    if (!Array.isArray(daoProposalVoters)) return []
    try {
      return [...daoProposalVoters].sort((a: IVoter, b: IVoter) => {
        const parseCast = (v: any): number => {
          const c: any = v?.cast
          if (!c) return 0
          // Firestore Timestamp
          if (typeof c === "object") {
            if (typeof c.toDate === "function") {
              return c.toDate().getTime()
            }
            if (typeof c.seconds === "number") {
              return c.seconds * 1000
            }
          }
          // ISO string fallback
          if (typeof c === "string") return Date.parse(c)
          return 0
        }
        const at = parseCast(a)
        const bt = parseCast(b)
        return bt - at
      })
    } catch (_) {
      return daoProposalVoters as IVoter[]
    }
  }, [daoProposalVoters])

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
                  <TableCell align="right">Tx</TableCell>
                </TableRow>
              </TableHead>
            ) : null}

            <TableBody>
              {sortedVotes
                ? sortedVotes.map((row: IVoter) => {
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
                            {row?.hash ? (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const href = getBlockExplorerUrl(network, String(row.hash))
                                  if (href) window.open(href, "_blank", "noopener,noreferrer")
                                }}
                                aria-label="View transaction"
                                style={{ marginLeft: 8 }}
                              >
                                <OpenInNewIcon fontSize="inherit" color="secondary" />
                              </IconButton>
                            ) : null}
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
                        <StyledTableCell align="right">
                          {row?.hash ? (
                            <IconButton
                              size="small"
                              onClick={() => {
                                const href = getBlockExplorerUrl(network, String(row.hash))
                                if (href) window.open(href, "_blank", "noopener,noreferrer")
                              }}
                              aria-label="View transaction"
                            >
                              <OpenInNewIcon color="secondary" fontSize="small" />
                            </IconButton>
                          ) : null}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                : null}
              {!sortedVotes ? <Typography>No info</Typography> : null}
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
