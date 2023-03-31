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
        <Typography align="center" variant="h4" color="textPrimary">
          Top Addresses
        </Typography>
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

const DesktopUsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <>
      <Table>
        <StyledTableHead>
          <StyledTableRow>
            <TableCell>
              <TableText>Top Addresses</TableText>
            </TableCell>
          </StyledTableRow>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`userstitle-${i}`}>
                <TableText>{title}</TableText>
              </TableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={`usersrow-${i}`}>
              <OverflowCell>
                <UserBadge smallText={true} address={row.address} size={44} gap={16} />
              </OverflowCell>
              <TableCell>{row.votes}</TableCell>
              <TableCell>{row.availableStaked}</TableCell>
              <TableCell>{row.totalStaked}</TableCell>
              <TableCell>{row.proposalsVoted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export const UsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(960))

  return isExtraSmall ? <MobileUsersTable data={data} /> : <DesktopUsersTable data={data} />
}
