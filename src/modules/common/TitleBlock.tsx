import { Grid, Link, Paper, styled, Tooltip, Typography } from "@material-ui/core"
import React from "react"
import { ReactElement } from "react-markdown/lib/react-markdown"
import { InfoRounded } from "@material-ui/icons"

const DescriptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.dark
}))

const StyledGrid = styled(Grid)({
  height: "fit-content",
  borderRadius: 8,
  padding: "0",
  gap: 16
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
  fontSize: 18,
  marginLeft: 2,
  fontWeight: 200
})

const CustomTextContainer = styled(Paper)(({ theme }) => ({
  maxWidth: "fit-content",
  background: "inherit",
  boxShadow: "none",
  display: "flex",
  alignItems: "center",
  marginRight: 24,
  [theme.breakpoints.down("sm")]: {
    alignItems: "baseline"
  }
}))

interface Props {
  title?: ReactElement | string
  description: ReactElement | string
  tooltip?: boolean
  tooltipText?: string
  tooltipLink?: string
}

export const TitleBlock: React.FC<Props> = ({
  title = "",
  description,
  tooltip = false,
  tooltipText = "",
  tooltipLink = ""
}) => {
  return (
    <StyledGrid container direction="row" justifyContent="space-between">
      <Grid item xs={12} container direction="row" alignItems="baseline">
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
            <Link target="_blank" href={`https://faq.tezos-homebase.io/homebase-faq/${tooltipLink}`} color="secondary">
              <CustomTooltipText color="secondary">{tooltipText} </CustomTooltipText>
            </Link>
          </CustomTextContainer>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        {title === "" ? (
          <DescriptionText variant="subtitle1"> {description}</DescriptionText>
        ) : description ? (
          <DescriptionText variant="subtitle1">{description}</DescriptionText>
        ) : null}
      </Grid>
      <Grid item xs={12}></Grid>
    </StyledGrid>
  )
}
