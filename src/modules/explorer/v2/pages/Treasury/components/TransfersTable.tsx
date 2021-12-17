import React, {useMemo} from "react";
import {
  Grid,
  Link,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import hexToRgba from "hex-to-rgba";
import {TransferWithBN} from "services/contracts/baseDAO/hooks/useTransfers";
import dayjs from "dayjs";
import {useTezos} from "services/beacon/hooks/useTezos";
import {Network} from "services/beacon/context";
import {ContentContainer} from "modules/explorer/v2/components/ContentContainer";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const TokenSymbol = styled(Typography)(({theme}) => ({
  background: hexToRgba(theme.palette.secondary.main, 0.11),
  borderRadius: 4,
  color: theme.palette.secondary.main,
  padding: "1px 8px",
  boxSizing: "border-box",
  width: "min-content",
}));

const createData = (transfer: TransferWithBN, isInbound: boolean) => {
  return {
    token: transfer.name,
    date: dayjs(transfer.date).format("ll"),
    amount: transfer.amount.dp(10).toString(),
    address: isInbound ? transfer.sender : transfer.recipient,
    hash: transfer.hash,
  };
};

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

interface RowData {
  token: string;
  date: string;
  amount: string;
  address: string;
  hash: string;
}

const outboundTitles = ["Outbound Transfers", "Date", "Recipient", "Amount"];
const inboundTitles = ["Inbound Transfers", "Date", "Sender", "Amount"];

const titleDataMatcher = (title: typeof outboundTitles[number]
                            | typeof inboundTitles[number],
                          rowData: RowData
  ) => {
    switch (title) {
      case "Outbound Transfers":
        return rowData.token;
      case "Inbound Transfers":
        return rowData.token;
      case "Date":
        return rowData.date;
      case "Amount":
        return rowData.amount;
      case "Recipient":
        return rowData.address
      case "Sender":
        return rowData.address
    }
  }
;

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D",
});

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D",
});

//TODO: Should mobile table items also redirect to block explorer on click?

const MobileTransfersTable: React.FC<{ data: RowData[]; isInbound: boolean }> = ({isInbound, data}) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          {isInbound ? "Inbound" : "Outbound"} Transfer History
        </Typography>
      </MobileTableHeader>
      {data.map((row, i) => (
        <MobileTableRow
          key={`transfersMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          style={{gap: 19}}
        >
          {(isInbound ? inboundTitles : outboundTitles).map((title, j) => (
            <Grid item key={`transfersMobileItem-${j}`}>
              <Typography variant="h6" color="secondary" align="center">
                {title === "Outbound Transfers" || title === "Inbound Transfers" ? "Token:" : title}
              </Typography>
              <Typography variant="h6" color="textPrimary" align="center">
                {titleDataMatcher(title, row)}
              </Typography>
            </Grid>
          ))}
        </MobileTableRow>
      ))}
    </Grid>
  );
};

const DesktopTransfersTable: React.FC<{ isInbound: boolean; data: RowData[]; network: Network }> =
  ({isInbound, data: rows, network}) => {
    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              {(isInbound ? inboundTitles : outboundTitles).map((title, i) => (
                <TableCell key={`tokentitle-${i}`}>{title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                component={Link}
                key={`tokenrow-${i}`}
                href={`https://${
                  network === "mainnet" ? "" : network + "."
                }tzkt.io/${row.hash}`}
                target="_blank"
              >
                <TableCell>
                  <TokenSymbol>{row.token}</TokenSymbol>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

export const TransfersTable: React.FC<{ transfers: TransferWithBN[], isInbound: boolean }> = ({
                                                                                                isInbound,
                                                                                                transfers
                                                                                              }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const rows = useMemo(() => {
    if (!transfers) {
      return [];
    }

    return transfers.map((t) => createData(t, isInbound));
  }, [isInbound, transfers]);

  const {network} = useTezos();

  return (
    <TableContainer>
      {isSmall ? (
        <MobileTransfersTable data={rows} isInbound={isInbound}/>
      ) : (
        <DesktopTransfersTable data={rows} network={network} isInbound={isInbound}/>
      )}
    </TableContainer>
  );
};
