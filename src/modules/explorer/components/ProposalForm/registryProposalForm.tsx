import { Dialog, Grid, styled, Typography } from "@material-ui/core";
import { Field, Formik, FormikProps } from "formik";
import {
  INITIAL_REGISTRY_FORM_VALUES,
  UpdateRegistryDialog,
  UpdateRegistryDialogValues,
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
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";

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

type Values = UpdateRegistryDialogValues &
  TreasuryProposalFormValues & { agoraPostId: string };

export const RegistryProposalFormContainer: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const { id: daoId } = useParams<{
    id: string;
  }>();
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as RegistryDAO | undefined;
  const { data: daoHoldings } = useDAOHoldings(daoId);
  const [selectedTab, setSelectedTab] = useState(0);
  const { mutate } = useRegistryPropose();
  const { tezos, connect } = useTezos();
  const formikRef = useRef<FormikProps<Values>>();

  const onSubmit = useCallback(
    async (
      values: Values,
      { setSubmitting }: { setSubmitting: (b: boolean) => void }
    ) => {
      await connectIfNotConnected(tezos, connect);

      if (dao && daoHoldings && formikRef?.current) {
        setSubmitting(true);
        mutate({
          dao,
          args: {
            agoraPostId: Number(formikRef.current.values.agoraPostId),
            //TODO: Fix types here:
            transfer_proposal: {
              transfers: values.transferForm.transfers
                .filter((item) => !!item.recipient)
                .map((transfer) => ({
                  ...transfer,
                  asset: daoHoldings.find(
                    (balance) => balance.contract === transfer.asset?.contract
                  ) as DAOHolding,
                  type:
                    !transfer.asset || transfer.asset.symbol === "XTZ"
                      ? "XTZ"
                      : "FA2",
                })),
              registry_diff: values.registryForm.list.filter(
                (item) => !!item.key
              ),
            },
          },
        });

        handleClose();
      }
    },
    [connect, dao, daoHoldings, handleClose, mutate, tezos]
  );

  const initialValues = {
    ...INITIAL_TRANSFER_FORM_VALUES,
    ...INITIAL_REGISTRY_FORM_VALUES,
    agoraPostId: "0",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dao && daoHoldings && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
        >
          {(formikProps) => {
            formikRef.current = formikProps;

            return (
              <>
                <AppTabBar
                  value={selectedTab}
                  setValue={setSelectedTab}
                  labels={["TRANSFER", "UPDATE REGISTRY"]}
                />
                <TabPanel value={selectedTab} index={0}>
                  <NewTreasuryProposalDialog />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <UpdateRegistryDialog />
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

                <SendButton onClick={formikProps.submitForm} disabled={!dao}>
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
