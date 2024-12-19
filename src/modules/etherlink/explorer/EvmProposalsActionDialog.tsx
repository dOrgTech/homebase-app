import { Box, Container, Grid, styled, TextField, useMediaQuery, useTheme } from "@material-ui/core"
import { Typography } from "@material-ui/core"
import { NextButton } from "components/ui/NextButton"
import { StyledTextField } from "components/ui/StyledTextField"
import EthChangeConfigProposalForm from "modules/explorer/components/EthChangeConfigProposalForm"
import EthContractCallForm from "modules/explorer/components/EthContractCallForm"
import EthTransferFundsForm from "modules/explorer/components/EthTransferFundsForm"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { BackButton } from "modules/lite/components/BackButton"
import { Choices } from "modules/lite/explorer/components/Choices"
import { useState } from "react"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EvmPropTransferAssets } from "./EvmProposals/EvmPropTransferAssets"

const ProposalContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("md")]: {
    marginTop: 30
  }
}))

// TODO: Move this to a shared component
const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 110,
  "&:hover:enabled": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  }
}))

const ActionText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 20,
  marginBottom: 8
}))

const ActionDescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 16
}))

const TitleContainer = styled(Grid)({
  marginBottom: 24
})

const evmProposalOptions = [
  {
    label: "Off-Chain Debate",
    description: "Post a thesis and have tokenized arguments around it",
    modal: "off_chain_debate",
    is_disabled: true
  },
  {
    label: "Transfer Assets",
    description: "Propose a transfer of assets from the DAO treasury",
    modal: "transfer_assets"
  },
  {
    label: "Edit Registry",
    description: "Change an entry or add a new one",
    modal: "edit_registry"
  },
  {
    label: "Contract Call",
    description: "Propose a call to an external contract",
    modal: "contract_call"
  },
  {
    label: "Change Config",
    description: "Propose changes to the DAO configuration",
    modal: "change_config"
  },
  {
    label: "Token Operation",
    description: "Propose a token operation",
    modal: "token_operation"
  }
]

export const EvmProposalsActionDialog = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const theme = useTheme()
  const { isLoading, currentStep, metadata, setMetadataFieldValue, setCurrentStep, nextStep, prevStep } =
    useEvmProposalOps()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const proposalTitle = evmProposalOptions.find(option => option.modal === metadata.type)?.label

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"New Proposal"} template="xs">
        <TitleContainer container direction="row">
          <Typography color="textPrimary">Select Proposal Type</Typography>
        </TitleContainer>
        <Grid container spacing={2}>
          {evmProposalOptions.map((option, index) => (
            <Grid
              item
              xs={isMobileSmall ? 12 : 4}
              key={index}
              onClick={() => setMetadataFieldValue("type", option.modal as any)}
            >
              <OptionContainer>
                <ActionText color={option.is_disabled ? "textSecondary" : "textPrimary"}>{option.label}</ActionText>
                <ActionDescriptionText color={option.is_disabled ? "textSecondary" : "textPrimary"}>
                  {option.description}
                </ActionDescriptionText>
              </OptionContainer>
            </Grid>
          ))}
        </Grid>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={currentStep === 1}
        onClose={() => setMetadataFieldValue("type", "")}
        title={proposalTitle}
      >
        <Container>
          <Box
            gridGap={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4
            }}
          >
            <StyledTextField
              placeholder="Proposal Title"
              fullWidth
              variant="standard"
              label="Proposal Title"
              style={{ height: "50px", textAlign: "left", marginBottom: "20px" }}
              defaultValue={metadata.title}
              onChange={e => setMetadataFieldValue("title", e.target.value)}
            />
            <StyledTextField
              placeholder="Proposal Details"
              label="Proposal Details"
              multiline
              minRows={5}
              fullWidth
              variant="standard"
              style={{ marginBottom: "20px" }}
              defaultValue={metadata.description}
              onChange={e => setMetadataFieldValue("description", e.target.value)}
            />

            <StyledTextField
              label="Discussion URL"
              placeholder="Discussion URL"
              fullWidth
              variant="standard"
              style={{ marginBottom: "10px" }}
              defaultValue={metadata.discussionUrl}
              onChange={e => setMetadataFieldValue("discussionUrl", e.target.value)}
            />
          </Box>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <BackButton onClick={prevStep.handler} />
            <NextButton onClick={nextStep.handler}>{nextStep.text}</NextButton>
          </Grid>
        </Container>
      </ResponsiveDialog>

      {/* <EthContractCallForm open={true} handleClose={() => setModalOpen(false)} /> */}
      {/* <EthChangeConfigProposalForm open={modalOpen === "change_config"} handleClose={() => setModalOpen(false)} /> */}

      <ResponsiveDialog
        template="md"
        open={metadata.type === "transfer_assets" && currentStep === 2}
        onClose={() => setMetadataFieldValue("type", "")}
        title="Transfer Assets"
      >
        <EvmPropTransferAssets />
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <BackButton onClick={prevStep.handler} />
          <NextButton disabled={isLoading} onClick={nextStep.handler}>
            {nextStep.text}
          </NextButton>
        </Grid>
        {/* <EthTransferFundsForm open={true} handleClose={() => setModalOpen(false)} /> */}
      </ResponsiveDialog>
    </>
  )
}
