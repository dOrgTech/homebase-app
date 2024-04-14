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
  Theme,
  Tooltip,
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

const styles = makeStyles({
  root: {
    width: "100%",
    marginTop: 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  descriptionCell: {
    whiteSpace: "nowrap",
    maxWidth: "200px",
    width: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
})

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

const VotesRow = styled(Typography)({
  cursor: "default",
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all .2s linear",
  padding: ".5rem 1rem",
  width: 400

  // "&:focus": {
  //   color: "transparent"
  // }

  // "& :focus:after, &:hover:after": {
  //   content: "attr(data-text)",
  //   overflow: "visible",
  //   textOverflow: "inherit",
  //   background: "#383E43",
  //   position: "absolute",
  //   color: "#FDFDFD",
  //   borderRadius: 8,
  //   left: "auto",
  //   top: "auto",
  //   width: "auto",
  //   border: "1px solid #383E43",
  //   padding: "16px",
  //   boxShadow: "0 2px 4px 0 rgba(0,0,0,.28)",
  //   whiteSpace: "normal",
  //   wordWrap: "break-word",
  //   display: "block",
  //   marginTop: "-1.25rem"
  // }
})

const AddressText = styled(Typography)({
  marginLeft: 8
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
  const classes = styles()
  const [tooltipEnabled, setTooltipEnabled] = useState(false)

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

    document.querySelectorAll<HTMLSpanElement>(".overflow").forEach((span: HTMLSpanElement) => {
      if (span.scrollWidth > span.clientWidth) {
        span.title = span.innerText
      }
    })

    return array
  }, [groupedVotes, decimals, isXTZ])

  const shouldShouldTooltip = (text: string) => {
    console.log(text.length)
    if (text.length > 20) {
      return text
    } else {
      return undefined
    }
  }

  // useEffect(() => {
  //   console.log(listOfVotes)
  //   listOfVotes.map((val: any) => {
  //     //checking scrollWidth greater than clientWidth to display tooltip
  //     if (val.rowref.current !== null) {
  //       if (val.rowref.current.scrollWidth > val.rowref.current.clientWidth) {
  //         val.open = true
  //       }
  //     }

  //     return val
  //   })
  //   console.log()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell align="center">Option</TableCell>
                <TableCell align="right">Votes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listOfVotes
                ? listOfVotes.map((row: any) => (
                    <StyledTableRow key={row.address}>
                      <StyledTableCell component="th" scope="row">
                        <Grid container direction="row" alignItems="center">
                          <Blockie address={row.address} size={24} />
                          <AddressText color="textPrimary"> {toShortAddress(row.address)}</AddressText>
                          <CopyIcon onClick={() => copyAddress(row.address)} color="secondary" fontSize="inherit" />
                        </Grid>
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        <VotesRow
                          color="textPrimary"
                          variant="body1"
                          className="overflow"
                          // data-text={shouldShouldTooltip(row.options.toLocaleString().replace(",", ", "))}
                        >
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
                  ))
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
