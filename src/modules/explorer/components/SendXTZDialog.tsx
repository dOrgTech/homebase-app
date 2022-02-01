import React, {useCallback} from "react";
import BigNumber from "bignumber.js";
import {useSendXTZ} from "../../../services/contracts/baseDAO/hooks/useSendXTZ";
import {useDAOID} from "../pages/DAO/router";
import {useDAO} from "../../../services/indexer/dao/hooks/useDAO";
import {Button, Grid, styled, TextField, Typography} from "@material-ui/core";
import {ProposalFormInput} from "./ProposalFormInput";
import {ResponsiveDialog} from "./ResponsiveDialog";

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
  },
});

export const SendXTZDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const daoId = useDAOID();
  const {mutate} = useSendXTZ();
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
      });

      handleClose();
    }
  }, [amount, dao, mutate]);

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        Fund DAO with XTZ
      </Button>
      <CustomDialog
        open={open}
        onClose={handleClose}
        title={"Fund DAO with XTZ"}
      >
        <Grid container direction={"column"} style={{gap: 36}}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Fund the DAO with XTZ
            </Typography>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Amount"}>
              <TextField
                value={amount}
                type="number"
                placeholder="0"
                onChange={(newValue: any) => setAmount(newValue.target.value)}
                inputProps={{min: 0}}
                InputProps={{
                  disableUnderline: true
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
  )
}