import React, { useState } from "react"
import { Grid, styled, Typography, Box, useMediaQuery, useTheme, makeStyles } from "@material-ui/core"

import { ReactComponent as LiteIcon } from "assets/img/lite-dao.svg"
import { ReactComponent as FullIcon } from "assets/img/full-dao.svg"

import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

const LambdaCustomBox = styled(Grid)(() => ({
  "height": 273,
  "marginTop": 30,
  "background": "#1c2024",
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

type DaoTemplate = "full" | "lite"

export const EvmDaoTemplate = (): JSX.Element => {
  const theme = useTheme()
  const style = styles()
  const { data: daoData, setFieldValue } = useEvmDaoCreateStore()
  const selectedTemplate = daoData.template
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const [error, setError] = useState<boolean>(false)

  const handleTemplateSelect = (template: DaoTemplate) => {
    setError(false)
    setFieldValue("template", template)
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
          xs={isMobileSmall ? 12 : 5}
          onClick={() => handleTemplateSelect("full")}
          className={selectedTemplate === "full" ? style.selected : ""}
        >
          <FullIcon style={{ marginBottom: 16 }} />
          <BoxTitle color="textSecondary">Full DAO</BoxTitle>
          <BoxDescription color="textSecondary">
            Contract interaction. Transfer assets based on vote outcomes.
          </BoxDescription>
        </LambdaCustomBox>

        <LambdaCustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 5}
          onClick={() => handleTemplateSelect("lite")}
          className={selectedTemplate === "lite" ? style.selected : ""}
        >
          <LiteIcon style={{ marginBottom: 16 }} />
          <BoxTitle color="textSecondary">Lite DAO</BoxTitle>
          <BoxDescription color="textSecondary">
            Off-chain weighted voting. Multiple voting strategies. No treasury.
          </BoxDescription>
        </LambdaCustomBox>
      </Grid>
      {error && <ErrorText>Must select a template in order to continue</ErrorText>}
    </Box>
  )
}
