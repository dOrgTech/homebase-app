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
  borderColor: props.theme.palette.secondary.main,
  minWidth: 171,
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

export const NewProposalDialog: React.FC = () => {
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
        NEW PROPOSAL
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

            <Formik initialValues={storageDaoInformation} onSubmit={onSubmit}>
              {({ submitForm, isSubmitting, errors, touched, values }) => (
                <Form autoComplete="off">
                  <>
                    <FieldArray
                      name="receipts"
                      render={(arrayHelpers) => (
                        <>
                          {isBatch ? (
                            <BatchBar container direction="row">
                              {totalReceipt.map((item, index) => {
                                return (
                                  <ReceiptActive
                                    item
                                    key={index}
                                    onClick={() => setActiveReceipt(index + 1)}
                                    style={
                                      Number(index + 1) === activeReceipt
                                        ? styles.active
                                        : undefined
                                    }
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      color="textSecondary"
                                    >
                                      #{index + 1}
                                    </Typography>
                                  </ReceiptActive>
                                );
                              })}

                              <AddButton
                                onClick={() => {
                                  arrayHelpers.insert(totalReceipt.length + 1, {
                                    recipient: "",
                                    amount: 0,
                                  });
                                  const newField = ({
                                    recipient: "",
                                    amount: 0,
                                  } as unknown) as Receipt;
                                  const newArray = [...totalReceipt, newField];
                                  console.log(newArray);
                                  setTotalReceipt(newArray);
                                  return;
                                }}
                              >
                                +
                              </AddButton>
                            </BatchBar>
                          ) : null}

                          {values.receipts && values.receipts.length > 0
                            ? values.receipts.map((holder: any, index: any) => (
                                <div
                                  key={index}
                                  style={
                                    Number(index + 1) !== activeReceipt
                                      ? styles.visible
                                      : undefined
                                  }
                                >
                                  <ListItem container direction="row">
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="subtitle1"
                                        color="textSecondary"
                                      >
                                        Recipient
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <SwitchContainer
                                        item
                                        xs={12}
                                        justify="flex-end"
                                      >
                                        <Field
                                          name={`receipts.${index}.recipient`}
                                          type="string"
                                          placeholder="Type an Address Here"
                                          component={CustomTextField}
                                        />
                                      </SwitchContainer>
                                    </Grid>
                                  </ListItem>

                                  <ListItem container direction="row">
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="subtitle1"
                                        color="textSecondary"
                                      >
                                        Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <SwitchContainer
                                        item
                                        xs={12}
                                        justify="flex-end"
                                      >
                                        <Field
                                          name={`receipts.${index}.amount`}
                                          type="number"
                                          placeholder="Type an Amount"
                                          component={CustomTextField}
                                        />
                                      </SwitchContainer>
                                    </Grid>
                                  </ListItem>
                                </div>
                              ))
                            : null}
                        </>
                      )}
                    />
                    <DescriptionContainer container direction="row">
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justify="space-between"
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Proposal Description
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              align="right"
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              0 Words
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="description"
                          type="number"
                          multiline
                          rows={6}
                          placeholder="Type a Description"
                          component={CustomTextarea}
                        />
                      </Grid>
                    </DescriptionContainer>

                    <ListItem container direction="row">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Proposal Fee
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          align="right"
                          variant="subtitle1"
                          color="secondary"
                        >
                          15 MYGT
                        </Typography>
                      </Grid>
                    </ListItem>

                    <SendContainer container direction="row" justify="center">
                      <Button onClick={submitForm}>
                        <Typography variant="subtitle1" color="textSecondary">
                          SEND
                        </Typography>
                      </Button>
                    </SendContainer>
                  </>
                </Form>
              )}
            </Formik>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
