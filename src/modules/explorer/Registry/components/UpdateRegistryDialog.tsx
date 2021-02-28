import React, { useState } from "react";
import {
  Grid,
  styled,
  Switch,
  Typography,
  Paper,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  Button,
  MenuItem,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField, Select } from "formik-material-ui";
import { Registry } from "services/contracts/baseDAO";

const FullWidthSelect = styled(Select)({
  width: "100%",
});

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  height: 30,
  paddingTop: 28,
  minWidth: 500,
}));

const ListItem = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
}));

const UploadButtonContainer = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  padding: "0px 24px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const FileInput = styled("input")({
  display: "none",
});

const SendContainer = styled(Grid)({
  height: 55,
});

const BatchBar = styled(Grid)(({ theme }) => ({
  height: 60,
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
  cursor: "pointer",
  overflowX: "auto",
}));

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const TransferActive = styled(Grid)({
  height: 53,
  minWidth: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  minHeight: 31,
  minWidth: 31,
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
  show: {
    visibility: "visible",
  },
  hide: {
    visibility: "hidden",
  },
};

const DescriptionContainer = styled(Grid)({
  minHeight: 250,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
});

const UploadFileLabel = styled("label")(({ theme }) => ({
  height: 53,
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
  cursor: "pointer",
  margin: "auto",
  display: "block",
}));

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

interface UpdateRegistryDialogData {
  isUpdate: boolean;
  setShowUpdateDialog: any;
}

interface Values {
  transfers: Registry[];
  description: string;
}

const EMPTY_TRANSFER: Registry = { key: "", value: "" };
const INITIAL_FORM_VALUES: Values = {
  transfers: [EMPTY_TRANSFER],
  description: "",
};

export const UpdateRegistryDialog: React.FC<UpdateRegistryDialogData> = ({
  isUpdate,
  setShowUpdateDialog,
}) => {
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const [proposalFee, setProposalFee] = useState(0);
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    setShowUpdateDialog(false);
  };

  const onSubmit = (values: Values, { setSubmitting }: any) => {
    setSubmitting(true);
  };

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
                {isUpdate ? "UPDATE REGISTRY ITEM" : "ADD REGISTRY ITEM"}
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
                  Add Batches?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SwitchContainer item xs={12} justify="flex-end">
                  <Switch
                    checked={isBatch}
                    onChange={() => {
                      setIsBatch(!isBatch);
                      return;
                    }}
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </SwitchContainer>
              </Grid>
            </ListItem>

            <Formik initialValues={INITIAL_FORM_VALUES} onSubmit={onSubmit}>
              {({ submitForm, values }) => {
                return (
                  <Form autoComplete="off">
                    <>
                      <FieldArray
                        name="transfers"
                        render={(arrayHelpers) => (
                          <>
                            {isBatch ? (
                              <BatchBar container direction="row" wrap="nowrap">
                                {values.transfers.map((_, index) => {
                                  return (
                                    <TransferActive
                                      item
                                      key={index}
                                      onClick={() =>
                                        setActiveTransfer(index + 1)
                                      }
                                      style={
                                        Number(index + 1) === activeTransfer
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
                                    </TransferActive>
                                  );
                                })}

                                <AddButton
                                  onClick={() => {
                                    arrayHelpers.insert(
                                      values.transfers.length + 1,
                                      EMPTY_TRANSFER
                                    );
                                  }}
                                >
                                  +
                                </AddButton>
                              </BatchBar>
                            ) : null}

                            <ListItem container direction="row">
                              <Grid item xs={6}>
                                <Typography
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  Key
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <SwitchContainer
                                  item
                                  xs={12}
                                  justify="flex-end"
                                >
                                  {!isUpdate ? (
                                    <Field
                                      name={`transfers.${
                                        activeTransfer - 1
                                      }.key`}
                                      type="string"
                                      placeholder="Type a Key"
                                      component={CustomTextField}
                                    />
                                  ) : (
                                    <>
                                      <Field
                                        name={`transfers.${
                                          activeTransfer - 1
                                        }.key`}
                                        type="select"
                                        placeholder="Type a Key"
                                        component={FullWidthSelect}
                                      >
                                        <MenuItem value={"default"} disabled>
                                          Type a Key
                                        </MenuItem>
                                        <MenuItem value={10}>
                                          Value example
                                        </MenuItem>
                                      </Field>
                                    </>
                                  )}
                                </SwitchContainer>
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
                                    <Typography
                                      variant="subtitle1"
                                      color="textSecondary"
                                    >
                                      Value
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Field
                                  name={`transfers.${activeTransfer - 1}.value`}
                                  type="number"
                                  multiline
                                  rows={6}
                                  placeholder="Type a Description"
                                  component={CustomTextarea}
                                />
                              </Grid>
                            </DescriptionContainer>
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
                                {values.description
                                  ? values.description.trim().split(" ").length
                                  : 0}{" "}
                                Words
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

                      <UploadButtonContainer container direction="row">
                        <UploadFileLabel>
                          -OR- UPLOAD JSON FILE
                          <FileInput type="file" accept=".json" />
                        </UploadFileLabel>
                      </UploadButtonContainer>

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
                            {proposalFee}{" "}
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
                );
              }}
            </Formik>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
