import { GridContainer } from "modules/common/GridContainer"
import { Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PageContainer } from "components/ui/DaoCreator"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { EVM_PROPOSAL_CHOICES } from "modules/etherlink/config"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ThumbDownAlt } from "@mui/icons-material"
import { ThumbUpAlt } from "@mui/icons-material"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"

export const EvmProposalDetailsPage = () => {
  const [isCastingVote, setIsCastingVote] = useState(false)
  const openNotification = useNotification()
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId

  const { daoSelected, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)
  const { castVote } = useEvmProposalOps()

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
          <Grid item xs={12} md={6}>
            <Grid>
              <EvmProposalCountdown />
            </Grid>
            <Grid container style={{ gap: 10 }} alignItems="center" justifyContent="center">
              <Button
                disabled={isCastingVote}
                onClick={() => {
                  setIsCastingVote(true)
                  castVote(daoProposalSelected?.id, true)
                    .then((receipt: any) => {
                      console.log("Receipt", receipt)
                      openNotification({
                        message: "Vote cast successfully",
                        autoHideDuration: 2000,
                        variant: "success"
                      })
                    })
                    .finally(() => {
                      setIsCastingVote(false)
                    })
                }}
                variant="contained"
                color="secondary"
                style={{ background: "rgb(113 214 156)" }}
              >
                <ThumbUpAlt sx={{ mr: 1 }} /> Support
              </Button>
              <Button
                onClick={() => {
                  setIsCastingVote(true)
                  castVote(daoProposalSelected?.id, false)
                    .then((receipt: any) => {
                      console.log("Receipt", receipt)
                      openNotification({
                        message: "Vote cast successfully",
                        autoHideDuration: 2000,
                        variant: "success"
                      })
                    })
                    .finally(() => {
                      setIsCastingVote(false)
                    })
                }}
                variant="contained"
                color="secondary"
                style={{ background: "red" }}
              >
                <ThumbDownAlt sx={{ mr: 1 }} /> Reject
              </Button>
            </Grid>
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
