import React from "react";
import {
  Grid,
  styled,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

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

export const NewTransaction: React.FC<any> = ({
  setShowDialog,
  setIsUpdate,
  setShowUpdateDialog,
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    setShowDialog(false);
  };

  const handleOption = (state: boolean) => {
    if (state) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
    setOpen(false);
    setShowUpdateDialog(true);
    setShowDialog(false);
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
              onClick={() => handleOption(false)}
            >
              Add to Registry{" "}
            </Option>
            <Option
              variant="subtitle1"
              color="textSecondary"
              onClick={() => handleOption(true)}
            >
              Update Registry
            </Option>
          </CustomContent>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
