import { styled, Grid, Theme, Typography, Link, useTheme, useMediaQuery } from "@material-ui/core"
import { createTheme } from "@material-ui/core/styles"
import hexToRgba from "hex-to-rgba"
import { startCase } from "lodash"
import React from "react"
import { EnvKey, getEnv } from "services/config"
import ReactHtmlParser from "react-html-parser"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

const SectionNames = styled(Grid)(({ theme }: { theme: Theme }) => ({
  width: "55%",

  ["@media (max-width:1030px)"]: {
    width: "50%"
  },

  ["@media (max-width:960px)"]: {
    width: "99%"
  }
}))

const Container = styled(Grid)(({ theme }: { theme: Theme }) => ({
  "background": theme.palette.primary.main,
  "minHeight": 282,
  "wordBreak": "break-all",
  "borderRadius": 8,
  "boxSizing": "border-box",
  "cursor": "pointer",
  "transition": "0.15s ease-out",
  "padding": "34px 48px",
  "minWidth": "340px",
  "alignContent": "baseline",
  "gap": 18,
  "maxHeight": 282,

  ["@media (max-width:760px)"]: {
    maxWidth: "86vw"
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

const SymbolText = styled(Typography)({
  fontSize: "18px",
  fontWeight: 300,
  color: "#bfc5ca",
  lineHeight: "normal",

  ["@media (max-width:1335px)"]: {
    fontSize: "16px"
  }
})

const NameText = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  overflow: "hidden",
  fontSize: 36,
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

const NumberText = styled(Typography)({
  fontSize: "28px",
  fontWeight: 300,

  ["@media (max-width:1335px)"]: {
    fontSize: "26px",
    lineHeight: 1.2,
    borderBottom: "7px solid transparent"
  },

  ["@media (max-width:1155px)"]: {
    fontSize: "23px",
    borderBottom: "9.5px solid transparent"
  },

  ["@media (max-width:960px)"]: {
    fontSize: "26px",
    borderBottom: "6px solid transparent"
  }
})

const VotingAddressesText = styled(Typography)({
  fontSize: "19px",
  fontWeight: 300,

  ["@media (max-width:1335px)"]: {
    fontSize: "17px"
  },

  ["@media (max-width:1155px)"]: {
    fontSize: "15.7px"
  },

  ["@media (max-width:960px)"]: {
    fontSize: "17px"
  }
})

const ItemText = styled(Typography)({
  fontWeight: 600,
  fontSize: 16,
  whiteSpace: "pre"
})

const Badge = styled(Grid)(({ theme, dao_type }: { theme: Theme; dao_type: string }) => ({
  "borderRadius": "50px",
  "padding": "8px 16px",
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
  "fontFamily": "Roboto Mono",
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
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const daoType = dao.dao_type.name
  const daoHref =
    daoType !== "lambda" && daoType !== "lite"
      ? `${getEnv(EnvKey.REACT_APP_V2_URL)}/explorer/dao/${dao.id}`
      : daoType === "lambda"
      ? `dao/${dao.id}`
      : `lite/dao/${dao.id}`

  const { data: activeProposals } = useProposals(dao.id, ProposalStatus.ACTIVE)

  return (
    <Link underline="none" href={daoHref}>
      <Container container justifyContent="space-between" alignItems="center">
        <Grid container direction="row" justifyContent="space-between">
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
          <Grid xs={3} container item direction="column">
            <ItemText color="textPrimary">DAO {"\n"}Token</ItemText>
            <SymbolText>{dao?.symbol?.toUpperCase()}</SymbolText>
          </Grid>
          <Grid xs={3} container item direction="column">
            <ItemText color="textPrimary">Voting {"\n"}Addresses</ItemText>{" "}
            <SymbolText>{dao.votingAddressesCount}</SymbolText>
          </Grid>
          <Grid xs={3} container item direction="column">
            <ItemText color="textPrimary">Active {"\n"}Proposals</ItemText> <SymbolText>{"-"}</SymbolText>
          </Grid>
        </Grid>
      </Container>
    </Link>
  )
}
