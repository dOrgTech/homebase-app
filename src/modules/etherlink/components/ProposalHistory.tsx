import React, { useContext } from "react"
import { Grid, useMediaQuery, useTheme, Typography } from "components/ui"
import ProgressBar from "react-customizable-progressbar"
import dayjs from "dayjs"
import { etherlinkStyled as _est } from "components/ui"
import { formatVotingWeight } from "services/contracts/utils"
const { ContainerVoteDetail: Container, HistoryItem, HistoryKey, HistoryValue, ProgressText } = _est
import { ContainerTitle } from "components/ui/Containers"
import { EtherlinkContext } from "services/wagmi/context"

export const ProposalHistory = ({
  votesQuorumPercentage,
  statusHistory,
  inFavor,
  against,
  totalSupply,
  decimals
}: {
  votesQuorumPercentage: number
  statusHistory: { status: string; timestamp: dayjs.Dayjs; timestamp_human: string }[]
  inFavor?: string
  against?: string
  totalSupply?: string
  decimals?: number
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const { daoSelected } = useContext(EtherlinkContext)

  const safePct = Number.isFinite(votesQuorumPercentage) ? Math.max(0, Math.min(100, votesQuorumPercentage)) : 0
  const quorumThreshold = daoSelected?.quorum || 0
  const isQuorumMet = safePct >= quorumThreshold

  // Calculate turnout
  const totalVotes = BigInt(inFavor || "0") + BigInt(against || "0")
  const totalSupplyBigInt = BigInt(totalSupply || "0")
  const turnoutPercentage = totalSupplyBigInt > 0n ? (Number(totalVotes) / Number(totalSupplyBigInt)) * 100 : 0
  const formattedTotalVotes = decimals !== undefined ? formatVotingWeight(totalVotes, decimals) : "0"

  return (
    <Grid item container direction="row" spacing={4} style={{ marginTop: 32, marginBottom: 12 }}>
      {/* Quorum card */}
      <Grid item xs={isMobileSmall ? 12 : 4} container>
        <Container item xs style={{ padding: 20 }}>
          <ContainerTitle color="textPrimary">
            Quorum <span style={{ color: isQuorumMet ? "#4CAF50" : "#F44336" }}>{isQuorumMet ? "Met" : "Not Met"}</span>
          </ContainerTitle>
          {inFavor !== undefined && against !== undefined && totalSupply !== undefined && decimals !== undefined && (
            <Typography variant="body2" color="textPrimary" style={{ marginTop: 8, marginBottom: 8 }}>
              Turnout: <strong>{formattedTotalVotes}</strong> ({turnoutPercentage.toFixed(2)}%)
            </Typography>
          )}
          <Grid
            container
            direction="column"
            justifyContent={isMobileSmall ? "flex-start" : "center"}
            style={{ height: "100%" }}
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item>
              <ProgressBar
                progress={safePct}
                radius={70}
                strokeWidth={7}
                strokeColor="#81FEB7"
                trackStrokeWidth={4}
                trackStrokeColor={theme.palette.primary.light}
              >
                <div className="indicator">
                  <ProgressText textcolor="#81FEB7">{`${safePct.toFixed(2)}%`}</ProgressText>
                </div>
              </ProgressBar>
            </Grid>
          </Grid>
        </Container>
      </Grid>

      {/* History card */}
      <Grid item xs={isMobileSmall ? 12 : 8} container>
        <Grid container>
          <Container item md={12} xs={12} style={{ padding: 20 }}>
            <ContainerTitle color="textPrimary" style={{ marginBottom: 24 }}>
              History
            </ContainerTitle>
            {statusHistory?.map((item, index) => (
              <HistoryItem
                item
                container
                direction="row"
                key={index}
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
                xs={12}
                style={{ gap: 8 }}
              >
                <Grid item xs={5}>
                  <HistoryKey color="textPrimary">{item.status}</HistoryKey>
                </Grid>
                <Grid item xs={5}>
                  <HistoryValue align="right" color="textPrimary" variant="subtitle2">
                    {item.timestamp_human}
                  </HistoryValue>
                </Grid>
              </HistoryItem>
            ))}
          </Container>
        </Grid>
      </Grid>
    </Grid>
  )
}
