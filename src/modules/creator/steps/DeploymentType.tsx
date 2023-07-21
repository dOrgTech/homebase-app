import React, { useContext, useEffect, useState } from "react"
import { Grid, styled, Typography, Box, useMediaQuery, useTheme, makeStyles, Link } from "@material-ui/core"
import { useHistory } from "react-router"

import { ReactComponent as ManagedIcon } from "assets/img/managed.svg"
import { ReactComponent as SelfDeployedIcon } from "assets/img/self-deployed.svg"

import { ActionTypes, CreatorContext, DeploymentMethod } from "modules/creator/state"
import { TitleBlock } from "modules/common/TitleBlock"
import { useRouteMatch } from "react-router-dom"

const LambdaCustomBox = styled(Grid)(({ theme }) => ({
  "height": 480,
  "marginTop": 30,
  "background": "#2F3438",
  "borderRadius": 8,
  "maxWidth": 320,
  "width": "-webkit-fill-available",
  "padding": "40px 44px",
  "textAlign": "start",
  "cursor": "pointer",
  "paddingBottom": 0,
  "&:hover": {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    paddingTop: 37,
    paddingBottom: 0,
    paddingRight: 41,
    paddingLeft: 41
  },
  ["@media (max-width:1167px)"]: {
    marginBottom: 20,
    marginTop: 20
  }
}))

const styles = makeStyles({
  selected: {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 41px"
  }
})

const BoxTitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  fontFamily: "Roboto Mono",
  marginBottom: 10
})

const BoxDescription = styled(Typography)({
  fontWeight: 300,
  fontSize: 16
})

export const DeploymentType = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext)
  const { template } = state.data

  const history = useHistory()

  const match = useRouteMatch()

  const theme = useTheme()
  const style = styles()

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const [selectedTemplate, setTemplate] = useState<DeploymentMethod>("managed")
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          history.push(`review`, { method: selectedTemplate })
        },
        text: "Deploy DAO"
      },
      back: {
        text: "Back",
        handler: () => history.push(`summary`)
      }
    })
  }, [dispatch, history, match.path, match.url, selectedTemplate])

  const update = (templateValue: DeploymentMethod) => {
    setError(false)
    setTemplate(templateValue)
  }

  return (
    <Box>
      <TitleBlock
        title={"Choose Deployment Type"}
        description={
          <Typography variant="subtitle1" color="textSecondary">
            Learn more about the two available deployment options in{" "}
            <Link
              target="_blank"
              href="https://faq.tezos-homebase.io/homebase-faq/how-to-configure-your-dao-in-homebase/deployment-type"
              color="secondary"
            >
              this article
            </Link>{" "}
          </Typography>
        }
      />
      <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} direction="row">
        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("managed")}
          className={selectedTemplate === "managed" ? style.selected : ""}
        >
          <ManagedIcon style={{ marginBottom: 14 }} />
          <BoxTitle color="textSecondary">Managed</BoxTitle>
          <Grid container direction="column" style={{ gap: 16 }}>
            <BoxDescription color="textSecondary">
              Homebase will deploy a contract on-chain with your parameters using a dedicated endpoint.{" "}
            </BoxDescription>
            <BoxDescription color="textSecondary">
              Requires upfront payment for the transaction fees (7 XTZ).{" "}
            </BoxDescription>
            <BoxDescription color="textSecondary">Takes between 3 and 5 minutes. </BoxDescription>
          </Grid>
        </LambdaCustomBox>{" "}
        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("self-deployed")}
          className={selectedTemplate === "self-deployed" ? style.selected : ""}
        >
          <SelfDeployedIcon style={{ marginBottom: 14 }} />
          <BoxTitle color="textSecondary">Self-Deployed</BoxTitle>
          <Grid container direction="column" style={{ gap: 16 }}>
            <BoxDescription color="textSecondary">Use your private key to sign four transactions. </BoxDescription>
            <BoxDescription color="textSecondary">
              May need multiple tries as bytecode can get stuck between app and wallet. If it’s not working, please use
              the managed option.
            </BoxDescription>
            <BoxDescription color="textSecondary">Can take up to 15 minutes. </BoxDescription>
          </Grid>
        </LambdaCustomBox>{" "}
      </Grid>
    </Box>
  )
}
