import React from "react"
import { Grid, styled, Typography, Link, useTheme, useMediaQuery, Popover, withStyles } from "@material-ui/core"
import { GridContainer } from "modules/common/GridContainer"
import { ProposalStatus, TableStatusBadge } from "./ProposalTableRowStatusBadge"
import { CreatorBadge } from "./CreatorBadge"
import { FileCopyOutlined, MoreHoriz, ShareOutlined } from "@material-ui/icons"
import Share from "assets/img/share.svg"
import { CommunityBadge } from "./CommunityBadge"
import LinkIcon from "assets/img/link.svg"
import { Poll } from "models/Polls"
import dayjs from "dayjs"
import { useNotification } from "modules/common/hooks/useNotification"

const LogoItem = styled("img")({
  height: 18,
  cursor: "pointer"
})

const TextContainer = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8
})

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

const StyledLink = styled(Link)({
  fontFamily: "Roboto Mono",
  fontWeight: 300,
  fontSize: 16,
  marginLeft: 8
})

const CopyIcon = styled(FileCopyOutlined)({
  marginRight: 8,
  cursor: "pointer"
})

const CustomPopover = withStyles({
  paper: {
    "marginTop": 10,
    "padding": 8,
    "cursor": "pointer",
    "&:hover": {
      background: "#81feb76b !important"
    }
  }
})(Popover)

export const ProposalDetailCard: React.FC<{ poll: Poll | undefined; daoId: string }> = ({ poll, daoId }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
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
      {poll && poll !== undefined ? (
        <GridContainer container style={{ gap: 50 }}>
          <Grid container style={{ gap: 25 }}>
            <Grid
              item
              container
              alignItems="flex-end"
              direction="row"
              style={{ gap: isMobileSmall ? 25 : 0 }}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h1" color="textPrimary">
                  {poll?.name}
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

            <Grid container justifyContent={"space-between"} alignItems={"center"}>
              <Grid item>
                <Grid container justifyContent={isMobileSmall ? "space-evenly" : "flex-start"} style={{ gap: 23 }}>
                  <Grid item>
                    <TableStatusBadge status={poll?.isActive || ProposalStatus.ACTIVE} />
                  </Grid>
                  <Grid item>
                    <CommunityBadge id={daoId} />
                  </Grid>
                  <Grid item>
                    <CreatorBadge address={poll?.author} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item container direction="row" spacing={2} alignItems="center">
                <TextContainer color="textPrimary" variant="body1">
                  Start date:{" "}
                </TextContainer>
                <EndText variant="body2" color="textPrimary">
                  {" "}
                  {dayjs(Number(poll?.startTime)).format("lll")}
                </EndText>
                <Divider color="textPrimary">-</Divider>
                <EndTextContainer color="textPrimary" variant="body1">
                  {" "}
                  End date:{" "}
                </EndTextContainer>
                <EndText variant="body2" color="textPrimary">
                  {" "}
                  {dayjs(Number(poll?.endTime)).format("lll")}
                </EndText>
              </Grid>
            </Grid>

            <Grid container>
              <Typography variant="body2" color="textPrimary">
                {poll?.description}
              </Typography>
            </Grid>

            {poll?.externalLink ? (
              <Grid container alignItems="center">
                <LogoItem src={LinkIcon} />
                <StyledLink color="secondary" href="#">
                  {poll?.externalLink}
                </StyledLink>
              </Grid>
            ) : null}
          </Grid>
        </GridContainer>
      ) : (
        <Grid container direction="row">
          <Typography color="textPrimary">Could not load the requested proposal</Typography>
        </Grid>
      )}
    </>
  )
}
