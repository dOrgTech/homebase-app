import React from "react"
import { Grid, Typography, styled, useMediaQuery, useTheme } from "components/ui"
import { LinearProgress } from "components/ui/LinearProgress"
import { GridContainer } from "modules/common/GridContainer"

// Shared, presentational layout for off-chain vote summaries
// Mirrors the look-and-feel used in Tezos VoteDetails for visual parity.

type VoteItem = {
  id: string
  label: string
  votersLabel: string
  percent: number // 0..100
}

// Match Tezos VoteDetails look-and-feel
const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

const TitleContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 48px 10px",
  borderRadius: 8,
  marginTop: 20,
  gap: 32,
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

const LinearContainer = styled(GridContainer)({
  paddingBottom: 0,
  minHeight: 70,
  background: "inherit !important"
})

const LegendContainer = styled(GridContainer)({
  minHeight: 30,
  paddingBottom: 0,
  alignItems: "center",
  background: "inherit"
})

const GraphicsContainer = styled(Grid)({
  paddingBottom: 25
})

export const OffchainVotesLayout: React.FC<{
  header?: string
  items: VoteItem[]
  totalLabelLeft?: string
  totalValue?: string | number
  rightExtras?: React.ReactNode
  onOpenVotes?: () => void
}> = ({ header = "Votes", items, totalLabelLeft = "Total Votes:", totalValue = "", rightExtras, onOpenVotes }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const total = typeof totalValue === "number" ? totalValue : Number(totalValue || 0)

  return (
    <Container container direction="column">
      <TitleContainer item>
        <Typography style={{ fontSize: 24, fontWeight: 600 }} color="textPrimary">
          {header}
        </Typography>
      </TitleContainer>

      <GraphicsContainer container>
        {items.map(it => {
          const pct = Number.isFinite(it.percent) ? Math.max(0, Math.min(100, it.percent)) : 0
          return (
            <LinearContainer key={it.id} container direction="column" style={{ gap: 20 }}>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={12} lg={6} sm={6}>
                  <Typography color="textPrimary" variant="body2">
                    {it.label}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6} sm={6} container justifyContent={isMobileSmall ? "flex-start" : "flex-end"}>
                  <Typography color="textPrimary" variant="body2">
                    {it.votersLabel}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item xs={10} lg={11} sm={11}>
                  <LinearProgress value={pct} variant="success" />
                </Grid>
                <Grid item xs={2} lg={1} sm={1} container justifyContent="flex-end">
                  <Typography color="textPrimary" variant="body2">
                    {pct}%
                  </Typography>
                </Grid>
              </Grid>
            </LinearContainer>
          )
        })}

        <LegendContainer container direction="row">
          <Grid item container direction="row" xs={12} sm={6} md={6} lg={6} style={{ gap: 10 }}>
            <Typography color="textPrimary" variant="body1" onClick={onOpenVotes}>
              {totalLabelLeft}
            </Typography>
            <Typography color="textPrimary" variant="body1" onClick={onOpenVotes}>
              {Number.isFinite(total) ? total : String(totalValue)}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            xs={12}
            md={6}
            sm={6}
            lg={6}
            style={{ gap: 10 }}
            alignItems="baseline"
            justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
          >
            {rightExtras}
          </Grid>
        </LegendContainer>
      </GraphicsContainer>
    </Container>
  )
}

export default OffchainVotesLayout
