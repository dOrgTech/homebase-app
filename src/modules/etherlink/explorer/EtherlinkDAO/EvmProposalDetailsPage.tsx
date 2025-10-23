import { Grid } from "components/ui"
import { useContext } from "react"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ProposalActionSection } from "./components/ProposalActionSection"
import { ProposalDataSection } from "./components/ProposalDataSection"
import { useProposalLifecycle } from "./hooks/useProposalLifecycle"

export const EvmProposalDetailsPage = () => {
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId

  const { daoSelected, daoProposals, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)
  const { effectiveDisplayStatus: headerDisplayStatus } = useProposalTimeline(daoProposalSelected, daoSelected)

  useProposalLifecycle({
    proposalId,
    daoProposalSelected,
    daoSelected,
    daoProposals,
    selectDaoProposal
  })

  return (
    <div>
      <Grid container style={{ gap: 30 }}>
        <Grid item>
          <EvmProposalDetailCard poll={daoProposalSelected} displayStatusOverride={headerDisplayStatus as any} />
        </Grid>
      </Grid>

      <ProposalActionSection daoProposalSelected={daoProposalSelected} daoSelected={daoSelected} />

      <EvmProposalVoteDetail poll={daoProposalSelected} token={daoSelected?.token} />

      <ProposalDataSection proposalData={daoProposalSelected?.proposalData} />

      <EvmProposalVoterList />
    </div>
  )
}
