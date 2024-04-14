import React, { useMemo, useState } from "react"
import {
  DialogActions,
  DialogContent,
  styled,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  makeStyles
} from "@material-ui/core"
import { toShortAddress } from "services/contracts/utils"
import { FileCopyOutlined } from "@material-ui/icons"
import { Choice } from "models/Choice"
import { getTotalVoters } from "services/lite/utils"
import { useNotification } from "modules/common/hooks/useNotification"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import numbro from "numbro"
import BigNumber from "bignumber.js"
import { Blockie } from "modules/common/Blockie"
import "./styles.css"

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

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "flex-end !important",
  paddingBottom: 20,
  [theme.breakpoints.down("sm")]: {
    marginTop: 46
  }
}))

const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

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

const AddressText = styled(Typography)({
  marginLeft: 8
})

const Header = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontWeight: 300
}))

const Container = styled(Grid)({
  gap: 16,
  padding: 16
})

const formatConfig = {
  mantissa: 2,
  trimMantissa: false,
  average: true,
  thousandSeparated: true
}

interface Votes {
  address: string
  options: VoteDetail[]
}

interface VoteDetail {
  name: string
  balance: string
}

export const VotesDialog: React.FC<{
  open: boolean
  handleClose: any
  choices: Choice[]
  groupedVotes: Votes[]
  symbol: string
  decimals: string
  isXTZ: boolean
}> = ({ open, handleClose, choices, symbol, decimals, isXTZ, groupedVotes }) => {
  const descriptionElementRef = React.useRef<HTMLElement>(null)
  const openNotification = useNotification()

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    openNotification({
      message: "Address copied!",
      autoHideDuration: 2000,
      variant: "info"
    })
  }

  const listOfVotes = useMemo(() => {
    const getTotal = (options: VoteDetail[]) => {
      let total = new BigNumber(0)
      if (options) {
        options.map(item => {
          total = total.plus(new BigNumber(item.balance))
        })
      }
      const formatted = total.div(new BigNumber(10).pow(isXTZ ? 6 : decimals))
      return formatted
    }
    const array: any = []
    groupedVotes.map(item => {
      const obj = {
        address: item.address,
        options: item.options.map(item => item.name),
        total: getTotal(item.options),
        rowref: React.createRef(),
        open: false
      }
      return array.push(obj)
    })

    document.querySelectorAll<HTMLSpanElement>(".test").forEach((span: HTMLSpanElement) => {
      if (span.scrollWidth > span.clientWidth) {
        span.classList.add("ellipse")
      }
    })

    return array
  }, [groupedVotes, decimals, isXTZ])

  return (
    <div>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        title={`${getTotalVoters(choices)} Votes: `}
        template="xs"
      >
        <CustomContent>
          <Table aria-label="customized table">
            {!isMobileSmall ? (
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Option</TableCell>
                  <TableCell align="right">Votes</TableCell>
                </TableRow>
              </TableHead>
            ) : null}

            <TableBody>
              {listOfVotes
                ? listOfVotes.map((row: any) => {
                    return isMobileSmall ? (
                      <>
                        <Container key={row.address} container direction="column" justifyContent="center">
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
                              <Blockie address={row.address} size={24} />
                              <AddressText color="textPrimary"> {toShortAddress(row.address)}</AddressText>
                              <CopyIcon onClick={() => copyAddress(row.address)} color="secondary" fontSize="inherit" />
                            </Grid>
                          </Grid>{" "}
                          <Grid item>
                            <Grid item direction="row" container justifyContent="center">
                              <Header color="textPrimary"> Option</Header>
                            </Grid>
                            <Grid item container direction="row" alignItems="center" justifyContent="center">
                              <VotesRow color="textPrimary" variant="body1" className="test">
                                {" "}
                                {row.options.toLocaleString().replace(",", ", ")}
                              </VotesRow>
                            </Grid>
                          </Grid>{" "}
                          <Grid item>
                            <Grid item direction="row" container justifyContent="center">
                              <Header color="textPrimary"> Votes</Header>
                            </Grid>
                            <Grid item container direction="row" alignItems="center" justifyContent="center">
                              <Typography color="textPrimary" variant="body1">
                                {numbro(row.total).format(formatConfig)} {symbol}{" "}
                              </Typography>
                            </Grid>
                          </Grid>{" "}
                        </Container>
                      </>
                    ) : (
                      <StyledTableRow key={row.address}>
                        <StyledTableCell component="th" scope="row">
                          <Grid container direction="row" alignItems="center">
                            <Blockie address={row.address} size={24} />
                            <AddressText color="textPrimary"> {toShortAddress(row.address)}</AddressText>
                            <CopyIcon onClick={() => copyAddress(row.address)} color="secondary" fontSize="inherit" />
                          </Grid>
                        </StyledTableCell>{" "}
                        <StyledTableCell align="center">
                          <VotesRow color="textPrimary" variant="body1" className="test">
                            {" "}
                            {row.options.toLocaleString().replace(",", ", ")}
                          </VotesRow>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {" "}
                          <Typography color="textPrimary" variant="body1">
                            {numbro(row.total).format(formatConfig)} {symbol}{" "}
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                : null}
              {!listOfVotes && <Typography>No info</Typography>}
            </TableBody>
          </Table>
        </CustomContent>
        <CustomDialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </CustomDialogActions>
      </ResponsiveDialog>
    </div>
  )
}
