import { Grid, styled, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { InfoRounded } from "@material-ui/icons";

const StyledGrid = styled(Grid)({
  height: "fit-content",
  background: "#2F3438",
  borderRadius: 8,
  padding: "30px 40px",
  marginBottom: 38,
});

const CustomTypography = styled(Typography)({
  marginTop: 27,
});

const CustomTooltip = styled(Tooltip)({
  marginLeft: 8,
});

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 18,
  width: 18,
}));

const CustomTooltipText = styled(Typography)({
  fontSize: 12,
  marginLeft: 2,
});

interface Props {
  title?: ReactElement | string;
  description: ReactElement | string;
  tooltip?: boolean;
  tooltipText?: string;
}

export const TitleBlock: React.FC<Props> = ({
  title = "",
  description,
  tooltip = false,
  tooltipText = "",
}) => {
  return (
    <StyledGrid container direction="row" justify="space-between">
      <Grid item xs={12} container direction="row" alignItems="flex-end">
        <Typography variant="h3" color="textSecondary">
          {title}
        </Typography>
        {tooltip ? (
          <>
            <CustomTooltip placement="bottom" title={tooltipText}>
              <InfoIconInput />
            </CustomTooltip>
            <CustomTooltipText color="secondary">
              Configure Proposals and Voting{" "}
            </CustomTooltipText>
          </>
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
  );
};
