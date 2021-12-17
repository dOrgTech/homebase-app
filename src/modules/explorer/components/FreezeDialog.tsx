import React, { useCallback } from "react";
import {
  Grid,
  styled,
  Typography,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Button,
} from "@material-ui/core";
import { useFreeze } from "services/contracts/baseDAO/hooks/useFreeze";
import BigNumber from "bignumber.js";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { ResponsiveDialog } from "../v2/components/ResponsiveDialog";
import {useDAOID} from "../v2/pages/DAO/router";

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const SendButton = styled(Button)(({ theme }) => ({
  width: 229,
  border: "none",
  margin: 23,
  background: theme.palette.secondary.main,
  borderRadius: 4,
  color: theme.palette.text.secondary,
  "&:hover": {
    background: theme.palette.secondary.main,
  },
}));

const Title = styled(DialogTitle)(({ theme }) => ({
  height: 30,
  paddingBottom: 0,
  minWidth: 400,
  [theme.breakpoints.down("xs")]: {
    minWidth: 250,
  },
  "& .MuiDialogTitle-root": {
    padding: "67px 47px",
  },
}));

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
  },
});

const TextHeader = styled(Typography)({
  marginTop: 33,
});

const InputContainer = styled(Grid)({
  borderTop: "2px solid #3D3D3D",
  borderBottom: "2px solid #3D3D3D",
  padding: "27px 67px",
});

const TableHeader = styled(Grid)({
  padding: "33px 64px",
});

const CustomInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    textAlign: "end",
    color: theme.palette.secondary.main,
  },
}));

export const FreezeDialog: React.FC<{ freeze: boolean }> = ({ freeze }) => {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const daoId = useDAOID();
  const { mutate } = useFreeze();
  const { data: dao } = useDAO(daoId);

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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-around"
          >
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="secondary">
                {freeze ? "DEPOSIT" : "WITHDRAW"}{" "}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CloseButton
                color="textSecondary"
                align="right"
                onClick={handleClose}
              >
                X
              </CloseButton>
            </Grid>
          </Grid>
        </Title>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TableHeader container direction="row" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h5" color="textSecondary">
                  Confirm the {freeze ? "deposit" : "withdrawal"} of your tokens
                </Typography>
              </Grid>
              <TextHeader
                variant="subtitle1"
                color="textSecondary"
              />
            </TableHeader>
            <InputContainer
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <Typography>Amount</Typography>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  id="standard-basic"
                  value={amount}
                  type="number"
                  placeholder="0"
                  onChange={(newValue: any) => setAmount(newValue.target.value)}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography color="secondary">
                          {dao?.data.token.symbol}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />{" "}
              </Grid>
            </InputContainer>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
            >
              <SendButton
                variant="outlined"
                disabled={!amount}
                onClick={onSubmit}
              >
                {freeze ? "DEPOSIT" : "WITHDRAW"} TOKENS
              </SendButton>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
