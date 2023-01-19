import { Grid, Paper, styled, Tooltip, Typography } from "@material-ui/core"
import React from "react"
import { ReactElement } from "react-markdown/lib/react-markdown"
import { InfoRounded } from "@material-ui/icons"
import { HashLink } from "react-router-hash-link"
import { CopyButton } from "./CopyButton"

const StyledGrid = styled(Grid)({
  height: "fit-content",
  background: "#2F3438",
  borderRadius: 8,
  padding: "30px 40px",
  marginBottom: 38
})

const CustomTypography = styled(Typography)({
  marginTop: 27
})

const CustomTooltip = styled(Tooltip)({
  marginLeft: 8,
  ["@media (max-width:1167px)"]: {
    marginLeft: 0,
    marginTop: 8
  }
})

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16
}))

const CustomTooltipText = styled(Typography)({
  fontSize: 12,
  marginLeft: 2
})

const CustomTextContainer = styled(Paper)({
  maxWidth: "fit-content",
  background: "inherit",
  boxShadow: "none",
  display: "flex",
  alignItems: "center"
})

interface Props {
  title?: ReactElement | string
  description: ReactElement | string
  tooltip?: boolean
  tooltipText?: string
}

export const TitleBlock: React.FC<Props> = ({ title = "", description, tooltip = false, tooltipText = "" }) => {
  return (
    <StyledGrid container direction="row" justifyContent="space-between">
      <Grid item xs={12} container direction="row" alignItems="flex-end">
        <CustomTextContainer>
          <Typography variant="h3" color="textSecondary">
            {title}
          </Typography>
        </CustomTextContainer>
        {tooltip ? (
          <CustomTextContainer>
            <CustomTooltip placement="bottom" title={description}>
              <InfoIconInput />
            </CustomTooltip>
            <HashLink smooth to="/faq#how-to-create-a-dao-on-homebase" target={"_blank"}>
              <CustomTooltipText color="secondary">{tooltipText} </CustomTooltipText>
            </HashLink>
          </CustomTextContainer>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        {title === "" ? (
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            {description}
          </Typography>
        ) : (
          <CustomTypography variant="subtitle1" color="textSecondary">
            {description}
          </CustomTypography>
        )}
      </Grid>
      <Grid item xs={12}></Grid>
    </StyledGrid>
  )
}
