import React, { useMemo, useState } from "react";
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import hexToRgba from "hex-to-rgba";
import {
  ProposalFormContainer,
  ProposalFormDefaultValues,
} from "modules/explorer/components/ProposalForm";
import { DAOHolding } from "services/bakingBad/tokenBalances";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance";
import { useDAOID } from "../../DAO/router";

const TokenSymbol = styled(Typography)(({ theme }) => ({
  background: hexToRgba(theme.palette.secondary.main, 0.11),
  borderRadius: 4,
  color: theme.palette.secondary.main,
  padding: "1px 8px",
  boxSizing: "border-box",
  width: "min-content",
}));

const createData = (daoHolding: DAOHolding) => {
  return {
    symbol: daoHolding.token.symbol,
    address: daoHolding.token.contract,
    amount: daoHolding.balance.dp(10).toString(),
  };
};

const titles = ["Token Balances", "Address", "Balance"];

export const BalancesTable: React.FC = () => {
  const daoId = useDAOID();
  const { tokenHoldings } = useDAOHoldings(daoId);
  const { data: tezosBalance } = useTezosBalance(daoId);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [defaultValues, setDefaultValues] =
    useState<ProposalFormDefaultValues>();

  const onCloseTransfer = () => {
    setOpenTransfer(false);
    setDefaultValues(undefined);
  };

  const onOpenXTZTransferModal = () => {
    setDefaultValues({
      transferForm: {
        isBatch: false,
        transfers: [
          {
            recipient: "",
            amount: 1,
            asset: {
              symbol: "XTZ",
            },
          },
        ],
      },
    });

    setOpenTransfer(true);
  };

  const onOpenTokenTransferModal = (tokenAddress: string) => {
    const selectedToken = tokenHoldings.find(
      (holding) =>
        holding.token.contract.toLowerCase() === tokenAddress.toLowerCase()
    ) as DAOHolding;

    setDefaultValues({
      transferForm: {
        transfers: [
          {
            recipient: "",
            amount: 1,
            asset: selectedToken.token,
          },
        ],
      },
    });

    setOpenTransfer(true);
  };

  const rows = useMemo(() => {
    if (!tokenHoldings) {
      return [];
    }

    return tokenHoldings.map(createData);
  }, [tokenHoldings]);

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
          {tezosBalance && (
            <TableRow>
              <TableCell>
                <TokenSymbol>XTZ</TokenSymbol>
              </TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>{tezosBalance.toString()}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onOpenXTZTransferModal()}
                >
                  Transfer
                </Button>
              </TableCell>
            </TableRow>
          )}

          {rows.map((row, i) => (
            <TableRow key={`tokenrow-${i}`}>
              <TableCell>
                <TokenSymbol>{row.symbol}</TokenSymbol>
              </TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell align="right">
                {" "}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onOpenTokenTransferModal(row.address)}
                >
                  Transfer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={0}
      />
    </>
  );
};
