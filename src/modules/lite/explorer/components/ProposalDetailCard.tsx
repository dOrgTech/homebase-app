import React from "react"
import { Grid, styled, Typography, Link, useTheme, useMediaQuery, Popover, withStyles } from "@material-ui/core"
import { GridContainer } from "modules/common/GridContainer"
import { ProposalStatus, TableStatusBadge } from "./ProposalTableRowStatusBadge"
import { CreatorBadge } from "./CreatorBadge"
import { FileCopyOutlined } from "@material-ui/icons"
import { Poll } from "models/Polls"
import dayjs from "dayjs"
import LinkIcon from "assets/img/link.svg"

import { useNotification } from "modules/common/hooks/useNotification"
import parse from "html-react-parser"

const Title = styled(Typography)({
  fontSize: 32,
  fontWeight: 600
})

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%" /* 28.8px */,
  color: theme.palette.primary.light
}))

const DescriptionContainer = styled("div")(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  color: theme.palette.text.secondary,
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    marginTop: 16,
    marginBottom: 8
  },
  "& p": {
    marginTop: 8,
    marginBottom: 8
  },
  "& ul, & ol": {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 24
  },
  "& hr": {
    marginTop: 16,
    marginBottom: 16,
    border: "none",
    borderTop: `1px solid ${theme.palette.primary.light}`
  }
}))

const LogoItem = styled("img")(({ theme }) => ({
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: 10
  }
}))

const TextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  color: theme.palette.primary.light,
  alignItems: "center",
  gap: 10,
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%" /* 28.8px */,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndTextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%" /* 28.8px */,
  color: theme.palette.primary.light,
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%" /* 28.8px */,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const Divider = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%" /* 28.8px */,
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

const LinearContainer = styled(GridContainer)({
  background: "inherit !important",
  backgroundColor: "inherit !important",
  padding: "0px 0px 24px 0px"
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

const DescriptionContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.secondary.light,
  padding: "40px 48px 42px 48px",
  borderRadius: 8,
  marginTop: 20,
  gap: 32
}))

const DescriptionText = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

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
      <LinearContainer container style={{ gap: 50 }}>
        <Grid container style={{ gap: 20 }}>
          <Grid
            item
            container
            alignItems="flex-end"
            direction="row"
            style={{ gap: isMobileSmall ? 25 : 0 }}
            justifyContent={isMobileSmall ? "center" : "space-between"}
          >
            <Grid item>
              <Title color="textPrimary">{poll?.name}</Title>
            </Grid>
          </Grid>

          <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} alignItems={"center"}>
            <Grid item>
              <Grid
                container
                style={{ gap: 10 }}
                alignItems="center"
                justifyContent={isMobileSmall ? "center" : "flex-start"}
              >
                <Grid item>
                  <Subtitle>Off-Chain Proposal • Created by</Subtitle>
                </Grid>
                <Grid item>
                  <CreatorBadge address={poll?.author} />
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
                  <TableStatusBadge status={poll?.isActive || ProposalStatus.ACTIVE} />
                </Grid>
                <Grid item>
                  <Grid item container direction="row" spacing={2} alignItems="center">
                    <TextContainer variant="body2">Created</TextContainer>
                    <EndText variant="body2">{dayjs(Number(poll?.startTime)).format("LL")}</EndText>
                    <Divider>•</Divider>
                    <EndTextContainer variant="body2">
                      {poll?.isActive === "closed" ? "Closed" : "End date"}{" "}
                    </EndTextContainer>
                    <EndText variant="body2">{dayjs(Number(poll?.endTime)).format("ll")}</EndText>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <DescriptionContainer className="proposal-details">
              {parse(poll?.description ? poll?.description : "")}
            </DescriptionContainer>
          </Grid>

          {poll?.externalLink ? (
            <Grid style={{ display: isMobileSmall ? "block" : "flex" }} container alignItems="center">
              <LogoItem src={LinkIcon} />
              <StyledLink color="secondary" href={poll?.externalLink} target="_">
                {poll?.externalLink}
              </StyledLink>
            </Grid>
          ) : null}
        </Grid>
      </LinearContainer>
    </>
  )
}
