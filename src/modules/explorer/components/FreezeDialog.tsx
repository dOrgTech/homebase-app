import React, { useCallback, useMemo } from "react";
import {
  Grid,
  styled,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@material-ui/core";
import { useFreeze } from "services/contracts/baseDAO/hooks/useFreeze";
import BigNumber from "bignumber.js";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { useDAOID } from "../pages/DAO/router";
import { ProposalFormInput } from "./ProposalFormInput";
import { useTezos } from "services/beacon/hooks/useTezos";
import { getUserTokenBalance } from "services/bakingBad/tokenBalances";
import { xtzToMutez } from "services/contracts/utils";

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
  },
});

const CustomInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: theme.palette.secondary.main,
  },
}));

const CustomLabelsContainer = styled(Grid)({
  marginBottom: 12,
});

const CustomAmountLabel = styled(Typography)({
  fontWeight: 500,
});

const CustomMaxLabel = styled(Typography)({
  fontSize: 16,
  paddingBottom: 5,
  textDecoration: "underline",
  textUnderlineOffset: 6,
  cursor: "pointer",
  marginLeft: 12
});

export const FreezeDialog: React.FC<{ freeze: boolean }> = ({ freeze }) => {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const daoId = useDAOID();
  const { mutate } = useFreeze();
  const { data: dao, ledger } = useDAO(daoId);
  const { account } = useTezos();

  const [showMax, setShowMax] = React.useState<boolean>(false);
  const [max, setMax] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount(0);
  };

  const onSubmit = useCallback(async () => {
    if (dao) {
      mutate({
        dao,
        amount: new BigNumber(amount),
        freeze,
      });

      handleClose();
    }
  }, [amount, dao, mutate, freeze]);

  useMemo(async () => {
    if (!ledger) {
      return setShowMax(false);
    } else {
      if (account) {
        const availableBalance = await getUserTokenBalance(
          account.toString(),
          dao?.data.network,
          dao?.data.token.contract
        );
        setShowMax(true);
        if (availableBalance) {
          const formattedBalance = xtzToMutez(
            new BigNumber(availableBalance)
          ).toNumber();
          setMax(formattedBalance);
        }
      }
    }
  }, [ledger, account, dao]);

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        {freeze ? "Deposit" : "Withdraw"}
      </Button>
      <CustomDialog
        open={open}
        onClose={handleClose}
        title={freeze ? "DEPOSIT" : "WITHDRAW"}
      >
        <Grid container direction={"column"} style={{ gap: 36 }}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Confirm the {freeze ? "deposit" : "withdrawal"} of your tokens
            </Typography>
          </Grid>
          <Grid item>
            <CustomLabelsContainer
              item
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={3}>
              <CustomAmountLabel>Amount</CustomAmountLabel>
              </Grid>
              <Grid item container direction="row" xs={9} justifyContent="flex-end">
                {showMax && freeze ? (
                  <>
                <Typography>{max} {dao?.data.token.symbol}</Typography>
                  <CustomMaxLabel
                    color="secondary"
                    onClick={() => setAmount(max)}
                  >
                    Use Max
                  </CustomMaxLabel>
                  </>
                ) : null}
              </Grid>
            </CustomLabelsContainer>
            <ProposalFormInput>
              <CustomInput
                value={amount}
                type="number"
                placeholder="0"
                onChange={(newValue: any) => setAmount(newValue.target.value)}
                inputProps={{ min: 0 }}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography color="secondary">
                        {dao?.data.token.symbol}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </ProposalFormInput>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              color={"secondary"}
              disabled={!amount}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </CustomDialog>
    </div>
  );
};
