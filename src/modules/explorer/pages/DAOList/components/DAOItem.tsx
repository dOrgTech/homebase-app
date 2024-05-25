import { styled, Grid, Theme, Typography, Link, useTheme, useMediaQuery } from "@material-ui/core"
import React from "react"
import { EnvKey, getEnv } from "services/config"
import ReactHtmlParser from "react-html-parser"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import BigNumber from "bignumber.js"

const Container = styled(Grid)(({ theme }: { theme: Theme }) => ({
  "background": theme.palette.primary.main,
  "minHeight": 282,
  "wordBreak": "break-all",
  "borderRadius": 8,
  "boxSizing": "border-box",
  "cursor": "pointer",
  "transition": "0.15s ease-out",
  "padding": "40px 48px",
  "minWidth": "340px",
  "alignContent": "baseline",
  "gap": 24,
  // "maxHeight": 282,

  ["@media (max-width:760px)"]: {
    maxWidth: "86vw",
    padding: "17px 24px",
    minWidth: "inherit"
  },

  ["@media only screen and (max-device-width: 768px)"]: {
    maxWidth: "86vw",
    padding: "17px 24px",
    minWidth: "320px"
  },

  "&:hover": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  },

  "& > *": {
    transform: "scale(1.000001)"
  }
}))

const SymbolText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontSize: "24px",
  fontWeight: 300,
  color: "#bfc5ca",
  lineHeight: "normal",
  marginTop: 8,

  [theme.breakpoints.down("md")]: {
    fontSize: 18
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: 18,
    marginLeft: "0%"
  }
}))

const NameText = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  overflow: "hidden",
  fontSize: 24,
  maxWidth: 245,
  fontWeight: 600,

  ["@media (max-width:960px)"]: {
    fontSize: "28px",
    marginBottom: "10px",
    maxWidth: 245
  }
}))

const DescriptionText = styled(Typography)({
  "color": "#bfc5ca",
  "overflow": "hidden",
  "height": 54,
  "textOverflow": "ellipsis",
  "fontSize": 18,
  "fontWeight": 300,
  "display": "-webkit-box",
  "-webkit-line-clamp": 2 /* number of lines to show */,
  "line-clamp": 2,
  "-webkit-box-orient": "vertical",
  "maxHeight": 60
})

const ItemTextSmall = styled(Typography)({
  fontWeight: 500,
  fontSize: 16
})

const Badge = styled(Grid)(({ theme, dao_type }: { theme: Theme; dao_type: string }) => ({
  "borderRadius": "50px",
  "padding": "7px 14px",
  "height": "auto",
  "boxSizing": "border-box",
  "width": "fit-content",
  "textAlign": "center",
  "float": "right",
  "background": "#2d433c",
  "color": theme.palette.secondary.main,
  "& > div": {
    height: "100%"
  },
  "fontFamily": "Roboto Flex",
  "fontWeight": 500
}))

export const DAOItem: React.FC<{
  dao: {
    id: string
    name: string
    symbol: string
    votingAddresses: string[]
    dao_type: { name: string }
    votingAddressesCount: number
    description: string
  }
}> = ({ dao }) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoType = dao.dao_type.name
  const daoHref =
    daoType !== "lambda" && daoType !== "lite"
      ? `${getEnv(EnvKey.REACT_APP_V2_URL)}/explorer/dao/${dao.id}`
      : daoType === "lambda"
      ? `dao/${dao.id}`
      : `lite/dao/${dao.id}`

  return (
    <Link underline="none" href={daoHref}>
      <Container container justifyContent="space-between">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={7} md={9}>
            <NameText color="textPrimary">{dao.name}</NameText>
          </Grid>
          <Grid item>
            {daoType === "lambda" ? <Badge dao_type={daoType}>V3</Badge> : null}
            {daoType === "registry" || daoType === "treasury" ? <Badge dao_type={daoType}>V2</Badge> : null}
            {daoType === "lite" ? <Badge dao_type={daoType}>Lite</Badge> : null}
          </Grid>
        </Grid>
        <Grid container direction="row">
          <DescriptionText>{ReactHtmlParser(dao.description)}</DescriptionText>
        </Grid>
        <Grid container direction="row" justifyContent="space-between">
          <Grid xs={6} container item direction="column">
            <ItemTextSmall color="textPrimary">DAO {"\n"}Token</ItemTextSmall>
            <SymbolText>{dao?.symbol?.toUpperCase()}</SymbolText>
          </Grid>
          <Grid xs={6} container item direction="column">
            <ItemTextSmall color="textPrimary">Voting Addresses</ItemTextSmall>
            <SymbolText>{formatNumber(new BigNumber(dao.votingAddressesCount))}</SymbolText>
          </Grid>
        </Grid>
      </Container>
    </Link>
  )
}
