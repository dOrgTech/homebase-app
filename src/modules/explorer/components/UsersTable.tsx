import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  Grid,
  Typography,
  useTheme,
  useMediaQuery
} from "@material-ui/core"
import dayjs from "dayjs"
import { UserBadge } from "modules/explorer/components/UserBadge"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "./CopyButton"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const titles = ["Rank", "Votes", "Available Staked", "Total Staked", "Proposals Voted"] as const

interface RowData {
  address: string
  votes: string
  availableStaked: string
  totalStaked: string
  proposalsVoted: string
}

const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

const StyledTableHead = styled(TableHead)({
  minHeight: 34
})

const StyledTableRow = styled(TableRow)({
  borderBottom: ".6px solid rgba(125,140,139, 0.2)"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid rgba(125,140,139, 0.2)"
})

const TableText = styled(Typography)({
  fontSize: "16px",
  fontWeight: 500,

  ["@media (max-width:1155px)"]: {
    fontSize: "15px",
    whiteSpace: "nowrap"
  }
})

const Title = styled(Typography)({
  fontSize: 20
})

const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "40px 48px",
  borderRadius: 8
}))

const Value = styled(Typography)({
  marginTop: 8,
  fontWeight: 300,
  gap: 6,
  display: "flex"
})

const Symbol = styled(Typography)({
  marginLeft: 4,
  fontWeight: 300
})

const titleDataMatcher = (title: (typeof titles)[number], rowData: RowData) => {
  switch (title) {
    case "Rank":
      return rowData.address
    case "Votes":
      return rowData.votes
    case "Available Staked":
      return rowData.availableStaked
    case "Total Staked":
      return rowData.totalStaked
    case "Proposals Voted":
      return rowData.proposalsVoted
  }
}

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid rgba(125,140,139, 0.2)"
})

const MobileUsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Title align="center" variant="h4" color="textPrimary">
          Top Addresses
        </Title>
      </MobileTableHeader>
      {data.map((row, i) => (
        <MobileTableRow
          key={`usersMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          style={{ gap: 19 }}
        >
          {titles.map((title, j) => (
            <Grid item key={`usersMobileItem-${j}`}>
              {title === "Rank" ? (
                <UserBadge address={row.address} size={44} gap={10} />
              ) : (
                <Typography variant="h6" color="textPrimary">
                  {title}: {titleDataMatcher(title, row)}
                </Typography>
              )}
            </Grid>
          ))}
        </MobileTableRow>
      ))}
    </Grid>
  )
}

const DesktopUsersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  return (
    <>
      <Grid container style={{ gap: 32 }}>
        <Grid item container direction="row">
          <Grid item xs={12}>
            <Title color="textPrimary">Top Addresses</Title>
          </Grid>
        </Grid>

        {data.map((item, i) => (
          <CardContainer key={`usersrow-${i}`} container direction="row" style={{ gap: 24 }}>
            <Grid item container direction="row" alignItems="center" xs={12} style={{ gap: 8 }}>
              <Blockie address={item.address} size={24} />
              <Typography style={{ fontWeight: 300 }} color="textPrimary" variant="body2">
                {item.address}
              </Typography>
              <CopyButton text={item.address} />
            </Grid>
            <Grid item container direction="row" xs={12} justifyContent="space-between">
              <Grid item xs={3}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Votes
                </Typography>
                <Value variant="body2" color="secondary">
                  {item.votes}
                </Value>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Voted
                </Typography>
                <Value variant="body2" color="secondary">
                  {item.proposalsVoted}
                </Value>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Available Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {item.availableStaked}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {item.totalStaked}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
            </Grid>
          </CardContainer>
        ))}
      </Grid>
    </>
  )
}

export const UsersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(960))

  return isExtraSmall ? <MobileUsersTable data={data} /> : <DesktopUsersTable data={data} symbol={symbol} />
}
