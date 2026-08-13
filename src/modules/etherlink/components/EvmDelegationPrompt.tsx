import React from "react"
import { Box, Typography, styled, useMediaQuery, useTheme, InfoOutlined } from "components/ui"
import { Button } from "components/ui/Button"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"

const PromptBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  background: theme.palette.warning.main,
  borderRadius: 4,
  padding: 16
}))

/**
 * Governance tokens deployed by Homebase use OpenZeppelin's ERC20Votes, where holding
 * tokens grants no voting power until the holder delegates (usually to themselves).
 * Without this prompt, a fresh DAO creator holding the entire supply only discovers the
 * problem after a failed proposal ("You do not meet the proposal threshold").
 *
 * Renders nothing unless the connected wallet actually holds tokens but has zero votes.
 */
export const EvmDelegationPrompt: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("lg"))
  const { daoDelegate, loggedInUser, userTokenBalance, userVotingWeight, refreshTokenStats } = useEvmDaoOps()
  const [isDelegating, setIsDelegating] = React.useState(false)

  const address = loggedInUser?.address
  const needsDelegation = !!address && (userTokenBalance || 0) > 0 && (userVotingWeight || 0) === 0

  if (!needsDelegation) return null

  const onActivate = () => {
    if (!address) return
    setIsDelegating(true)
    daoDelegate(address)
      .then(() => refreshTokenStats())
      .catch(() => {
        // daoDelegate already surfaces a notification on failure
      })
      .finally(() => setIsDelegating(false))
  }

  return (
    <PromptBox
      style={{ flexDirection: isMobileSmall ? "column" : "row", ...style }}
      role="status"
      data-testid="evm-delegation-prompt"
    >
      <InfoOutlined style={{ color: "#000", marginTop: 2 }} />
      <Box style={{ flex: 1 }}>
        <Typography style={{ color: "#000", fontWeight: 600 }}>Your tokens aren&apos;t delegated yet</Typography>
        <Typography style={{ color: "#000", fontSize: 14 }}>
          Holding tokens is not enough to vote or propose. Delegate to yourself to activate your voting power.
        </Typography>
      </Box>
      <Button
        variant="contained"
        disabled={isDelegating}
        onClick={onActivate}
        style={{ whiteSpace: "nowrap", alignSelf: isMobileSmall ? "flex-start" : "center", marginRight: 0 }}
      >
        {isDelegating ? "Activating…" : "Activate voting power"}
      </Button>
    </PromptBox>
  )
}
