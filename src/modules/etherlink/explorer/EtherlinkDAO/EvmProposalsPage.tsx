import { useMemo } from "react"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { Grid, MenuItem, Typography, useTheme } from "@material-ui/core"
import { TitleText } from "components/ui/TitleText"
import { HeroContainer } from "components/ui/HeroContainer"
import { SmallButton } from "modules/common/SmallButton"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import Select from "@mui/material/Select"
import { useQueryParam } from "modules/home/hooks/useQueryParam"
import { useTimelineForProposals } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { IEvmProposal } from "modules/etherlink/types"

export const EvmProposalsPage = () => {
  const [proposalType, setProposalType] = useQueryParam("type")
  const [proposalStatus, setProposalStatus] = useQueryParam("status")
  const [proposalAuthor] = useQueryParam("author")
  const { daoProposals, daoSelected, isProposalDialogOpen, setIsProposalDialogOpen } = useContext(EtherlinkContext)
  const processedProposals = useTimelineForProposals<IEvmProposal>(
    daoProposals as unknown as IEvmProposal[],
    daoSelected as any
  )

  const theme = useTheme()

  const filteredProposals = useMemo(() => {
    if (
      (proposalType === "all" && proposalStatus === "all") ||
      (!proposalType && !proposalStatus) ||
      (proposalType === "all" && !proposalStatus)
    )
      return processedProposals

    return processedProposals?.filter((proposal: any) => {
      if (proposalAuthor && proposalAuthor !== "all" && proposal.author === proposalAuthor) return true
      if (proposalType && proposalType !== "all" && proposal.type === proposalType) return true
      if (proposalStatus && proposalStatus !== "all" && proposal.status === proposalStatus) return true

      if (
        proposalType === "token" &&
        (proposal.type?.toLowerCase().startsWith("mint") || proposal.type?.toLowerCase().startsWith("burn"))
      )
        return true

      return false
    })
  }, [processedProposals, proposalType, proposalStatus, proposalAuthor])

  return (
    <>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <TitleText color="textPrimary">Proposals</TitleText>
      </Grid>
      <Grid container direction="column" style={{ gap: 42, backgroundColor: "rgb(36, 40, 45)", padding: "10px" }}>
        <HeroContainer item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid container spacing={2} alignItems="center" style={{ marginTop: 20 }}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  Type
                </Typography>
                <Select
                  fullWidth
                  labelId="proposal-type-select-label"
                  id="proposal-type-select"
                  defaultValue="all"
                  style={{ color: "#fff", border: "1px solid #ccc", height: "40px" }}
                  value={proposalType || "all"}
                  onChange={e => setProposalType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="offchain">Off-Chain</MenuItem>
                  <MenuItem value="token">Token Operation</MenuItem>
                  <MenuItem value="registry">Registry</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="contract call">Contract Call</MenuItem>
                  <MenuItem value="voting delay">Voting Delay</MenuItem>
                  <MenuItem value="voting period">Voting Period</MenuItem>
                  <MenuItem value="proposal threshold">Proposal Threshold</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="textPrimary" gutterBottom>
                  Status
                </Typography>
                <Select
                  fullWidth
                  defaultValue="all"
                  style={{ color: "#fff", border: "1px solid #ccc", height: "40px" }}
                  value={proposalStatus || "all"}
                  onChange={e => setProposalStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="passed">Passed</MenuItem>
                  <MenuItem value="executable">Executable</MenuItem>
                  <MenuItem value="executed">Executed</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="no quorum">No Quorum</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%"
                }}
              >
                <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>
                  {processedProposals?.length || 0} Proposals
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3} style={{ textAlign: "right", justifyContent: "flex-end" }}>
                <SmallButton variant="contained" color="secondary" onClick={() => setIsProposalDialogOpen(true)}>
                  New Proposal
                </SmallButton>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>
        <ProposalActionsDialog open={isProposalDialogOpen} handleClose={() => setIsProposalDialogOpen(false)} />
      </Grid>
      <EvmDaoProposalList proposals={filteredProposals} />
    </>
  )
}
