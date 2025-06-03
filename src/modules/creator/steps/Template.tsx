import React, { useContext, useEffect, useState } from "react"
import { Grid, styled, Typography, Box, useMediaQuery, useTheme, makeStyles, Tooltip } from "@material-ui/core"
import { useHistory } from "react-router"

import LiteIcon from "assets/img/lite-dao.svg?react"
import FullIcon from "assets/img/full-dao.svg?react"

import { ActionTypes, CreatorContext, DAOTemplate } from "modules/creator/state"
import { TitleBlock } from "modules/common/TitleBlock"
import { useRouteMatch } from "react-router-dom"
import { useTezos } from "services/beacon/hooks/useTezos"

const LambdaCustomBox = styled(Grid)(({ theme }) => ({
  "height": 273,
  "marginTop": 30,
  "background": "#2F3438",
  "borderRadius": 8,
  "maxWidth": 342,
  "width": "-webkit-fill-available",

  "textAlign": "start",
  "cursor": "pointer",
  "paddingBottom": 0,
  "flexBasis": "47%",
  "padding": "33px 38px 0px",
  "&:hover": {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "30px 35px 0px"
  },
  ["@media (max-width:1167px)"]: {
    marginBottom: 20,
    marginTop: 0
  }
}))

const LambdaCustomBoxFullDao = ({ style, update, isMobileSmall, isEtherLink, selectedTemplate }: any) => (
  <LambdaCustomBox
    item
    container
    direction="column"
    justifyContent="flex-start"
    alignItems="center"
    xs={isMobileSmall ? 12 : 5}
    onClick={() => {
      if (isEtherLink) return
      update("lambda")
    }}
    title={"Hello World"}
    className={selectedTemplate === "lambda" ? style.selected : ""}
    style={{ opacity: isEtherLink ? 0.4 : 1 }}
  >
    <FullIcon style={{ marginBottom: 16 }} />
    <BoxTitle color="textSecondary">Full DAO</BoxTitle>
    <BoxDescription color="textSecondary">Contract interaction. Transfer assets based on vote outcomes.</BoxDescription>
  </LambdaCustomBox>
)

const styles = makeStyles({
  selected: {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    paddingBottom: 0,
    padding: "30px 35px 0px"
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
  fontWeight: 600,
  fontFamily: "Roboto Flex",
  marginBottom: 10
})

const BoxDescription = styled(Typography)({
  fontWeight: 300,
  fontSize: 18,
  lineHeight: "160%",
  alignSelf: "stretch"
})

export const Template = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext)
  const { template } = state.data

  const history = useHistory()

  const match = useRouteMatch()

  const theme = useTheme()
  const style = styles()
  const { network } = useTezos()
  const isEtherLink = network?.startsWith("etherlink")

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const [selectedTemplate, setTemplate] = useState<DAOTemplate>(template)
  const [error, setError] = useState<boolean>(false)

  console.log({ selectedTemplate })

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

  useEffect(() => {
    if (isEtherLink && selectedTemplate === "lambda") setTemplate("lite")
  }, [isEtherLink, selectedTemplate])

  const update = (templateValue: DAOTemplate) => {
    setError(false)
    setTemplate(templateValue)
  }

  return (
    <Box>
      <TitleBlock title={"DAO Creator"} description={"Create an organization by picking a template below."} />
      <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} direction="row">
        {isEtherLink ? (
          <Tooltip title="Full DAO is available on Tezos Networks">
            <LambdaCustomBoxFullDao
              style={style}
              update={update}
              isMobileSmall={isMobileSmall}
              isEtherLink={isEtherLink}
              selectedTemplate={selectedTemplate}
            />
          </Tooltip>
        ) : (
          <LambdaCustomBoxFullDao
            style={style}
            update={update}
            isMobileSmall={isMobileSmall}
            isEtherLink={isEtherLink}
            selectedTemplate={selectedTemplate}
          />
        )}{" "}
        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 5}
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
