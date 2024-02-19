import React, { useContext, useEffect } from "react"
import { Box, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useHistory, useRouteMatch } from "react-router-dom"
import { ActionTypes, CreatorContext } from "modules/creator/state"
import { TitleBlock } from "modules/common/TitleBlock"
import { toShortAddress } from "services/contracts/utils"

const ThirdContainer = styled(Grid)({
  marginTop: 42,
  background: "#2F3438",
  borderRadius: 8,
  boxSizing: "border-box"
})

const ThirdContainerFirstRow = styled(Grid)({
  padding: "19px 48px",
  borderBottom: "0.3px solid #7D8C8B",
  alignItems: "center",
  display: "flex",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerLastRow = styled(Grid)({
  padding: "19px 48px",
  alignItems: "center",
  display: "flex",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerRow = styled(Grid)({
  borderBottom: "0.3px solid #7D8C8B",
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerSpecialRow = styled(Grid)({
  borderBottom: "0.3px solid #7D8C8B",
  borderTop: "0.3px solid #7D8C8B",
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const FirstContainer = styled(Grid)({
  background: "#2F3438",
  borderRadius: 8,
  padding: "22px 48px",
  boxSizing: "border-box",
  marginTop: 4
})

const TitleSpacing = styled(Typography)({
  marginTop: 8,
  fontWeight: 600
})

const KeyLabel = styled(Typography)({
  fontWeight: 500
})

const ContainerEdit = styled(Typography)({
  cursor: "pointer"
})

const AdminAddress = styled(Typography)({
  wordBreak: "break-all"
})

export const Summary = (): JSX.Element => {
  const { dispatch, state } = useContext(CreatorContext)
  const history = useHistory()
  const match = useRouteMatch()
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const goToVoting = () => {
    history.push(`voting`)
  }

  const goToQuorum = () => {
    history.push(`quorum`)
  }

  const goToSettings = () => {
    history.push(`dao`)
  }

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          history.push(`type`)
        },
        text: "Continue"
      },
      back: {
        handler: () => history.push(`quorum`),
        text: "Back"
      }
    })
  }, [dispatch, history, match.path, match.url])

  return (
    <Box>
      <Grid container direction="row" justifyContent="space-between" style={{ height: "fit-content" }}>
        <TitleBlock
          title={"Review information"}
          description={"Review your settings to ensure you’ve made the correct choices."}
        ></TitleBlock>

        <ThirdContainer container direction="row">
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                DAO Basis
              </TitleSpacing>
              <ContainerEdit color="secondary" onClick={goToSettings}>
                Edit
              </ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Administrator
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {isMobile
                    ? toShortAddress(state.data.orgSettings.administrator)
                    : state.data.orgSettings.administrator}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Guardian
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {isMobile ? toShortAddress(state.data.orgSettings.guardian) : state.data.orgSettings.guardian}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Governance Token Address
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {isMobile
                    ? toShortAddress(state.data.orgSettings.governanceToken.address)
                    : state.data.orgSettings.governanceToken.address}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Governance Token ID
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.orgSettings.governanceToken.tokenId}
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerLastRow>
        </ThirdContainer>

        <ThirdContainer container direction="row">
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                Proposal & Voting
              </TitleSpacing>
              <ContainerEdit color="secondary" onClick={goToVoting}>
                Edit
              </ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Voting Period Duration
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.votingBlocks} blocks
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Proposal Execution Delay
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposalFlushBlocks} blocks
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Proposal blocks to expire
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposalExpiryBlocks} blocks
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Stake required to propose
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposeStakeRequired} locked tokens
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Stake returned if rejected
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.returnedTokenPercentage}% of locked tokens
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerLastRow>

          <ThirdContainerSpecialRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Transfer maximum XTZ amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.maxXtzAmount} XTZ
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerSpecialRow>

          <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Transfer minimum XTZ amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.minXtzAmount} XTZ
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerLastRow>
        </ThirdContainer>

        <ThirdContainer container direction="row">
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                Quorum
              </TitleSpacing>
              <ContainerEdit color="secondary" onClick={goToQuorum}>
                Edit
              </ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item sm={6} xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum threshold
                </KeyLabel>
              </Grid>
              <Grid item sm={6} xs={5}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumThreshold}%
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item sm={6} xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Change
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumChange}%
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Max Change
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumMaxChange}%
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Min. Amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.minQuorumAmount}%
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Max. Amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.maxQuorumAmount}%
                </Typography>
              </Grid>
            </Grid>
          </ThirdContainerLastRow>
        </ThirdContainer>
      </Grid>
    </Box>
  )
}
