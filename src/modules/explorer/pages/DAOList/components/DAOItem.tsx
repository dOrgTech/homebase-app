import { styled, Grid, Theme, Typography, Link, useTheme, useMediaQuery } from "@material-ui/core"
import { createTheme } from "@material-ui/core/styles"
import hexToRgba from "hex-to-rgba"
import { startCase } from "lodash"
import React from "react"
import { EnvKey, getEnv } from "services/config"

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
  "minHeight": 138,
  "wordBreak": "break-all",
  "borderRadius": 8,
  "boxSizing": "border-box",
  "padding": 32,
  "cursor": "pointer",
  "transition": "0.15s ease-out",

  ["@media (max-width:1335px)"]: {
    minHeight: 130
  },

  ["@media (max-width:1155px)"]: {
    minHeight: 123
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {
    minHeight: 210
  },

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

  ["@media (max-width:1335px)"]: {
    fontSize: "16px"
  }
})

const NameText = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  overflow: "hidden",
  fontSize: "32px",

  ["@media (max-width:1335px)"]: {
    fontSize: "29px"
  },

  ["@media (max-width:1155px)"]: {
    fontSize: "26px"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {
    fontSize: "28px",
    marginBottom: "10px",
    maxWidth: 245
  }
}))

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

const Badge = styled(Grid)(({ theme, dao_type }: { theme: Theme; dao_type: string }) => ({
  "borderRadius": 4,
  "height": "auto",
  "boxSizing": "border-box",
  "width": "fit-content",
  "textAlign": "center",
  "padding": "0 7px",
  "float": "right",
  "background":
    dao_type === "lambda" ? hexToRgba(theme.palette.secondary.main, 0.4) : hexToRgba(theme.palette.warning.main, 0.4),
  "color": dao_type === "lambda" ? theme.palette.secondary.main : theme.palette.warning.main,
  "& > div": {
    height: "100%"
  },
  "fontFamily": "Roboto Mono",
  "fontWeight": "bold"
}))

export const DAOItem: React.FC<{
  dao: {
    id: string
    name: string
    symbol: string
    votingAddresses: string[]
    dao_type: { name: string }
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

  return (
    <Link underline="none" href={daoHref}>
      <Container container justifyContent="space-between">
        <SectionNames>
          <Grid>
            <SymbolText color="secondary">{dao?.symbol?.toUpperCase()}</SymbolText>
            <NameText color="textPrimary">{dao.name}</NameText>
          </Grid>
        </SectionNames>
        <Grid>
          <Grid item xs={12} sm>
            {daoType === "lambda" ? <Badge dao_type={daoType}>V3</Badge> : null}
            {daoType === "registry" || daoType === "treasury" ? <Badge dao_type={daoType}>V2</Badge> : null}
            {daoType === "lite" ? <Badge dao_type={daoType}>Lite</Badge> : null}

            <NumberText color="textPrimary">{dao.votingAddresses.length}</NumberText>
            <VotingAddressesText color="textPrimary">Voting Addresses</VotingAddressesText>
          </Grid>
        </Grid>
      </Container>
    </Link>
  )
}
