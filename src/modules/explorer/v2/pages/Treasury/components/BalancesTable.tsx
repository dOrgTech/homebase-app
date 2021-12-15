import React, { useMemo, useState } from "react";
import {
  Button,
  Grid,
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
import {
  ProposalFormContainer,
  ProposalFormDefaultValues,
} from "modules/explorer/components/ProposalForm";
import { DAOHolding } from "services/bakingBad/tokenBalances";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance";
import { useDAOID } from "../../DAO/router";
import BigNumber from "bignumber.js";
import { ContentContainer } from "modules/explorer/v2/components/ContentContainer";

const TokenSymbol = styled(Typography)(({ theme }) => ({
  background: hexToRgba(theme.palette.secondary.main, 0.11),
  borderRadius: 4,
  color: theme.palette.secondary.main,
  padding: "1px 8px",
  boxSizing: "border-box",
  width: "min-content",
}));

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D",
});

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D",
});

interface RowData {
  symbol: string;
  address: string;
  amount: string;
}

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const createData = (daoHolding: DAOHolding): RowData => {
  return {
    symbol: daoHolding.token.symbol,
    address: daoHolding.token.contract,
    amount: daoHolding.balance.dp(10).toString(),
  };
};

const titles = ["Token Balances", "Address", "Balance"] as const;

const titleDataMatcher = (title: typeof titles[number], rowData: RowData) => {
  switch (title) {
    case "Token Balances":
      return rowData.symbol;
    case "Address":
      return rowData.address;
    case "Balance":
      return rowData.amount;
  }
};

interface TableProps {
  rows: RowData[];
  tezosBalance: BigNumber;
  openXTZTransferModal: () => void;
  openTokenTransferModal: (tokenAddress: string) => void;
}

const MobileBalancesTable: React.FC<TableProps> = ({
  rows,
  tezosBalance,
  openTokenTransferModal,
  openXTZTransferModal,
}) => {
  const XTZRowData: RowData = {
    symbol: "XTZ",
    address: "-",
    amount: tezosBalance.toString(),
  };

  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          Token Balances
        </Typography>
      </MobileTableHeader>
      <MobileTableRow
        item
        container
        direction="column"
        alignItems="center"
        style={{ gap: 19 }}
      >
        {titles.map((title, j) => (
          <Grid item key={`balancesMobileItem-${j}`}>
            <Typography variant="h6" color="secondary" align="center">
              {title === "Token Balances" ? "Token" : title}
            </Typography>
            <Typography variant="h6" color="textPrimary" align="center">
              {titleDataMatcher(title, XTZRowData)}
            </Typography>
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => openXTZTransferModal()}
          >
            Transfer
          </Button>
        </Grid>
      </MobileTableRow>
      {rows.map((row, i) => (
        <MobileTableRow
          key={`balancesMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          style={{ gap: 19 }}
        >
          {titles.map((title, j) => (
            <Grid item key={`balancesMobileItem-${j}`}>
              <Typography variant="h6" color="secondary" align="center">
                {title}
              </Typography>
              <Typography variant="h6" color="textPrimary" align="center">
                {titleDataMatcher(title, row)}
              </Typography>
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => openTokenTransferModal(row.address)}
            >
              Transfer
            </Button>
          </Grid>
        </MobileTableRow>
      ))}
    </Grid>
  );
};

const DesktopBalancesTable: React.FC<TableProps> = ({
  rows,
  tezosBalance,
  openTokenTransferModal,
  openXTZTransferModal,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {titles.map((title, i) => (
            <TableCell key={`tokentitle-${i}`}>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
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
              onClick={() => openXTZTransferModal()}
            >
              Transfer
            </Button>
          </TableCell>
        </TableRow>

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
                onClick={() => openTokenTransferModal(row.address)}
              >
                Transfer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const BalancesTable: React.FC = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
      <TableContainer item>
        {isSmall ? (
          <MobileBalancesTable
            rows={rows}
            tezosBalance={tezosBalance || new BigNumber(0)}
            openTokenTransferModal={onOpenTokenTransferModal}
            openXTZTransferModal={onOpenXTZTransferModal}
          />
        ) : (
          <DesktopBalancesTable
            rows={rows}
            tezosBalance={tezosBalance || new BigNumber(0)}
            openTokenTransferModal={onOpenTokenTransferModal}
            openXTZTransferModal={onOpenXTZTransferModal}
          />
        )}
      </TableContainer>

      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={0}
      />
    </>
  );
};
