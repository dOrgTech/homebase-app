import React from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";

type ProgressColor = "success" | "warning" | "danger";

const progressColorMap = {
  success: "#81FEB7",
  warning: "#DBDE39",
  danger: "#DE3939",
};

const ProposalTableRowContainer = styled(Grid)({
  height: 155,
  borderBottom: "2px solid #3D3D3D",
  cursor: "pointer",
});

export interface ProposalTableRowData {
  title: string;
  number: number;
  date: string;
  cycle: number;
  support: number;
  color: ProgressColor;
}

const StyledProgress = styled(CircularProgress)(
  ({ circleColor }: { circleColor: string }) => ({
    height: 68,
    width: 68,
    "& .MuiCircularProgress-root": {
      background: "#3D3D3D",
    },
    "& .MuiCircularProgress-circle": {
      color: circleColor,
    },
  })
);

const SupportText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    paddingLeft: 20,
    color: textColor,
  })
);

const ArrowButton = styled(IconButton)({
  color: "#3D3D3D",
});

export const ProposalTableRow: React.FC<ProposalTableRowData> = ({
  title,
  number,
  date,
  cycle,
  support,
  color,
}) => {
  const history = useHistory();
  return (
    <ProposalTableRowContainer
      item
      container
      alignItems="center"
      onClick={() => history.push("/explorer/voting")}
    >
      <Grid item xs={5}>
        <Box>
          <Typography variant="body1" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="textSecondary">
            #{number} • {date}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" color="textSecondary">
          {cycle}
        </Typography>
      </Grid>
      <Grid item xs={5} container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <StyledProgress
                value={support}
                circleColor={progressColorMap[color]}
                variant="determinate"
              />
            </Grid>
            <Grid item>
              <SupportText textColor={progressColorMap[color]}>
                Support
              </SupportText>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ArrowButton>
            <ArrowForwardIcon fontSize={"large"} color="inherit" />
          </ArrowButton>
        </Grid>
      </Grid>
    </ProposalTableRowContainer>
  );
};
