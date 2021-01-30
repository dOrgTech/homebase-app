import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  styled,
  Switch,
  Typography,
  withTheme,
  Paper,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { Receipt } from "../../../store/funds/types";

const StyledButton = styled(withTheme(Button))((props) => ({
  height: 53,
  color: props.theme.palette.text.secondary,
  borderColor: "#ED254E",
  minWidth: 171,
  marginLeft: 22,
  borderRadius: 4,
}));

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)({
  borderBottom: "2px solid #3D3D3D",
  height: 30,
  paddingTop: 28,
  minWidth: 500,
});

const ListItem = styled(Grid)({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #3D3D3D",
  padding: "0px 24px",
});

const SendContainer = styled(Grid)({
  height: 55,
});

const BatchBar = styled(Grid)({
  height: 55,
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #3D3D3D",
  padding: "0px 24px",
  cursor: "pointer",
});

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const ReceiptActive = styled(Grid)({
  height: 53,
  width: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  height: 31,
  width: 31,
  textAlign: "center",
  padding: 0,
  background: "#383939",
  color: "#fff",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
});

const styles = {
  visible: {
    display: "none",
  },
  active: {
    background: "#3866F9",
  },
};

const DescriptionContainer = styled(Grid)({
  minHeight: 250,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
  borderBottom: "2px solid #3D3D3D",
});

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

export const VoteAgainstDialog: React.FC = () => {
  const storageDaoInformation = useSelector<
    AppState,
    AppState["fundsInformationReducer"]
  >((state) => state.fundsInformationReducer);

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeReceipt, setActiveReceipt] = React.useState(1);
  const [totalReceipt, setTotalReceipt] = React.useState(
    storageDaoInformation.receipts
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: any, { setSubmitting }: any) => {
    console.log(values);
    setSubmitting(true);
    if (!isBatch) {
      const actualReceipt = values.receipts.filter(
        (item: any, index: any) => index + 1 === activeReceipt
      );
      console.log(actualReceipt);
    }
  };
  return (
    <div>
      <StyledButton variant="outlined" onClick={handleClickOpen}>
        VOTE AGAINST
      </StyledButton>
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
                SEND FUNDS
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
                  Batch Transfer?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SwitchContainer item xs={12} justify="flex-end">
                  <Switch
                    checked={isBatch}
                    onChange={() => {
                      setIsBatch(!isBatch);
                      //   setTotalReceipt(totalReceipt.push(1));
                      return;
                    }}
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </SwitchContainer>
              </Grid>
            </ListItem>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
