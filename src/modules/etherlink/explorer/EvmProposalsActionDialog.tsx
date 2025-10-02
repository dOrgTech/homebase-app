import React from "react"
import { Box, Grid, useMediaQuery, useTheme, Typography } from "components/ui"
import { NextButton } from "components/ui/NextButton"
import { StyledTextField } from "components/ui/StyledTextField"
import { LinearProgressLoader } from "components/ui/LinearProgress"

import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { BackButton } from "modules/lite/components/BackButton"

import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmPropTransferAssets } from "./EvmProposals/EvmPropTransferAssets"
import { EvmPropEditRegistry } from "./EvmProposals/EvmPropEditRegistry"
import { EvmPropContractCall } from "./EvmProposals/EvmPropContractCall"
import { EvmPropDaoConfig } from "./EvmProposals/EvmPropDaoConfig"
import EvmPropTokenOps from "./EvmProposals/EvmPropTokenOps"
import { EvmProposalOptions } from "../config"
import { EvmOffchainDebate } from "./EvmProposals/EvmOffchainDebate"
import { EProposalType } from "../types"

import { OptionContainer, ActionText, ActionDescriptionText, TitleContainer } from "components/ui"

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
  const { daoDelegate, userVotingWeight, loggedInUser, refreshTokenStats } = useEvmDaoOps()
  const daoCtx = React.useContext(EtherlinkContext)
  const [isDelegating, setIsDelegating] = React.useState(false)
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const proposalTitle = EvmProposalOptions.find(option => option.modal === metadata.type)?.label

  const thresholdRaw = React.useMemo(() => {
    try {
      return BigInt(daoCtx?.daoSelected?.proposalThreshold || 0)
    } catch (_) {
      return BigInt(0)
    }
  }, [daoCtx?.daoSelected?.proposalThreshold])

  const decimals = Number(daoCtx?.daoSelected?.decimals || 0)
  const toHuman = (x: bigint | number) => {
    const v = typeof x === "number" ? BigInt(Math.trunc(x)) : x
    if (!decimals) return v.toString()
    const s = v.toString().padStart(decimals + 1, "0")
    const intPart = s.slice(0, -decimals)
    const frac = s.slice(-decimals).replace(/0+$/, "")
    return frac ? `${intPart}.${frac}` : intPart
  }

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
        <Grid>
          <Box gridGap={2} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
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

          {/* Voting power helper */}
          <Box
            style={{
              display: "flex",
              flexDirection: isMobileSmall ? "column" : "row",
              alignItems: isMobileSmall ? "stretch" : "center",
              gap: 8,
              marginBottom: 24,
              background: theme.palette.primary.main,
              borderRadius: 4,
              padding: 16
            }}
          >
            <Typography color="textPrimary" style={{ flex: 1 }}>
              Voting power: {toHuman(BigInt(Math.max(0, Math.floor(userVotingWeight || 0))))} / Threshold:{" "}
              {toHuman(thresholdRaw)}
            </Typography>
            <NextButton
              disabled={isDelegating || !loggedInUser?.address || (userVotingWeight || 0) > 0}
              onClick={() => {
                if (!loggedInUser?.address) return
                setIsDelegating(true)
                daoDelegate(loggedInUser.address)
                  .then(() => refreshTokenStats())
                  .catch(() => {})
                  .finally(() => setIsDelegating(false))
              }}
            >
              {(userVotingWeight || 0) > 0
                ? "Voting Power Ready"
                : isDelegating
                ? "Delegating..."
                : "Self‑delegate (Claim Voting Power)"}
            </NextButton>
          </Box>

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <BackButton onClick={prevStep.handler} />
            <NextButton onClick={nextStep.handler}>{nextStep.text}</NextButton>
          </Grid>
        </Grid>
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
