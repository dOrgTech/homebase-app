import React from "react"
import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { RectangleContainer } from "./styled/RectangleHeader"
import { CopyAddress } from "modules/common/CopyAddress"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../pages/DAO/router"

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center"
}))

const CustomRectangleContainer = styled(RectangleContainer)(({ theme }) => ({
  borderBottom: "none",
  paddingBottom: "0",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 40
  }
}))

export const TemplateHeader: React.FC<{
  template: string
  showSendXtz?: boolean
}> = ({ template, children }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  return (
    <Grid item xs={12}>
      <CustomRectangleContainer container justifyContent="space-between">
        <Grid item xs={12}>
          <Container container direction={isMobileSmall ? "column" : "row"}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="secondary" align={isMobileSmall ? "center" : "left"}>
                {dao?.data.name}
              </Typography>
              <Typography
                variant="h5"
                color="textSecondary"
                align={isMobileSmall ? "center" : "left"}
                style={{ margin: isMobileSmall ? "15px 0 25px 0" : 0 }}
              >
                {template.charAt(0).toUpperCase() + template.slice(1, template.length)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} container justifyContent={isMobileSmall ? "center" : "flex-end"}>
              {children}
            </Grid>
          </Container>
          {dao && !isMobileSmall && (
            <CopyAddress address={dao.data.address} justifyContent={isMobileSmall ? "center" : "flex-start"} />
          )}
        </Grid>
      </CustomRectangleContainer>
    </Grid>
  )
}
