import { Dialog, Grid, styled, Switch, Typography } from "@material-ui/core";
import { Field, Formik, FormikProps } from "formik";
import {
  INITIAL_REGISTRY_FORM_VALUES,
  UpdateRegistryDialog,
  UpdateRegistryDialogValues,
  validateUpdateRegistryForm,
} from "modules/explorer/Registry/components/UpdateRegistryDialog";
import {
  INITIAL_TRANSFER_FORM_VALUES,
  NewTreasuryProposalDialog,
  TreasuryProposalFormValues,
} from "modules/explorer/Treasury";
import React, { useCallback, useRef, useState } from "react";
import { useParams } from "react-router";
import { useTezos } from "services/beacon/hooks/useTezos";
import { RegistryDAO } from "services/contracts/baseDAO";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose";
import { connectIfNotConnected } from "services/contracts/utils";
import { AppTabBar } from "../AppTabBar";
import { SendButton } from "../ProposalFormSendButton";
import { ProposalFormListItem } from "../styled/ProposalFormListItem";
import { TabPanel } from "../TabPanel";
import { TextField } from "formik-material-ui";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

export const RegistryProposalFormContainer: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const { id: daoId } = useParams<{
    id: string;
  }>();
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as RegistryDAO | undefined;
  const [selectedTab, setSelectedTab] = useState(0);
  const { mutate } = useRegistryPropose();
  const { tezos, connect } = useTezos();
  const valuesRef = useRef<UpdateRegistryDialogValues>();
  const [isTransferEnabled, setIsTransferEnabled] = useState(true);
  const [isRegistryUpdateEnabled, setIsRegistryUpdateEnabled] = useState(false);

  const onSubmit = useCallback(
    async (values: any) => {
      await connectIfNotConnected(tezos, connect);

      if (dao && valuesRef?.current) {
        mutate({
          dao,
          args: {
            agoraPostId: Number(valuesRef.current.agoraPostId),
            normal_proposal: isRegistryUpdateEnabled
              ? {
                  registry_diff: values.list,
                }
              : undefined,
            transfer_proposal: isTransferEnabled
              ? {
                  transfers: values.transferForm.transfers,
                }
              : undefined,
          },
        });

        handleClose();
      }
    },
    [
      connect,
      dao,
      handleClose,
      isRegistryUpdateEnabled,
      isTransferEnabled,
      mutate,
      tezos,
    ]
  );

  const initialValues = {
    ...INITIAL_TRANSFER_FORM_VALUES,
    ...INITIAL_REGISTRY_FORM_VALUES,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dao && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validateUpdateRegistryForm}
        >
          {(formikProps) => {
            valuesRef.current = formikProps.values;

            return (
              <>
                <AppTabBar
                  value={selectedTab}
                  setValue={setSelectedTab}
                  labels={["TRANSFER", "REGISTRY UPDATE"]}
                />
                <TabPanel value={selectedTab} index={0}>
                  <ProposalFormListItem container direction="row">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Enable Transfer Proposal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <SwitchContainer item xs={12} justify="flex-end">
                        <Switch
                          checked={isTransferEnabled}
                          onChange={() =>
                            setIsTransferEnabled(!isTransferEnabled)
                          }
                          name="checkedA"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </SwitchContainer>
                    </Grid>
                  </ProposalFormListItem>
                  <NewTreasuryProposalDialog
                    {...((formikProps as unknown) as FormikProps<TreasuryProposalFormValues>)}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <ProposalFormListItem container direction="row">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Enable Registry Update Proposal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <SwitchContainer item xs={12} justify="flex-end">
                        <Switch
                          checked={isRegistryUpdateEnabled}
                          onChange={() =>
                            setIsRegistryUpdateEnabled(!isRegistryUpdateEnabled)
                          }
                          name="checkedA"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </SwitchContainer>
                    </Grid>
                  </ProposalFormListItem>
                  <UpdateRegistryDialog
                    {...((formikProps as unknown) as FormikProps<UpdateRegistryDialogValues>)}
                  />
                </TabPanel>

                <ProposalFormListItem container direction="row">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Agora Post ID
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <SwitchContainer item xs={12} justify="flex-end">
                      <Field
                        name={`agoraPostId`}
                        type="number"
                        placeholder="Type an Agora Post ID"
                        component={CustomTextField}
                      />
                    </SwitchContainer>
                  </Grid>
                </ProposalFormListItem>

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
                      {dao && dao.extra.frozenExtraValue}{" "}
                      {dao ? dao.metadata.unfrozenToken.symbol : ""}
                    </Typography>
                  </Grid>
                </ProposalFormListItem>

                <SendButton
                  onClick={() => onSubmit(formikProps.values)}
                  disabled={!dao}
                >
                  SEND
                </SendButton>
              </>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};
