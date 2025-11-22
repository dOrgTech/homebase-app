import React from "react"
import { Grid, Typography, useTheme, useMediaQuery } from "components/ui"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { styled } from "@material-ui/core"
import { CreatorBadge } from "modules/lite/explorer/components/CreatorBadge"
import LinkIcon from "assets/img/link.svg"

import ReactHtmlParser from "react-html-parser"
import { Badge } from "components/ui/Badge"
import { StatusBadge } from "modules/explorer/components/StatusBadge"
import { IEvmProposal } from "../types"
import { etherlinkStyled as _est } from "components/ui"
import { CopyButton } from "components/ui"
const { LogoItem, TextContainer, EndTextContainer, EndText, Divider, StyledLink } = _est

const DetailsContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "32px 46px",
  minHeight: 145
}))

export const EvmProposalDetailCard: React.FC<{ poll: IEvmProposal | undefined; displayStatusOverride?: string }> = ({
  poll,
  displayStatusOverride
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoProposalSelected = poll

  return (
    <>
      <DetailsContainer container style={{ gap: 50 }}>
        <Grid container style={{ gap: 25 }}>
          <Grid item>
            <Typography variant="h1" color="textPrimary">
              {daoProposalSelected?.title}
            </Typography>
          </Grid>

          {daoProposalSelected?.status ? (
            <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} alignItems={"center"}>
              <Grid item>
                <Grid
                  container
                  style={{ gap: 23 }}
                  alignItems="center"
                  justifyContent={isMobileSmall ? "center" : "flex-start"}
                >
                  <Grid item>
                    <StatusBadge
                      status={
                        (displayStatusOverride as any) ??
                        (daoProposalSelected?.displayStatus as any) ??
                        ((daoProposalSelected as any)?.status as any)
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Badge status={daoProposalSelected.type} />
                  </Grid>
                  <Grid item>{/* TODO: @ashutoshpw FIX THIS <CommunityBadge id={"DAOID"} /> */}</Grid>
                  <Grid item container direction="row" alignItems="center" style={{ gap: 10 }}>
                    <TextContainer color="textPrimary" variant="body2" style={{ fontSize: 14, marginBottom: 4 }}>
                      Posted by:
                    </TextContainer>
                    <CreatorBadge address={daoProposalSelected?.author} />
                    {daoProposalSelected?.author ? (
                      <Grid item>
                        <CopyButton ariaLabel="Copy author address" text={daoProposalSelected?.author || ""} />
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : null}

          <Grid container direction="row">
            <Grid item container direction="row" alignItems="center">
              <TextContainer color="textPrimary" variant="body2">
                Start date:{" "}
              </TextContainer>
              <EndText variant="body2" color="textPrimary" style={{ fontWeight: 600, borderBottom: "1px solid white" }}>
                {daoProposalSelected?.createdAt?.format("lll")}
              </EndText>
              <Divider color="textPrimary">-</Divider>
              <EndTextContainer color="textPrimary" variant="body2">
                End date:{" "}
              </EndTextContainer>
              <EndText variant="body2" color="textPrimary" style={{ fontWeight: 600, borderBottom: "1px solid white" }}>
                {daoProposalSelected?.votingExpiresAt?.format("lll")}
              </EndText>
            </Grid>
          </Grid>

          <Grid container>
            <Typography variant="body2" color="textPrimary" className="proposal-details">
              {ReactHtmlParser(daoProposalSelected?.description ? daoProposalSelected?.description : "")}
            </Typography>
          </Grid>

          {daoProposalSelected?.externalResource ? (
            <Grid style={{ display: isMobileSmall ? "block" : "flex" }} container alignItems="center">
              <LogoItem src={LinkIcon} />
              <StyledLink color="secondary" href={daoProposalSelected?.externalResource} target="_">
                {daoProposalSelected?.externalResource}
              </StyledLink>
            </Grid>
          ) : null}
        </Grid>
      </DetailsContainer>
    </>
  )
}
