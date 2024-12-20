import { GridContainer } from "modules/common/GridContainer"
import { Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PageContainer } from "components/ui/DaoCreator"
import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { EVM_PROPOSAL_CHOICES } from "modules/etherlink/config"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"

export const EvmProposalDetailsPage = () => {
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId

  const { daoSelected, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)

  // const daoSelected = {}
  // const daoProposalSelected = {}
  // const selectDaoProposal = () => {}

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    selectDaoProposal(proposalId)
  }, [proposalId, selectDaoProposal])

  const choices = EVM_PROPOSAL_CHOICES

  return (
    <div>
      <PageContainer style={{ gap: 30 }}>
        <Grid container style={{ gap: 30 }}>
          <Grid item>
            <EvmProposalDetailCard poll={daoProposalSelected} />
          </Grid>
          <Grid item>
            <EvmProposalCountdown />
          </Grid>
          <Grid container item xs={12}>
            {choices && choices.length > 0 ? (
              <GridContainer container style={{ gap: 32 }} direction="row" justifyContent="center">
                <Grid
                  container
                  item
                  justifyContent={isMobileSmall ? "center" : "space-between"}
                  direction="row"
                  style={{ gap: 30 }}
                >
                  {/* {[choices].map((choice, index) => {
                    return (
                      <ChoiceItemSelected
                        multiple={false}
                        key={index}
                        choice={choice}
                        votes={[]}
                        setSelectedVotes={() => {}}
                      />
                    )
                  })} */}
                </Grid>
                {/* {poll?.isActive === ProposalStatus.ACTIVE ? (
                  <Button
                    disabled={
                      (selectedVotes.length === 0 || (votingPower && votingPower.eq(new BigNumber(0)))) && isMember
                    }
                    variant="contained"
                    color="secondary"
                    onClick={() => saveVote()}
                  >
                    {votingPower && votingPower.gt(new BigNumber(0)) ? "Cast your vote" : "No Voting Weight"}
                  </Button>
                ) : null} */}
              </GridContainer>
            ) : null}
          </Grid>

          <Grid item xs={12}>
            {/* {poll && poll !== undefined ? (
              <VoteDetails
                isXTZ={poll.isXTZ}
                poll={poll}
                choices={choices}
                token={community?.tokenAddress}
                communityId={community?._id}
              />
            ) : null} */}
          </Grid>
        </Grid>
      </PageContainer>
      <EvmProposalVoteDetail poll={daoProposalSelected} choices={choices} token={daoSelected?.token} />
      <EvmProposalVoterList />
    </div>
  )
}
