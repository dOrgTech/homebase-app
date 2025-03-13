import { Box, Container, Grid, styled, useMediaQuery, useTheme } from "@material-ui/core"
import { Typography } from "@material-ui/core"
import { NextButton } from "components/ui/NextButton"
import { StyledTextField } from "components/ui/StyledTextField"
import { LinearProgress, LinearProgressLoader } from "components/ui/LinearProgress"

import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { BackButton } from "modules/lite/components/BackButton"

import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EvmPropTransferAssets } from "./EvmProposals/EvmPropTransferAssets"
import { EvmPropEditRegistry } from "./EvmProposals/EvmPropEditRegistry"
import { EvmPropContractCall } from "./EvmProposals/EvmPropContractCall"
import { EvmPropDaoConfig } from "./EvmProposals/EvmPropDaoConfig"
import EvmPropTokenOps from "./EvmProposals/EvmPropTokenOps"
import { EvmProposalOptions } from "../config"
import { EvmOffchainDebate } from "./EvmProposals/EvmOffchainDebate"
import { EProposalType } from "../types"

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

const renderModal = (modal: EProposalType) => {
  switch (modal) {
    case "transfer_assets":
      return <EvmPropTransferAssets />
    case "edit_registry":
      return <EvmPropEditRegistry />
    case "contract_call":
      return <EvmPropContractCall />
    case "change_config":
      return <EvmPropDaoConfig />
    case "token_operation":
      return <EvmPropTokenOps />
    case "off_chain_debate":
      return <EvmOffchainDebate />
    default:
      return null
  }
}

export const EvmProposalsActionDialog = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const theme = useTheme()
  const { isLoading, currentStep, metadata, setMetadataFieldValue, isDeploying, nextStep, prevStep } =
    useEvmProposalOps()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const proposalTitle = EvmProposalOptions.find(option => option.modal === metadata.type)?.label

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"New Proposal"} template="xs">
        <TitleContainer container direction="row">
          <Typography color="textPrimary">Select Proposal Type</Typography>
        </TitleContainer>
        <Grid container spacing={2}>
          {EvmProposalOptions.map((option: any, index) => (
            <Grid
              item
              xs={isMobileSmall ? 12 : 4}
              key={index}
              onClick={() => setMetadataFieldValue("type", option.modal as any)}
            >
              <OptionContainer>
                <ActionText color={option?.is_disabled ? "textSecondary" : "textPrimary"}>{option.label}</ActionText>
                <ActionDescriptionText color={option?.is_disabled ? "textSecondary" : "textPrimary"}>
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

      <ResponsiveDialog
        template="md"
        open={currentStep >= 2}
        onClose={() => setMetadataFieldValue("type", "")}
        title={proposalTitle}
      >
        {isDeploying ? (
          <>
            <Typography>Deploying Proposal...</Typography>
            <LinearProgressLoader />
          </>
        ) : (
          renderModal(metadata.type as EProposalType)
        )}
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <BackButton disabled={isDeploying} onClick={prevStep.handler} />
          <NextButton disabled={isLoading || isDeploying} onClick={nextStep.handler}>
            {nextStep.text}
          </NextButton>
        </Grid>
      </ResponsiveDialog>
    </>
  )
}
