/* eslint-disable react/display-name */
import { Dialog, Grid, styled, Typography, TextField } from "@material-ui/core";
// import { yupResolver } from "@hookform/resolvers/yup";
import {
  registryProposalFormInitialState,
  RegistryProposalFormValues,
  UpdateRegistryDialog,
} from "modules/explorer/Registry/components/UpdateRegistryDialog";
import {
  Asset,
  NewTreasuryProposalDialog,
  treasuryProposalFormInitialState,
  TreasuryProposalFormValues,
} from "modules/explorer/Treasury";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { AppTabBar } from "./AppTabBar";
import { SendButton } from "./ProposalFormSendButton";
import { ProposalFormListItem } from "./styled/ProposalFormListItem";
import { TabPanel } from "./TabPanel";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DAOTemplate } from "modules/creator/state";
import { useTreasuryPropose } from "services/contracts/baseDAO/hooks/useTreasuryPropose";
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose";
import { BaseDAO, RegistryDAO, TreasuryDAO } from "services/contracts/baseDAO";
import {
  NFTTransferForm,
  nftTransferFormInitialState,
  NFTTransferFormValues,
} from "../Treasury/components/NFTTransfer";
import { Token } from "models/Token";
import { useDAOID } from "../v2/pages/DAO/router";

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

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  agoraPostId: string;
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues;

export type ProposalFormDefaultValues = RecursivePartial<Values>;

interface Props {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ProposalFormDefaultValues;
  defaultTab?: number;
}

const enabledForms: Record<
  DAOTemplate,
  {
    label: string;
    component: React.FC;
  }[]
> = {
  treasury: [
    {
      label: "TRANSFER FUNDS",
      component: () => <NewTreasuryProposalDialog />,
    },
    {
      label: "TRANSFER NFTs",
      component: () => <NFTTransferForm />,
    },
  ],
  registry: [
    {
      label: "TRANSFER FUNDS",
      component: () => <NewTreasuryProposalDialog />,
    },
    {
      label: "TRANSFER NFTs",
      component: () => <NFTTransferForm />,
    },
    {
      label: "UPDATE REGISTRY",
      component: () => <UpdateRegistryDialog />,
    },
  ],
};

export const ProposalFormContainer: React.FC<Props> = ({
  open,
  handleClose,
  defaultValues,
  defaultTab,
}) => {
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const { data: daoHoldings } = useDAOHoldings(daoId);
  const [selectedTab, setSelectedTab] = useState(defaultTab || 0);

  const methods = useForm<Values>({
    defaultValues: useMemo(() => ({
      agoraPostId: "0",
      ...treasuryProposalFormInitialState,
      ...nftTransferFormInitialState,
      ...registryProposalFormInitialState,
      ...defaultValues
    }), [defaultValues]),
    // resolver: yupResolver(validationSchema as any),
  });

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues, methods])

  const forms = enabledForms[dao?.data.type || "treasury"];
  const { mutate: treasuryMutate } = useTreasuryPropose();
  const { mutate: registryMutate } = useRegistryPropose();

  const onSubmit = useCallback(
    (values: Values) => {
      const agoraPostId = Number(values.agoraPostId);

      const mappedTransfers = [
        ...values.transferForm.transfers,
        ...values.nftTransferForm.transfers,
      ]
        .filter(
          (transfer) =>
            !!transfer.amount && !!transfer.asset && !!transfer.recipient
        )
        .map((transfer) =>
          (transfer.asset as Asset).symbol === "XTZ"
            ? { ...transfer, amount: transfer.amount, type: "XTZ" as const }
            : {
                ...transfer,
                amount: transfer.amount,
                asset: transfer.asset as Token,
                type: "FA2" as const,
              }
        );

      const mappedList = values.registryUpdateForm.list.filter(
        (item) => !!item.key && !!item.value
      );

      if ((dao as BaseDAO).data.type === "treasury") {
        treasuryMutate({
          dao: dao as TreasuryDAO,
          args: {
            agoraPostId,
            transfers: mappedTransfers,
          },
        });
      } else if ((dao as BaseDAO).data.type === "registry") {
        registryMutate({
          dao: dao as RegistryDAO,
          args: {
            agoraPostId,
            transfer_proposal: {
              transfers: mappedTransfers,
              registry_diff: mappedList,
            },
          },
        });
      }

      handleClose();
    },
    [dao, handleClose, registryMutate, treasuryMutate]
  );

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {dao && daoHoldings && (
          <>
            <AppTabBar
              value={selectedTab}
              setValue={setSelectedTab}
              labels={forms.map((form) => form.label)}
            />
            {forms.map((form, i) => (
              <TabPanel key={`tab-${i}`} value={selectedTab} index={i}>
                <form.component />
              </TabPanel>
            ))}

            <ProposalFormListItem container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Agora Post ID
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SwitchContainer item xs={12} justify="flex-end">
                  <Controller
                    control={methods.control}
                    name={`agoraPostId`}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type="number"
                        placeholder="Type an Agora Post ID"
                      />
                    )}
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
                  {dao && dao.data.extra.frozen_extra_value.toString()}{" "}
                  {dao ? dao.data.token.symbol : ""}
                </Typography>
              </Grid>
            </ProposalFormListItem>

            <SendButton
              onClick={methods.handleSubmit(onSubmit as any)}
              disabled={!dao || !daoHoldings}
            >
              SEND
            </SendButton>
          </>
        )}
      </Dialog>
    </FormProvider>
  );
};
