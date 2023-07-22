import React, { useContext, useEffect, useState } from "react"
import { Grid, styled, Typography, Box, useMediaQuery, useTheme, makeStyles } from "@material-ui/core"
import { useHistory } from "react-router"

import { ReactComponent as LiteIcon } from "assets/img/lite-dao.svg"
import { ReactComponent as FullIcon } from "assets/img/full-dao.svg"

import { ActionTypes, CreatorContext, DAOTemplate } from "modules/creator/state"
import { TitleBlock } from "modules/common/TitleBlock"
import { useRouteMatch } from "react-router-dom"

const LambdaCustomBox = styled(Grid)(({ theme }) => ({
  "height": 273,
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
    marginTop: 0
  }
}))

const styles = makeStyles({
  selected: {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 41px"
  }
})

const ErrorText = styled(Typography)({
  display: "block",
  fontSize: 14,
  color: "red",
  marginTop: 8
})

const BoxTitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  fontFamily: "Roboto Mono",
  marginBottom: 10
})

const BoxDescription = styled(Typography)({
  fontWeight: 300,
  fontSize: 16,
  lineHeight: "135%",
  letterSpacing: -0.18,
  alignSelf: "stretch"
})

export const Template = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext)
  const { template } = state.data

  const history = useHistory()

  const match = useRouteMatch()

  const theme = useTheme()
  const style = styles()

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const [selectedTemplate, setTemplate] = useState<DAOTemplate>(template)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          if (!selectedTemplate) {
            return setError(true)
          }
          dispatch({
            type: ActionTypes.UPDATE_TEMPLATE,
            template: selectedTemplate
          })

          if (selectedTemplate === "lambda") {
            return history.push(`dao`)
          }
          return history.push("/lite")
        },
        text: "Continue"
      },
      back: {
        text: "Back",
        handler: () => history.push("/creator/ownership")
      }
    })
  }, [dispatch, history, match.path, match.url, selectedTemplate])

  const update = (templateValue: DAOTemplate) => {
    setError(false)
    setTemplate(templateValue)
  }

  return (
    <Box>
      <TitleBlock title={"DAO Creator"} description={"Create an organization by picking a template below."} />
      <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} direction="row">
        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("lambda")}
          className={selectedTemplate === "lambda" ? style.selected : ""}
        >
          <FullIcon style={{ marginBottom: 16 }} />
          <BoxTitle color="textSecondary">Full DAO</BoxTitle>
          <BoxDescription color="textSecondary">
            Contract interaction. Transfer assets based on vote outcomes.
          </BoxDescription>
        </LambdaCustomBox>{" "}
        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("lite")}
          className={selectedTemplate === "lite" ? style.selected : ""}
        >
          <LiteIcon style={{ marginBottom: 16 }} />
          <BoxTitle color="textSecondary">Lite DAO</BoxTitle>
          <BoxDescription color="textSecondary">
            Off-chain weighted voting. Multiple voting strategies. No treasury.{" "}
          </BoxDescription>
        </LambdaCustomBox>{" "}
      </Grid>
      {error ? <ErrorText>{"Must select a template in order to continue"}</ErrorText> : null}
    </Box>
  )
}
