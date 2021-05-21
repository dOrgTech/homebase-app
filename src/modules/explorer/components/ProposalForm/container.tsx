import { Dialog, Grid, styled, Typography } from "@material-ui/core";
import { char2Bytes } from "@taquito/tzip16";
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
  TransferProposalFormValues,
} from "modules/explorer/Treasury";
import React, { useCallback, useState } from "react";
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

// const onSubmit = useCallback(
//   async (values: Values, { setSubmitting }: any) => {
//     setSubmitting(true);

//     await connectIfNotConnected(tezos, connect);

//     if (dao && daoHoldings) {
//       mutate({
//         dao,
//         transfers: values.transfers.map((transfer) => ({
//           ...transfer,
//           asset: daoHoldings.find(
//             (balance) => balance.contract === transfer.asset?.contract
//           ) as DAOHolding,
//           type:
//             !transfer.asset || transfer.asset.symbol === "XTZ"
//               ? "XTZ"
//               : "FA2",
//         })),
//         tokensToFreeze: dao.extra.frozenExtraValue,
//         agoraPostId: values.agoraPostId,
//       });

//       handleClose();
//     }
//   },
//   [connect, dao, handleClose, mutate, tezos, daoHoldings]
// );

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

  const onSubmit = useCallback(
    async (values: UpdateRegistryDialogValues) => {
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

        handleClose();
      }
    },
    [connect, dao, handleClose, mutate, tezos]
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
          {(formikProps) => (
            <>
              <AppTabBar
                value={selectedTab}
                setValue={setSelectedTab}
                labels={["TRANSFER", "REGISTRY UPDATE"]}
              />
              <TabPanel value={selectedTab} index={0}>
                <NewTreasuryProposalDialog
                  {...((formikProps as unknown) as FormikProps<TransferProposalFormValues>)}
                />
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                <UpdateRegistryDialog
                  {...((formikProps as unknown) as FormikProps<UpdateRegistryDialogValues>)}
                />
              </TabPanel>
            </>
          )}

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
                  type="tel"
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
              <Typography align="right" variant="subtitle1" color="secondary">
                {dao && dao.extra.frozenExtraValue}{" "}
                {dao ? dao.metadata.unfrozenToken.symbol : ""}
              </Typography>
            </Grid>
          </ProposalFormListItem>

          <SendButton
            onClick={() => {
              console.log("hey");
            }}
            disabled={!dao}
          >
            SEND
          </SendButton>
        </Formik>
      )}
    </Dialog>
  );
};
