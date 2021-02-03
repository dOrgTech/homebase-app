import React from "react";
import { styled, Grid, Box, Typography, IconButton } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

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

const SupportText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    paddingLeft: 20,
    color: textColor,
  })
);

const ProgressText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    paddingLeft: 20,
    color: textColor,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    margin: "0px 20px",
    fontSize: 16,
    userSelect: "none",
    boxShadow: "none",
    background: "inherit",
    fontFamily: "Roboto Mono",
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
              <ProgressBar
                progress={support}
                radius={32}
                strokeWidth={4}
                strokeColor={progressColorMap[color]}
                trackStrokeWidth={2}
                trackStrokeColor={"#3d3d3d"}
              >
                <div className="indicator">
                  <ProgressText textColor={progressColorMap[color]}>
                    {support}%
                  </ProgressText>
                </div>
              </ProgressBar>
            </Grid>
            <Grid item>
              <SupportText textColor={progressColorMap[color]}>
                {color === "danger" ? "OPPOSE" : "SUPPORT"}
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
