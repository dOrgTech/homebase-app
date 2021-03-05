import React, { useCallback, useContext, useState } from "react";
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
  MenuItem,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField, Select } from "formik-material-ui";
import { Registry, RegistryDAO } from "services/contracts/baseDAO";
import { ActionTypes } from "modules/explorer/ModalsContext";
import { ModalsContext } from "modules/explorer/ModalsContext";
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { char2Bytes } from "@taquito/tzip16";
import { useRegistryList } from "services/contracts/baseDAO/hooks/useRegistryList";
import { ViewButton } from "modules/explorer/components/ViewButton";
// import { useNotification } from "modules/common/hooks/useNotification";
import { useTezos } from "services/beacon/hooks/useTezos";
import { connectIfNotConnected } from "services/contracts/utils";
import { calculateProposalSize } from "services/contracts/baseDAO/registryDAO/service";
import { getTokensToStakeInPropose } from "services/contracts/baseDAO/treasuryDAO/service";
import { fromRegistryListFile, validateRegistryListJSON } from "../pages/utils";

const SendButton = styled(ViewButton)({
  width: "100%",
  border: "none",
  borderTop: "1px solid #4BCF93",
});

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

interface Values {
  list: Registry[];
  description: string;
}

const EMPTY_LIST_ITEM: Registry = { key: "", value: "" };
const INITIAL_FORM_VALUES: Values = {
  list: [EMPTY_LIST_ITEM],
  description: "",
};

export const UpdateRegistryDialog: React.FC = () => {
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(1);
  const [proposalFee] = useState(0);
  const {
    state: {
      registryProposal: {
        open,
        params: { isUpdate, itemToUpdate },
      },
      daoId,
    },
    dispatch,
  } = useContext(ModalsContext);
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as RegistryDAO | undefined;
  const { mutate } = useRegistryPropose();
  const { data: registryItems } = useRegistryList(daoId);
  // const openNotification = useNotification();
  const { tezos, connect } = useTezos();

  const handleClose = useCallback(() => {
    dispatch({
      type: ActionTypes.CLOSE,
      payload: {
        modal: "registryProposal",
      },
    });
  }, [dispatch]);

  const onSubmit = useCallback(
    async (values: Values) => {
      await connectIfNotConnected(tezos, connect);

      if (dao) {
        const proposalSize = await calculateProposalSize(dao.address, tezos, {
          agoraPostId: 0,
          items: values.list.map(({ key, value }) => ({
            key: char2Bytes(key),
            newValue: char2Bytes(value),
          })),
        });

        const tokensNeeded = getTokensToStakeInPropose(
          {
            frozenExtraValue: dao.storage.frozenExtraValue,
            frozenScaleValue: dao.storage.frozenScaleValue,
          },
          proposalSize
        );

        mutate({
          dao,
          tokensToFreeze: tokensNeeded,
          agoraPostId: 0,
          items: values.list.map(({ key, value }) => ({
            key: char2Bytes(key),
            newValue: char2Bytes(value),
          })),
        });
      }
    },
    [connect, dao, mutate, tezos]
  );

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

            <Formik
              initialValues={{
                ...INITIAL_FORM_VALUES,
                list: [
                  {
                    key: itemToUpdate?.key || "",
                    value: itemToUpdate?.value || "",
                  },
                ],
              }}
              onSubmit={onSubmit}
            >
              {({ submitForm, values, setFieldValue }) => {
                const importList = async (
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    const registryListParsed = await fromRegistryListFile(file);
                    console.log(registryListParsed);
                    const errors = validateRegistryListJSON(registryListParsed);
                    console.log(errors);
                    if (errors.length) {
                      // Show notification with error
                      return;
                    }
                    setIsBatch(true);
                    values.list = registryListParsed;
                  }
                };

                return (
                  <Form autoComplete="off">
                    <>
                      <FieldArray
                        name="list"
                        render={(arrayHelpers) => (
                          <>
                            {isBatch ? (
                              <BatchBar container direction="row" wrap="nowrap">
                                {values.list.map((_, index) => {
                                  return (
                                    <TransferActive
                                      item
                                      key={index}
                                      onClick={() => setActiveItem(index + 1)}
                                      style={
                                        Number(index + 1) === activeItem
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
                                      values.list.length + 1,
                                      EMPTY_LIST_ITEM
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
                                      name={`list.${activeItem - 1}.key`}
                                      type="string"
                                      placeholder="Type a Key"
                                      component={CustomTextField}
                                    />
                                  ) : (
                                    <>
                                      {registryItems && (
                                        <Field
                                          name={`list.${activeItem - 1}.key`}
                                          type="select"
                                          placeholder="Type a Key"
                                          defaultValue={""}
                                          onChange={(e: any) => {
                                            setFieldValue(
                                              `list.${activeItem - 1}.key`,
                                              e.target.value
                                            );
                                            setFieldValue(
                                              `list.${activeItem - 1}.value`,
                                              registryItems.find(
                                                (item) =>
                                                  item.key === e.target.value
                                              )?.value
                                            );
                                          }}
                                          component={FullWidthSelect}
                                        >
                                          <MenuItem value={"default"} disabled>
                                            Select a Key
                                          </MenuItem>
                                          {registryItems &&
                                            registryItems.map(({ key }, i) => (
                                              <MenuItem
                                                key={`option-${i}`}
                                                value={key}
                                              >
                                                {key}
                                              </MenuItem>
                                            ))}
                                        </Field>
                                      )}
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
                                  name={`list.${activeItem - 1}.value`}
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
                          <FileInput
                            type="file"
                            accept=".json"
                            onChange={importList}
                          />
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
                        <SendButton onClick={submitForm} disabled={!dao}>
                          SEND
                        </SendButton>
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
