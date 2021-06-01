import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

const CustomTextarea = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-multiline": {
    textAlign: "initial",
    border: "1px solid #434242",
    boxSizing: "border-box",
    "& .MuiInputBase-inputMultiline": {
      padding: 12,
      textAlign: "initial",
    },
  },
});

const DescriptionContainer = styled(Grid)({
  minHeight: 250,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
});

const ListItem = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
}));

const Title = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  height: 30,
  paddingTop: 28,
  minWidth: 500,
}));

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

export const RegistryItemDialog: React.FC<{
  item: { key: string; value: string };
  open: boolean;
  handleClose: () => void;
}> = ({ item: { key, value }, open, handleClose }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                REGISTRY ITEM
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
            <ListItem container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Key
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <CustomTextField type="string" value={key} disabled />
              </Grid>
            </ListItem>

            <DescriptionContainer container direction="row">
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                >
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Value
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <CustomTextarea
                  type="number"
                  multiline
                  rows={6}
                  value={value}
                  disabled
                />
              </Grid>
            </DescriptionContainer>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
