import React, { useMemo } from "react";
import {
  Link,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import hexToRgba from "hex-to-rgba";
import { useDAOID } from "../../DAO/router";
import { useTransfers } from "services/contracts/baseDAO/hooks/useTransfers";
import { TransferWithBN } from "services/bakingBad/transfers/types";
import dayjs from "dayjs";
import { useTezos } from "services/beacon/hooks/useTezos";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const TokenSymbol = styled(Typography)(({ theme }) => ({
  background: hexToRgba(theme.palette.secondary.main, 0.11),
  borderRadius: 4,
  color: theme.palette.secondary.main,
  padding: "1px 8px",
  boxSizing: "border-box",
  width: "min-content",
}));

const createData = (transfer: TransferWithBN) => {
  return {
    token: transfer.token.symbol,
    date: dayjs(transfer.timestamp).format("ll"),
    amount: transfer.amount.dp(10).toString(),
    recipient: transfer.to,
    hash: transfer.hash,
  };
};

const titles = ["Token", "Date", "Recipient", "Amount"];

export const TransfersTable: React.FC = () => {
  const daoId = useDAOID();
  const { data: transfers } = useTransfers(daoId);

  const rows = useMemo(() => {
    if (!transfers) {
      return [];
    }

    return transfers.map(createData);
  }, [transfers]);

  const { network } = useTezos();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
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
              <TableCell>{row.recipient}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
