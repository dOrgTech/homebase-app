import React from "react"
import { Grid, Typography, useTheme, useMediaQuery } from "components/ui"
import { GridContainer } from "modules/common/GridContainer"
import { CreatorBadge } from "modules/lite/explorer/components/CreatorBadge"
import Share from "assets/img/share.svg"
import LinkIcon from "assets/img/link.svg"

import { useNotification } from "modules/common/hooks/useNotification"
import ReactHtmlParser from "react-html-parser"
import { Badge } from "components/ui/Badge"
import { StatusBadge } from "modules/explorer/components/StatusBadge"
import { CopyIcon } from "components/ui/icons/CopyIcon"
import { IEvmProposal } from "../types"
import { etherlinkStyled as _est } from "components/ui"
const { LogoItem, CustomPopover, TextContainer, EndTextContainer, EndText, Divider, StyledLink } = _est

export const EvmProposalDetailCard: React.FC<{ poll: IEvmProposal | undefined }> = ({ poll }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoProposalSelected = poll
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openNotification = useNotification()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popper" : undefined

  const handleCopy = () => {
    const url = location.href
    navigator.clipboard.writeText(url)
    openNotification({
      message: "Proposal link copied to clipboard!",
      autoHideDuration: 3000,
      variant: "success"
    })
    handleClose()
  }

  return (
    <>
      <GridContainer container style={{ gap: 50 }}>
        <Grid container style={{ gap: 25 }}>
          <Grid
            item
            container
            alignItems="flex-end"
            direction="row"
            style={{ gap: isMobileSmall ? 25 : 0 }}
            justifyContent={isMobileSmall ? "center" : "space-between"}
          >
            <Grid item>
              <Typography variant="h1" color="textPrimary">
                {daoProposalSelected?.title}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container style={{ gap: 18 }} direction="row">
                <Grid item>
                  <Grid
                    container
                    style={{ gap: 12, cursor: "pointer" }}
                    alignItems="center"
                    aria-describedby={id}
                    onClick={handleClick}
                  >
                    <LogoItem src={Share} />
                    <Typography color="secondary" variant="body2">
                      Share
                    </Typography>
                  </Grid>
                  <CustomPopover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left"
                    }}
                  >
                    <Grid container direction="row" onClick={handleCopy}>
                      <CopyIcon />
                      <Typography variant="subtitle2">Copy link</Typography>
                    </Grid>
                  </CustomPopover>
                </Grid>
              </Grid>
            </Grid>
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
                    <StatusBadge status={daoProposalSelected?.status} />
                  </Grid>
                  <Grid item>
                    <Badge status={daoProposalSelected.type} />
                  </Grid>
                  <Grid item>{/* TODO: @ashutoshpw FIX THIS <CommunityBadge id={"DAOID"} /> */}</Grid>
                  <Grid item direction="row" style={{ gap: 10 }}>
                    <TextContainer color="textPrimary" variant="body2" style={{ fontSize: 14, marginBottom: 4 }}>
                      Posted by:
                    </TextContainer>
                    <CreatorBadge address={daoProposalSelected?.author} />
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
      </GridContainer>
    </>
  )
}
