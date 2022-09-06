/* eslint-disable react/display-name */
import { Grid, styled, Button, Typography } from "@material-ui/core";
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog";
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog";
import React, { useState } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { NFTTransferFormValues } from "./NFTTransfer";
import { useDAOID } from "../pages/DAO/router";
import { ProposalFormContainer } from "./ProposalForm";
import { ConfigProposalForm } from "./ConfigProposalForm";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { MainButton } from "../../common/MainButton";
import { ProposalFormLambda } from "./ConfigProposalFormLambda";

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
  padding: "0 25px",
});

interface Props {
  open: boolean;
  handleClose: () => void;
}

enum ProposalModalKey {
  add,
  remove,
  execute,
}


export const ProposalSelectionMenuLambda: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const [actionModal, setActionModal] = useState<ProposalModalKey>();
  const [openModal, setOpenModal] = useState(false);

  const handleOptionSelected = (key: ProposalModalKey) => {
    setActionModal(key);
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setActionModal(undefined);
    setOpenModal(false);
  };

  return (
    <>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={"Add New Proposal"}
      >
        {dao && (
          <>
            <Content container direction={"column"} style={{ gap: 32 }}>
              <Grid item>
                <Typography style={{ fontWeight: 300 }} color={"textPrimary"}>
                  Which proposal would you like to create?
                </Typography>
              </Grid>
              <Grid
                container
                justifyContent="center"
                style={{ gap: 20 }}
                direction={"column"}
              >
                <MainButton
                  variant={"contained"}
                  onClick={() => handleOptionSelected(ProposalModalKey.add)}
                >
                  Add Lambda
                </MainButton>

                <MainButton
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() =>
                    handleOptionSelected(ProposalModalKey.remove)
                  }
                >
                  Remove Lambda
                </MainButton>

                <MainButton
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() => handleOptionSelected(ProposalModalKey.execute)}
                >
                  Execute Lambda
                </MainButton>
              </Grid>
            </Content>
          </>
        )}
      </ResponsiveDialog>


        <ProposalFormLambda
          action={actionModal}
          open={openModal}
          handleClose={() => handleCloseModal()}
        />

    </>
  );
};
