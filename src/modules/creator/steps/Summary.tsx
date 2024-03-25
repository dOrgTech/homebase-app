import React, { useContext, useEffect } from "react"
import { Box, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useHistory, useRouteMatch } from "react-router-dom"
import { ActionTypes, CreatorContext } from "modules/creator/state"
import { TitleBlock } from "modules/common/TitleBlock"
import { toShortAddress } from "services/contracts/utils"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "modules/explorer/components/CopyButton"

const ThirdContainer = styled(Grid)({
  marginTop: 40,
  background: "#2F3438",
  borderRadius: 8,
  boxSizing: "border-box"
})

const ThirdContainerFirstRow = styled(Grid)({
  padding: "19px 48px",
  backgroundColor: "#2f3438",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottom: "0.3px solid #575757",
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
  borderBottom: "0.3px solid #575757",
  backgroundColor: "#24282d",
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerRowDescription = styled(Grid)({
  backgroundColor: "#2f3438",
  padding: "24px 48px",
  maxHeight: "inherit",
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerRowOdd = styled(Grid)({
  backgroundColor: "#2a2e32",
  borderBottom: "0.3px solid #575757",
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerRowOddLast = styled(Grid)({
  backgroundColor: "#2a2e32",
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerSpecialRow = styled(Grid)({
  borderBottom: "0.3px solid #575757",
  borderTop: "0.3px solid #575757",
  padding: "24px 48px",
  maxHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const TitleSpacing = styled(Typography)({
  marginTop: 8,
  fontWeight: 600
})

const KeyLabel = styled(Typography)({
  fontWeight: 500,
  cursor: "default"
})

const ContainerEdit = styled(Typography)({
  cursor: "pointer"
})

const AdminAddress = styled(Typography)({
  wordBreak: "break-all",
  cursor: "default"
})

const ValueLabel = styled(Typography)({
  cursor: "default"
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

          <ThirdContainerRowOdd item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  DAO Name
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {state.data.orgSettings.name}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Token Symbol
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {state.data.orgSettings.symbol}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOdd item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Token Address
                </KeyLabel>
              </Grid>
              <Grid item xs={7} container direction="row" alignItems="center" justifyContent="flex-end">
                <Blockie
                  style={{ marginRight: 8 }}
                  address={state.data.orgSettings.governanceToken.address}
                  size={24}
                />
                <AdminAddress variant="subtitle2" color="textSecondary" align="right" style={{ marginRight: 8 }}>
                  {toShortAddress(state.data.orgSettings.governanceToken.address)}
                </AdminAddress>
                <CopyButton text={state.data.orgSettings.governanceToken.address} />
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Token ID
                </KeyLabel>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {state.data.orgSettings.governanceToken.tokenId}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOdd item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Guardian
                </KeyLabel>
              </Grid>
              <Grid item xs={7} container direction="row" alignItems="center" justifyContent="flex-end">
                <Blockie style={{ marginRight: 8 }} address={state.data.orgSettings.guardian} size={24} />
                <AdminAddress variant="subtitle2" color="textSecondary" align="right" style={{ marginRight: 8 }}>
                  {toShortAddress(state.data.orgSettings.guardian)}
                </AdminAddress>
                <CopyButton text={state.data.orgSettings.guardian} />
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRowDescription item xs={12}>
            <Grid item container direction="column" alignItems="flex-start">
              <Grid item xs={12} style={{ marginBottom: 16 }}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Description
                </KeyLabel>
              </Grid>
              <Grid item xs={12}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="left">
                  {state.data.orgSettings.description}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRowDescription>
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

          <ThirdContainerRowOdd item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Voting Period Duration
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.votingBlocks} blocks
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Proposal Execution Delay
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposalFlushBlocks} blocks
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOdd item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Proposal blocks to expire
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposalExpiryBlocks} blocks
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Stake required to propose
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.proposeStakeRequired} locked tokens
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOdd item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Stake returned if rejected
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.returnedTokenPercentage}% of locked tokens
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Transfer maximum XTZ amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.maxXtzAmount} XTZ
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOddLast item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Transfer minimum XTZ amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.votingSettings.minXtzAmount} XTZ
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOddLast>
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

          <ThirdContainerRowOdd item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item sm={6} xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum threshold
                </KeyLabel>
              </Grid>
              <Grid item sm={6} xs={5}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumThreshold}%
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item sm={6} xs={7}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Change
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumChange}%
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOdd item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Max Change
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.quorumMaxChange}%
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOdd>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Min. Amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.minQuorumAmount}%
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRowOddLast item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={7} sm={6}>
                <KeyLabel variant="subtitle2" color="textSecondary">
                  Quorum Max. Amount
                </KeyLabel>
              </Grid>
              <Grid item xs={5} sm={6}>
                <ValueLabel variant="subtitle2" color="textSecondary" align="right">
                  {state.data.quorumSettings.maxQuorumAmount}%
                </ValueLabel>
              </Grid>
            </Grid>
          </ThirdContainerRowOddLast>
        </ThirdContainer>
      </Grid>
    </Box>
  )
}
