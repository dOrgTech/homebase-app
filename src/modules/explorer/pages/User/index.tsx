import { Box, Button, Grid, Theme, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import dayjs from "dayjs"
import { useDAOID } from "modules/explorer/pages/DAO/router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
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
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import { Delegation } from "./components/DelegationBanner"
import { useTokenDelegationSupported } from "services/contracts/token/hooks/useTokenDelegationSupported"
import { CopyButton } from "modules/common/CopyButton"
import { UserMovements } from "./components/UserMovements"
import { useUserVotes } from "modules/lite/explorer/hooks/useUserVotes"
import { Choice } from "models/Choice"
import { Poll } from "models/Polls"

const ContentBlockItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: "37px 42px",
  background: theme.palette.primary.main,
  borderRadius: 8
}))

const BalancesHeader = styled(Grid)(({ theme }: { theme: Theme }) => ({
  minHeight: "178px",
  padding: "40px 48px",
  gap: 16,
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
  display: "grid"
}))

const MainContainer = styled(Box)({
  width: "100%"
})

const UsernameText = styled(Typography)({
  fontSize: 18,
  wordBreak: "break-all",
  marginLeft: 10
})

const ProposalTitle = styled(Typography)({
  fontWeight: "bold"
})

const CreatedText = styled(Typography)({
  fontWeight: 300
})

const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: 32
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

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const history = useHistory()
  const { data: executedProposals } = useProposals(daoId, ProposalStatus.EXECUTED)
  const { data: droppedProposals } = useProposals(daoId, ProposalStatus.DROPPED)
  const { mutate: unstakeFromAllProposals } = useUnstakeFromAllProposals()
  const { data: polls } = usePolls(data?.liteDAOData?._id)
  const pollsPosted: Poll[] | undefined = polls?.filter(p => p.author === account)

  const { data: userVotes } = useUserVotes()

  const { data: isTokenDelegationSupported } = useTokenDelegationSupported(data?.data.token.contract)

  const votedPolls: any = []
  pollsPosted?.map((p: Poll) => {
    if (userVotes && userVotes.filter(v => p._id === v.pollID).length > 0) {
      return votedPolls.push(p)
    }
  })

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
        <BalancesHeader item style={{ gap: 16 }}>
          <Grid container direction="row">
            <TitleText color="textPrimary">My Address</TitleText>
          </Grid>
          <Grid container alignItems="center" justifyContent="space-between" style={{ gap: isMobileSmall ? 30 : 20 }}>
            <Grid item md={6} xs={12}>
              <Grid container alignItems="center" wrap="nowrap">
                <Grid item>
                  <ProfileAvatar size={40} address={account} />
                </Grid>
                <Grid item>
                  <UsernameText color="textPrimary">
                    <UserProfileName address={account} />
                  </UsernameText>
                </Grid>
                <Grid item>
                  <CopyButton text={account} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={5} xs={12}>
              <Grid container spacing={2} alignItems="center" justifyContent={isMobileSmall ? "center" : "flex-end"}>
                <Grid item>
                  <FreezeDialog freeze={true} />
                </Grid>
                <Grid item>
                  <FreezeDialog freeze={false} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </BalancesHeader>

        <UserBalances
          daoId={daoId}
          canUnstakeVotes={canUnstakeVotes || false}
          onUnstakeFromAllProposals={onUnstakeFromAllProposals}
        ></UserBalances>

        {isTokenDelegationSupported ? <Delegation daoId={daoId} /> : null}

        <UserMovements
          daoId={daoId}
          getVoteDecision={getVoteDecision}
          proposalsVoted={proposalsVoted}
          cycleInfo={cycleInfo}
          proposalsCreated={proposalsCreated}
          pollsPosted={pollsPosted}
          pollsVoted={votedPolls}
        />
      </Grid>
    </MainContainer>
  )
}
