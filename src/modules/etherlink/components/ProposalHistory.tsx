import React, { useContext } from "react"
import { Grid, useMediaQuery, useTheme } from "components/ui"
import ProgressBar from "react-customizable-progressbar"
import dayjs from "dayjs"
import { etherlinkStyled as _est } from "components/ui"
import BigNumber from "bignumber.js"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
const { ContainerVoteDetail: Container, HistoryItem, HistoryKey, HistoryValue, ProgressText } = _est
import { ContainerTitle } from "components/ui/Containers"
import { EtherlinkContext } from "services/wagmi/context"

export const ProposalHistory = ({
  votesQuorumPercentage,
  statusHistory
}: {
  votesQuorumPercentage: number
  statusHistory: { status: string; timestamp: dayjs.Dayjs; timestamp_human: string }[]
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const { daoSelected } = useContext(EtherlinkContext)

  const safePct = Number.isFinite(votesQuorumPercentage) ? Math.max(0, Math.min(100, votesQuorumPercentage)) : 0
  const quorumThreshold = daoSelected?.quorum || 0
  const isQuorumMet = safePct >= quorumThreshold

  try {
    console.log("[ProposalHistory] input/output", { input: votesQuorumPercentage, safePct })
  } catch (_) {}

  return (
    <Grid item container direction="row" spacing={4} style={{ marginTop: 32, marginBottom: 12 }}>
      {/* Quorum card */}
      <Grid item xs={isMobileSmall ? 12 : 4} container>
        <Container item xs style={{ padding: 20 }}>
          <ContainerTitle color="textPrimary">
            Quorum <span style={{ color: isQuorumMet ? "#4CAF50" : "#F44336" }}>{isQuorumMet ? "Met" : "Not Met"}</span>
          </ContainerTitle>
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
                  <ProgressText textcolor="#81FEB7">{`${formatNumber(new BigNumber(safePct || 0))}%`}</ProgressText>
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
