import React from "react";
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
  useMediaQuery,
} from "@material-ui/core";
import dayjs from "dayjs";
import { UserBadge } from "modules/explorer/components/UserBadge";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const titles = ["Rank", "Votes", "Weight", "Proposals Voted"] as const;

interface RowData {
  address: string;
  votes: string;
  weight: string;
  proposalsVoted: string;
}

const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300,
});

const StyledTableHead = styled(TableHead)({
  minHeight: 34,
});

const StyledTableRow = styled(TableRow)({
  borderBottom: "1px solid #3D3D3D",
});

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D",
});

const titleDataMatcher = (title: typeof titles[number], rowData: RowData) => {
  switch (title) {
    case "Rank":
      return rowData.address;
    case "Votes":
      return rowData.votes;
    case "Weight":
      return rowData.weight;
    case "Proposals Voted":
      return rowData.proposalsVoted;
  }
};

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileUsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">Top Addresses</Typography>
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
  );
};

const DesktopUsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <>
      <Table>
        <StyledTableHead>
          <StyledTableRow>
            <TableCell>Top Addresses</TableCell>
          </StyledTableRow>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`userstitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={`usersrow-${i}`}>
              <OverflowCell>
                <UserBadge address={row.address} size={44} gap={16} />
              </OverflowCell>
              <TableCell>{row.votes}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.proposalsVoted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export const UsersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return isExtraSmall ? (
    <MobileUsersTable data={data} />
  ) : (
    <DesktopUsersTable data={data} />
  );
};
