/* eslint-disable react/display-name */
import {Dialog, Grid, styled, Typography, TextField, Button} from "@material-ui/core";
import {
  RegistryProposalFormValues,
} from "modules/explorer/Registry/components/UpdateRegistryDialog";
import {
  TreasuryProposalFormValues,
} from "modules/explorer/Treasury";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {AppTabBar} from "./AppTabBar";
import {SendButton} from "./ProposalFormSendButton";
import {TabPanel} from "./TabPanel";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {
  NFTTransferFormValues,
} from "../Treasury/components/NFTTransfer";
import {useDAOID} from "../v2/pages/DAO/router";
import {ProposalFormInput} from "./ProposalFormInput";
import {ProposalFormContainer} from "./ProposalForm";
import {ConfigProposalForm} from "./ConfigProposalForm";
import {GuardianChangeProposalForm} from "./GuardianChangeProposalForm";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  agoraPostId: string;
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues;

export type ProposalFormDefaultValues = RecursivePartial<Values>;

const Content = styled(Grid)({
  padding: "54px 54px 0 54px"
})

interface Props {
  open: boolean;
  handleClose: () => void;
}

enum ProposalModalKey {
  config,
  guardian,
  transfer,
  registry
}

const enabledOptions = {
  registry: [
    {
      name: "Change DAO configuration",
      key: ProposalModalKey.config
    }, {
      name: "Update Guardian",
      key: ProposalModalKey.guardian
    },
    {
      name: "Transfer funds/tokens/NFTs",
      key: ProposalModalKey.transfer
    },
    {
      name: "Update registry",
      key: ProposalModalKey.registry
    },
  ],
  treasury: [
    {
      name: "Change DAO configuration",
      key: ProposalModalKey.config
    }, {
      name: "Update Guardian",
      key: ProposalModalKey.guardian
    },
    {
      name: "Transfer funds/tokens/NFTs",
      key: ProposalModalKey.transfer
    },
  ],
}

export const ProposalSelectionMenu: React.FC<Props> = ({
                                                         open,
                                                         handleClose,
                                                       }) => {
  const daoId = useDAOID();
  const {data: dao} = useDAO(daoId);
  const [openModal, setOpenModal] = useState<ProposalModalKey>()
  const options = dao?.data.type === "registry" ? enabledOptions.registry : enabledOptions.treasury;

  const handleOptionSelected = (key: ProposalModalKey) => {
    setOpenModal(key);
    handleClose();
  }

  const handleCloseModal = () => {
    setOpenModal(undefined);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {dao && (
          <>
            <Content container style={{gap: 42}}>
              {options.map((option, i) => (<Grid item key={`modal-option-${i}`}>
                <Button color={"secondary"} variant={"contained"}
                  onClick={() => handleOptionSelected(option.key)}>
                  {option.name}
                </Button>
              </Grid>))}
            </Content>

          </>
        )}
      </Dialog>
      <ProposalFormContainer open={ProposalModalKey.transfer === openModal || ProposalModalKey.registry === openModal}
                             handleClose={() => handleCloseModal()}/>
      <ConfigProposalForm open={ProposalModalKey.config === openModal} handleClose={() => handleCloseModal()}/>
      <GuardianChangeProposalForm open={ProposalModalKey.guardian === openModal}
                                  handleClose={() => handleCloseModal()}/>
    </>
  );
};
