import React, { useCallback, useContext } from "react";
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
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import { Registry, RegistryDAO } from "services/contracts/baseDAO";
import { ActionTypes } from "modules/explorer/ModalsContext";
import { ModalsContext } from "modules/explorer/ModalsContext";
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { char2Bytes } from "@taquito/tzip16";
import { useTezos } from "services/beacon/hooks/useTezos";
import { connectIfNotConnected } from "services/contracts/utils";
import { fromRegistryListFile, validateRegistryListJSON } from "../pages/utils";
import { useNotification } from "modules/common/hooks/useNotification";
import { CustomTextarea, DescriptionContainer } from "modules/explorer/components/ProposalTextContainer";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import { SendButton } from "modules/explorer/components/ProposalFormSendButton";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";

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

interface Values {
  list: Registry[];
  description: string;
  title: string;
}

const EMPTY_LIST_ITEM: Registry = { key: "", value: "" };
const INITIAL_FORM_VALUES: Values = {
  list: [EMPTY_LIST_ITEM],
  description: "",
  title: "",
};

const validateForm = (values: Values): FormikErrors<Values> => {
  const errors: Record<string, any> = {
    list: values.list.map(() => ({}))
  }

  values.list.forEach((item, i) => {
    if(!item.key) {
      errors.list[i].key = "Required"
    }

    if(!item.value) {
      errors.list[i].value = "Required"
    }
  })

  return errors
}

export const UpdateRegistryDialog: React.FC = () => {
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(1);
  const {
    state: {
      registryProposal: {
        open
      },
      daoId,
    },
    dispatch,
  } = useContext(ModalsContext);
  const openNotification = useNotification();
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as RegistryDAO | undefined;
  const { mutate } = useRegistryPropose();
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
        mutate({
          dao,
          tokensToFreeze: dao.extra.frozenExtraValue,
          agoraPostId: 0,
          items: values.list.map(({ key, value }) => ({
            key: char2Bytes(key),
            newValue: char2Bytes(value),
          })),
        });

        dispatch({
          type: ActionTypes.CLOSE,
          payload: { modal: "registryProposal" },
        });
      }
    },
    [connect, dao, dispatch, mutate, tezos]
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
                UPDATE REGISTRY ITEM
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
            <ProposalFormListItem container direction="row">
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
            </ProposalFormListItem>

            <Formik
              initialValues={{
                ...INITIAL_FORM_VALUES,
                list: [
                  {
                    key: "",
                    value: "",
                  },
                ],
              }}
              onSubmit={onSubmit}
              validate={validateForm}
            >
              {({ values, setFieldValue, errors, touched, setTouched }) => {

                const keyError = (errors.list?.[activeItem - 1] as any)?.key
                const valueError = (errors.list?.[activeItem - 1] as any)?.value

                const importList = async (
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  if (event.currentTarget.files) {
                    try {
                      const file = event.currentTarget.files[0];
                      const registryListParsed = await fromRegistryListFile(
                        file
                      );
                      console.log(registryListParsed);
                      const errors = validateRegistryListJSON(
                        registryListParsed
                      );
                      console.log(errors);
                      if (errors.length) {
                        openNotification({
                          message: "Error while parsing JSON",
                          persist: true,
                          variant: "error",
                        });
                        return;
                      }
                      setIsBatch(true);
                      values.list = registryListParsed;
                    } catch (e) {
                      openNotification({
                        message: "Error while parsing JSON",
                        persist: true,
                        variant: "error",
                      });
                    }
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
                                    setActiveItem(activeItem + 1);
                                  }}
                                >
                                  +
                                </AddButton>
                              </BatchBar>
                            ) : null}

                            <ProposalFormListItem container direction="row">
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
                                  <Field
                                    name={`list.${activeItem - 1}.key`}
                                    type="string"
                                    placeholder="Type a Key"
                                    component={CustomTextField}
                                  />
                                  { keyError && touched.list?.[activeItem - 1]?.key? (
                                    <ErrorText>{keyError}</ErrorText>
                                  ) : null}
                                </SwitchContainer>
                              </Grid>
                            </ProposalFormListItem>

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
                                  multiline
                                  type="string"
                                  rows={6}
                                  placeholder="Type a value"
                                  component={CustomTextarea}
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `list.${activeItem - 1}.value`,
                                      e.target.value
                                    );

                                    const listVals: any = touched.list
                                    listVals[activeItem - 1] = {
                                      ...listVals[activeItem - 1],
                                      value: true
                                    }

                                    setTouched({
                                      ...touched,
                                      list: listVals
                                    })
                                  }}
                                />
                                { valueError && touched.list?.[activeItem - 1]?.value? (
                                  <ErrorText>{valueError}</ErrorText>
                                ) : null}
                              </Grid>
                            </DescriptionContainer>
                          </>
                        )}
                      />

                      {/* <ProposalTextContainer title="Proposal Title" value={values.title} type="title" />

                      <ProposalTextContainer title="Proposal Description" value={values.description} type="description" /> */}

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

                      <ProposalFormListItem container direction="row">
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
                            {dao?.extra.frozenExtraValue || 0}{" "}
                          </Typography>
                        </Grid>
                      </ProposalFormListItem>

                      <SendButton onClick={() => onSubmit(values)} disabled={!dao}>
                        SEND
                      </SendButton>
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
