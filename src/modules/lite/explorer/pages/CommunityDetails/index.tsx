/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Grid, styled, CircularProgress, Typography } from "@material-ui/core"
import { ProposalList } from "../../components/ProposalList"
import { DaoCardDetail } from "../../components/DaoCardDetail"
import { usePolls } from "../../hooks/usePolls"
import { useCommunity } from "../../hooks/useCommunity"

const CommunityDetailsContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  height: "fit-content",
  [theme.breakpoints.down("md")]: {
    marginTop: 0
  }
}))

const PageContainer = styled("div")({
  marginBottom: 50,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  boxSizing: "border-box",
  paddingTop: 0,

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {},

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
})

export const CommunityDetails: React.FC<{ id: string }> = ({ id }) => {
  const [isUpdated, setIsUpdated] = useState(1)
  const community = useCommunity(id, isUpdated)
  const polls = usePolls(id)

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <CommunityDetailsContainer item xs={12} lg={4} md={4}>
          <DaoCardDetail community={community} setIsUpdated={setIsUpdated} />
        </CommunityDetailsContainer>
        <CommunityDetailsContainer container justifyContent="center" item xs={12} lg={8} md={8}>
          {polls.length > 0 ? (
            <ProposalList polls={polls} id={id} />
          ) : (
            <Typography style={{ width: "inherit" }} color="textPrimary">
              0 proposals found
            </Typography>
          )}
        </CommunityDetailsContainer>
      </Grid>
    </PageContainer>
  )
}
