import React from "react"
import { Grid, useMediaQuery, useTheme } from "@material-ui/core"
import ProgressBar from "react-customizable-progressbar"
import dayjs from "dayjs"
import { ContainerVoteDetail as Container, HistoryItem, HistoryKey, HistoryValue, ProgressText } from "./styled"
import { ContainerTitle } from "components/ui/Containers"

export const ProposalHistory = ({
  votesQuorumPercentage,
  statusHistory
}: {
  votesQuorumPercentage: number
  statusHistory: { status: string; timestamp: dayjs.Dayjs; timestamp_human: string }[]
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <Container container style={{ marginTop: 60, marginBottom: 12 }}>
      <Grid item container direction="column" spacing={8} style={{ paddingLeft: 12, paddingRight: 12 }}>
        <Grid item container direction="row" spacing={8}>
          <Grid item xs={isMobileSmall ? 12 : 4} container>
            <Container item xs style={{ padding: 20 }}>
              <ContainerTitle color="textPrimary">Quorum</ContainerTitle>
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
                    progress={votesQuorumPercentage}
                    radius={70}
                    strokeWidth={7}
                    strokeColor="#81FEB7"
                    trackStrokeWidth={4}
                    trackStrokeColor={theme.palette.primary.light}
                  >
                    <div className="indicator">
                      <ProgressText textcolor="#81FEB7">{`${votesQuorumPercentage}%`}</ProgressText>
                    </div>
                  </ProgressBar>
                </Grid>
              </Grid>
            </Container>
          </Grid>

          <Grid item xs={isMobileSmall ? 12 : 8} container>
            <Grid container>
              <Container item md={12} xs={12} style={{ padding: "20px" }}>
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
      </Grid>
    </Container>
  )
}
