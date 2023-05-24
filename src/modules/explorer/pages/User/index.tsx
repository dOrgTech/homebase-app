import { Box, Grid, Theme, Typography, styled } from "@material-ui/core"
import dayjs from "dayjs"
import { useDAOID } from "modules/explorer/pages/DAO/router"
import React, { useCallback, useEffect, useMemo } from "react"
import { useHistory } from "react-router"
import { useAgoraTopic } from "services/agora/hooks/useTopic"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useUnstakeFromAllProposals } from "services/contracts/baseDAO/hooks/useUnstakeFromAllProposals"
import { toShortAddress } from "services/contracts/utils"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { FreezeDialog } from "../../components/FreezeDialog"
import { ProposalsList } from "../../components/ProposalsList"
import { StatusBadge } from "../../components/StatusBadge"
import { ProfileAvatar } from "../../components/styled/ProfileAvatar"
import { UserBalances } from "../../components/UserBalances"
import { UserProfileName } from "../../components/UserProfileName"
import { DropButton } from "../Proposals"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"

const ContentBlockItem = styled(Grid)({
  padding: "35px 52px",
  borderTop: `0.3px solid #4a4e4e`
})

const BalancesHeader = styled(Grid)(({ theme }: { theme: Theme }) => ({
  minHeight: "178px",
  padding: "46px 55px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none"
}))

const MainContainer = styled(Box)({
  width: "100%"
})

const UsernameText = styled(Typography)({
  fontSize: 18,
  wordBreak: "break-all"
})

const ProposalTitle = styled(Typography)({
  fontWeight: "bold"
})

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  fontSize: 18,
  marginRight: 30
})

const VotedText = styled(Typography)({
  fontSize: 18
})

const CreatedText = styled(Typography)({
  fontWeight: 300
})

export const ProposalItem: React.FC<{
  proposal: Proposal
  status: ProposalStatus
}> = ({ proposal, status, children }) => {
  const { data: agoraPost } = useAgoraTopic(Number(proposal.metadata.agoraPostId))

  const formattedDate = dayjs(proposal.startDate).format("LLL")

  return (
    <ContentBlockItem container justifyContent="space-between" alignItems="center">
      <Grid item sm={8}>
        <Grid container direction="column" style={{ gap: 20 }}>
          <Grid item>
            <ProposalTitle color="textPrimary" variant="body1">
              {agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposal.id)}`}
            </ProposalTitle>
          </Grid>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems="center">
              <Grid item>
                <StatusBadge status={status} />
              </Grid>
              <Grid item>
                <CreatedText variant="body1" color="textPrimary">
                  Created {formattedDate}
                </CreatedText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{children}</Grid>
    </ContentBlockItem>
  )
}

export const User: React.FC = () => {
  const { account } = useTezos()
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const { data: proposals } = useProposals(daoId)
  const history = useHistory()
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)
  const { data: executedProposals } = useProposals(daoId, ProposalStatus.EXECUTED)
  const { data: droppedProposals } = useProposals(daoId, ProposalStatus.DROPPED)
  const { mutate: unstakeFromAllProposals } = useUnstakeFromAllProposals()
  const polls = usePolls(data?.liteDAOData?._id)
  const pollsPosted = polls?.filter(p => p.author === account)

  useEffect(() => {
    if (!account) {
      history.push(`../${daoId}`)
    }
  }, [account, daoId, history])

  const proposalsCreated = useMemo(() => {
    if (!proposals) {
      return []
    }

    return proposals.filter(p => p.proposer.toLowerCase() === account.toLowerCase())
  }, [account, proposals])

  const proposalsVoted = useMemo(() => {
    if (!proposals) {
      return []
    }

    return proposals.filter(p => p.voters.map(voter => voter.address.toLowerCase()).includes(account.toLowerCase()))
  }, [account, proposals])

  const onUnstakeFromAllProposals = useCallback(async () => {
    if (droppedProposals && executedProposals && data) {
      const allProposals = droppedProposals.concat(executedProposals)

      const proposalsWithStakedTokens: Proposal[] = []

      allProposals.forEach((proposal: Proposal) => {
        const userVote = proposal.voters.find(voter => voter.address === account)
        if (userVote && userVote.staked) {
          proposalsWithStakedTokens.push(proposal)
        }
      })

      unstakeFromAllProposals({
        dao: data,
        allProposals: proposalsWithStakedTokens.map(p => p.id)
      })
      return
    }
  }, [data, account, unstakeFromAllProposals, droppedProposals, executedProposals])

  const canUnstakeVotes: boolean | undefined =
    executedProposals &&
    droppedProposals &&
    executedProposals
      .concat(droppedProposals)
      .some(proposal => proposal.voters.find(vote => vote.address === account)?.staked)

  const getVoteDecision = (proposal: Proposal) =>
    proposal.voters.find(voter => voter.address.toLowerCase())?.support as boolean

  return (
    <MainContainer>
      <Grid container direction="column" style={{ gap: 40 }} wrap={"nowrap"}>
        <BalancesHeader item>
          <UserBalances daoId={daoId}>
            <Grid item>
              <Grid container alignItems="center" justifyContent="space-between" style={{ gap: 20 }}>
                <Grid item>
                  <Grid container spacing={2} alignItems="center" wrap="nowrap">
                    <Grid item>
                      <ProfileAvatar size={43} address={account} />
                    </Grid>
                    <Grid item>
                      <UsernameText color="textPrimary">
                        <UserProfileName address={account} />
                      </UsernameText>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <FreezeDialog freeze={true} />
                    </Grid>
                    <Grid item>
                      <FreezeDialog freeze={false} />
                    </Grid>
                    <Grid item>
                      <DropButton
                        variant="contained"
                        color="secondary"
                        onClick={onUnstakeFromAllProposals}
                        disabled={!canUnstakeVotes}
                      >
                        Unstake Votes
                      </DropButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </UserBalances>
        </BalancesHeader>
        <Grid item>
          {proposalsCreated && cycleInfo && (
            <ProposalsList
              currentLevel={cycleInfo.currentLevel}
              proposals={proposalsCreated}
              title={"Proposals Posted"}
              liteProposals={pollsPosted}
            />
          )}
        </Grid>
        <Grid item>
          {proposalsVoted && cycleInfo && (
            <ProposalsList
              title={"Voting History"}
              currentLevel={cycleInfo.currentLevel}
              proposals={proposalsVoted}
              rightItem={proposal => {
                const voteDecision = getVoteDecision(proposal)
                return (
                  <Grid container>
                    <Grid item>
                      <VotedText color="textPrimary">Voted</VotedText>
                    </Grid>
                    <Grid item>
                      <StatusText color={voteDecision ? "secondary" : "error"}>
                        {voteDecision ? "YES" : "NO"}
                      </StatusText>
                    </Grid>
                  </Grid>
                )
              }}
              liteProposals={pollsPosted}
            />
          )}
        </Grid>
      </Grid>
    </MainContainer>
  )
}
