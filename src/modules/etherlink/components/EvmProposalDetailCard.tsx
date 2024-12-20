import React, { useContext } from "react"
import { Grid, styled, Typography, Link, useTheme, useMediaQuery, Popover, withStyles } from "@material-ui/core"
import { GridContainer } from "modules/common/GridContainer"
import { ProposalStatus, TableStatusBadge } from "modules/lite/explorer/components/ProposalTableRowStatusBadge"
import { CreatorBadge } from "modules/lite/explorer/components/CreatorBadge"
import { FileCopyOutlined } from "@material-ui/icons"
import Share from "assets/img/share.svg"
import { CommunityBadge } from "modules/lite/explorer/components/CommunityBadge"
import LinkIcon from "assets/img/link.svg"
import { Poll } from "models/Polls"
import dayjs from "dayjs"
import { useNotification } from "modules/common/hooks/useNotification"
import ReactHtmlParser from "react-html-parser"
import { EtherlinkContext } from "services/wagmi/context"
import { Badge } from "components/ui/Badge"
import { StatusBadge } from "modules/explorer/components/StatusBadge"

const LogoItem = styled("img")(({ theme }) => ({
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: 10
  }
}))

const TextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndTextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const Divider = styled(Typography)(({ theme }) => ({
  marginLeft: 8,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const StyledLink = styled(Link)(({ theme }) => ({
  fontFamily: "Roboto Flex",
  fontWeight: 300,
  fontSize: 16,
  marginLeft: 8,
  [theme.breakpoints.down("sm")]: {
    fontWeight: 100,
    fontSize: 10
  }
}))

const CopyIcon = styled(FileCopyOutlined)({
  marginRight: 8,
  cursor: "pointer"
})

const CustomPopover = withStyles({
  paper: {
    "marginTop": 10,
    "padding": 8,
    "cursor": "pointer",
    "background": "#1c1f23 !important",
    "&:hover": {
      background: "#81feb76b !important"
    }
  }
})(Popover)

export const EvmProposalDetailCard: React.FC<{ poll: Poll | undefined }> = ({ poll }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { daoProposalSelected } = useContext(EtherlinkContext)
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

          <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} alignItems={"center"}>
            <Grid item>
              <Grid
                container
                style={{ gap: 23 }}
                alignItems="center"
                justifyContent={isMobileSmall ? "center" : "flex-start"}
              >
                <Grid item>
                  <StatusBadge status={daoProposalSelected?.status || ""} />
                  {/* <TableStatusBadge status={poll?.isActive || ProposalStatus.ACTIVE} /> */}
                </Grid>
                <Grid item>
                  <Badge status={daoProposalSelected?.type} />
                </Grid>
                <Grid item>{/* <CommunityBadge id={"DAOID"} /> */}</Grid>
                <Grid item direction="row" style={{ gap: 10 }}>
                  <TextContainer color="textPrimary" variant="body2" style={{ fontSize: 14, marginBottom: 4 }}>
                    Posted by:
                  </TextContainer>
                  <CreatorBadge address={daoProposalSelected?.author} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item container direction="row" alignItems="center">
              <TextContainer color="textPrimary" variant="body2">
                Start date:{" "}
              </TextContainer>
              <EndText variant="body2" color="textPrimary" style={{ fontWeight: 600, borderBottom: "1px solid white" }}>
                {dayjs(Number(daoProposalSelected?.createdAt?.seconds)).format("lll")}
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
