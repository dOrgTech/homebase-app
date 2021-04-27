import React, { useContext } from "react";
import {
  Grid,
  styled,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)({
  height: 70,
  paddingBottom: 0,
  minWidth: 500,
  "& .MuiTypography-h6": {
    paddingLeft: 24,
    paddingRight: 24,
    height: 70,
    display: "flex",
    alignItems: "center",
  },
});

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "263px !important",
    maxHeight: 600,
  },
});

const Option = styled(Typography)({
  borderTop: "2px solid #3D3D3D",
  height: 90,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
  },
});

const CustomContent = styled(DialogContentText)({
  marginBottom: "0px !important",
});

export const NewTransaction: React.FC = () => {
  const {
    dispatch,
    state: {
      registryTransaction: { open },
      daoId,
    },
  } = useContext(ModalsContext);

  const handleClose = () => {
    dispatch({
      type: ActionTypes.CLOSE,
      payload: {
        modal: "registryTransaction",
      },
    });
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title-new-transaction"
        aria-describedby="alert-dialog-new-transaction"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                NEW TRANSACTION{" "}
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
          <CustomContent id="alert-dialog-new-transaction">
            <Option
              variant="subtitle1"
              color="textSecondary"
              onClick={() =>
                dispatch({
                  type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
                  payload: {
                    isUpdate: false,
                    daoAddress: daoId,
                  },
                })
              }
            >
              Add to Registry{" "}
            </Option>
            <Option
              variant="subtitle1"
              color="textSecondary"
              onClick={() =>
                dispatch({
                  type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
                  payload: {
                    isUpdate: true,
                    daoAddress: daoId,
                  },
                })
              }
            >
              Update Registry
            </Option>
            <Option
              variant="subtitle1"
              color="textSecondary"
              onClick={() =>
                dispatch({
                  type: ActionTypes.OPEN_TREASURY_PROPOSAL,
                  payload: {
                    daoAddress: daoId,
                  },
                })
              }
            >
              Transfer Tokens/Funds
            </Option>
          </CustomContent>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
