import React, {useCallback} from "react";
import {
  Grid,
  styled,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@material-ui/core";
import {useFreeze} from "services/contracts/baseDAO/hooks/useFreeze";
import BigNumber from "bignumber.js";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {ResponsiveDialog} from "../v2/components/ResponsiveDialog";
import {useDAOID} from "../v2/pages/DAO/router";
import {ProposalFormInput} from "./ProposalFormInput";

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
  },
});

const CustomInput = styled(TextField)(({theme}) => ({
  "& .MuiInputBase-input": {
    color: theme.palette.secondary.main,
  },
}));

export const FreezeDialog: React.FC<{ freeze: boolean }> = ({freeze}) => {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const daoId = useDAOID();
  const {mutate} = useFreeze();
  const {data: dao} = useDAO(daoId);

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
        <Grid container direction={"column"} style={{gap: 36}}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Confirm the {freeze ? "deposit" : "withdrawal"} of your tokens
            </Typography>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Amount"}>
              <CustomInput
                value={amount}
                type="number"
                placeholder="0"
                onChange={(newValue: any) => setAmount(newValue.target.value)}
                inputProps={{min: 0}}
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
            justify="center"
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
