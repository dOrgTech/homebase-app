import React, { useState } from "react"
import { Grid, Typography, Box, useMediaQuery, useTheme } from "components/ui"

import { ReactComponent as LiteIcon } from "assets/img/lite-dao.svg"
import { ReactComponent as FullIcon } from "assets/img/full-dao.svg"

import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

// Styled components replaced with inline styles

type DaoTemplate = "full" | "lite"

export const EvmDaoTemplate = (): JSX.Element => {
  const theme = useTheme()
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
      <Grid
        container
        justifyContent={isMobileSmall ? "center" : "space-between"}
        direction="row"
        spacing={isMobileSmall ? 2 : 0}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={12}
          sm={12}
          md={5}
          onClick={() => handleTemplateSelect("full")}
          style={{
            height: 273,
            marginTop: 30,
            background: "#1c2024",
            borderRadius: 8,
            maxWidth: isMobileSmall ? "100%" : 342,
            width: isMobileSmall ? "100%" : "-webkit-fill-available",
            textAlign: "start",
            cursor: "pointer",
            paddingBottom: 0,
            padding: "33px 38px 0px",
            border: selectedTemplate === "full" ? "3px solid rgba(129, 254, 183, 0.4)" : undefined
          }}
        >
          <FullIcon style={{ marginBottom: 16 }} />
          <Typography
            color="textSecondary"
            style={{ fontSize: 18, fontWeight: 600, fontFamily: "Roboto Flex", marginBottom: 10 }}
          >
            Full DAO
          </Typography>
          <Typography
            color="textSecondary"
            style={{ fontWeight: 300, fontSize: 18, lineHeight: "160%", alignSelf: "stretch" }}
          >
            Contract interaction. Transfer assets based on vote outcomes.
          </Typography>
        </Grid>

        <Grid
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={12}
          sm={12}
          md={5}
          onClick={() => handleTemplateSelect("lite")}
          style={{
            height: 273,
            marginTop: 30,
            background: "#1c2024",
            borderRadius: 8,
            maxWidth: isMobileSmall ? "100%" : 342,
            width: isMobileSmall ? "100%" : "-webkit-fill-available",
            textAlign: "start",
            cursor: "pointer",
            paddingBottom: 0,
            padding: "33px 38px 0px",
            border: selectedTemplate === "lite" ? "3px solid rgba(129, 254, 183, 0.4)" : undefined
          }}
        >
          <LiteIcon style={{ marginBottom: 16 }} />
          <Typography
            color="textSecondary"
            style={{ fontSize: 18, fontWeight: 600, fontFamily: "Roboto Flex", marginBottom: 10 }}
          >
            Lite DAO
          </Typography>
          <Typography
            color="textSecondary"
            style={{ fontWeight: 300, fontSize: 18, lineHeight: "160%", alignSelf: "stretch" }}
          >
            Off-chain weighted voting. Multiple voting strategies. No treasury.
          </Typography>
        </Grid>
      </Grid>
      {error && (
        <Typography style={{ display: "block", fontSize: 14, color: "red", marginTop: 8 }}>
          Must select a template in order to continue
        </Typography>
      )}
    </Box>
  )
}
