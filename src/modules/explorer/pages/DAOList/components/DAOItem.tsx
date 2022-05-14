import { styled, Grid, Theme, Typography, Link, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { useHistory } from "react-router-dom"

const Container = styled(Grid)(({ theme }: { theme: Theme }) => ({
  "background": theme.palette.primary.main,
  "width": 584,
  "maxWidth": "calc(100vw - 48px)",
  "minHeight": 140,
  "wordBreak": "break-all",
  "borderRadius": 8,
  "boxSizing": "border-box",
  "padding": 32,
  "cursor": "pointer",

  "&:hover": {
    background: theme.palette.secondary.dark
  }
}))

const SymbolText = styled(Typography)({
  fontSize: "18px",
  letterSpacing: "-0.01em"
})

const NameText = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  overflow: "hidden",
  fontSize: 35
}))

const NumberText = styled(Typography)({
  fontSize: "28px",
  letterSpacing: "-0.01em"
})

const VotingAddressesText = styled(Typography)({
  fontSize: "20px",
  letterSpacing: "-0.01em"
})

export const DAOItem: React.FC<{
  dao: {
    id: string
    name: string
    symbol: string
    votingAddresses: string[]
  }
}> = ({ dao }) => {
  const theme = useTheme()
  const history = useHistory()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const handleNavigateToDao = () => {
    history.push(`dao/${dao.id}`)
  }

  return (
    <Link underline="none" onClick={handleNavigateToDao}>
      <Container container justifyContent="space-between" style={{ gap: 16 }}>
        <Grid item xs={12} sm={7}>
          <SymbolText color="secondary">{dao.symbol.toUpperCase()}</SymbolText>
          <NameText color="textPrimary">{dao.name}</NameText>
        </Grid>
        <Grid item xs={12} sm>
          {!isExtraSmall && <NumberText color="textPrimary">{dao.votingAddresses.length}</NumberText>}

          <VotingAddressesText color="textPrimary">
            {isExtraSmall ? dao.votingAddresses.length : ""} VOTING ADDRESSES
          </VotingAddressesText>
        </Grid>
      </Container>
    </Link>
  )
}
