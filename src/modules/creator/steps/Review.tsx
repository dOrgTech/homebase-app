import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  Box,
  styled,
  Typography,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  withStyles,
  Theme,
  StepConnector,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Rocket from "assets/img/rocket.svg";
import { useOriginate } from "services/contracts/baseDAO/hooks/useOriginate";
import {
  getTokensInfo,
  CreatorContext,
  ActionTypes,
} from "modules/creator/state";
import { MetadataCarrierParameters } from "services/contracts/baseDAO/metadataCarrier/types";
import { MigrationParams } from "services/contracts/baseDAO/types";
import { useCreatorValidation } from "modules/creator/components/ProtectedRoute";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ConnectWalletButton } from "modules/common/Toolbar";

const RocketImg = styled("img")({
  marginBottom: 46,
});

const WaitingText = styled(Typography)({
  marginTop: 46,
  fontWeight: "bold",
  textAlign: "center",
  justifyContent: "center",
  marginBottom: 20,
  maxWidth: 650,
});

const CustomButton = styled(Button)({
  marginTop: 20,
});

const FullWidth = styled(Grid)({
  width: "100%",
});

const useStyles = makeStyles({
  firstDot: {
    animation: "$firstDot 2s linear infinite",
  },
  secondDot: {
    animation: "$secondDot 2s linear infinite",
  },
  threeDot: {
    animation: "$thirdDot 2s linear infinite",
  },
  "@keyframes firstDot": {
    "0%": {
      opacity: 1,
    },
    "65%": {
      opacity: 1,
    },
    "66%": {
      opacity: 0,
    },
    "100%": {
      opacity: 0,
    },
  },
  "@keyframes secondDot": {
    "0%": {
      opacity: 0,
    },
    "21%": {
      opacity: 0,
    },
    "22%": {
      opacity: 1,
    },
    "65%": {
      opacity: 1,
    },
    "66%": {
      opacity: 0,
    },
    "100%": {
      opacity: 0,
    },
  },
  "@keyframes thirdDot": {
    "0%": {
      opacity: 0,
    },
    "43%": {
      opacity: 0,
    },
    "44%": {
      opacity: 1,
    },
    "65%": {
      opacity: 1,
    },
    "66%": {
      opacity: 0,
    },
    "100%": {
      opacity: 0,
    },
  },
});

const StyledStepper = styled(Stepper)({
  width: "100%",
  paddingLeft: 0,
  paddingRight: 0,
  background: "inherit",
  "& .MuiStepConnector-alternativeLabel": {
    left: "calc(-50% + 19px)",
    right: "calc(50% + 19px)",
    top: 16,
    "& .MuiStepConnector-lineHorizontal": {
      borderColor: "#3D3D3D",
      borderTopWidth: 3,
    },
  },
});

const StyledLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root.MuiStepIcon-active": {
    fill: "none",
    borderColor: theme.palette.secondary.main,
    borderWidth: 3,
  },
  "& .MuiStepIcon-text": {
    fill: "none",
  },
  "& .MuiStepIcon-root": {
    borderWidth: 3,
  },
  "& .MuiStepIcon-completed": {
    color: `${theme.palette.secondary.main} !important`,
    borderColor: `${theme.palette.secondary.main} !important`,
    background: "#fff !important",
  },
}));

const ColorlibConnector = withStyles((theme: Theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main,
    },
  },
  completed: {
    "& $line": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#3d3d3d",
    borderRadius: 1,
  },
}))(StepConnector);

export const Review: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(CreatorContext);
  const info: MigrationParams = state.data;
  const { frozenToken, unfrozenToken } = getTokensInfo(info);
  const validDAOData = useCreatorValidation();
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState("");

  const { account, connect } = useTezos();

  const metadataCarrierParams: MetadataCarrierParameters = useMemo(
    () => ({
      keyName: "metadataKey",
      metadata: {
        frozenToken,
        unfrozenToken,
        description: info.orgSettings.description,
        authors: [info.memberSettings.administrator],
      },
    }),
    [
      frozenToken,
      info.memberSettings.administrator,
      info.orgSettings.description,
      unfrozenToken,
    ]
  );

  const {
    mutation: { mutate, error, data },
    stateUpdates: { states, current },
  } = useOriginate(state.data.template);
  const history = useHistory();

  useEffect(() => {
    if (current && current !== message) {
      setMessage(current);
      setActiveStep(activeStep + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Fix infinite calling here
  useEffect(() => {
    (async () => {
      if (!data && !validDAOData && metadataCarrierParams)
        mutate({
          metadataParams: metadataCarrierParams,
          params: info,
        });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.address) {
      dispatch({
        type: ActionTypes.CLEAR_CACHE,
      });
    }
  }, [data, dispatch]);

  return (
    <>
      <Box minWidth={620}>
        {account ? (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-start"
            style={{ height: "fit-content" }}
          >
            <Grid item>
              <RocketImg src={Rocket} alt="rocket" />
            </Grid>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Deploying <strong> {state.data.orgSettings.name} </strong> to
                the Tezos Network
              </Typography>
            </Grid>
            <FullWidth item xs={12}>
              {console.log("STATES: ", states)}
              {console.log("CURRENT: ", current)}

              {states.length > 0 ? (
                states.map((state, i) => (
                  <WaitingText
                    variant="subtitle1"
                    color="textSecondary"
                    key={`state-${i}`}
                  >
                    {state}
                  </WaitingText>
                ))
              ) : current || (true && !error) ? (
                <WaitingText variant="subtitle1" color="textSecondary">
                  {current || "text"}{" "}
                  <span className={classes.firstDot}>.</span>
                  <span className={classes.secondDot}>.</span>
                  <span className={classes.threeDot}>.</span>
                </WaitingText>
              ) : (
                error && (
                  <WaitingText variant="subtitle1" color="textSecondary">
                    {error}
                  </WaitingText>
                )
              )}

              <Box>
                {data && data.address ? (
                  <CustomButton
                    color="secondary"
                    variant="outlined"
                    onClick={() =>
                      history.push("/explorer/dao/" + data.address)
                    }
                  >
                    Go to my DAO
                  </CustomButton>
                ) : null}
              </Box>
            </FullWidth>
          </Grid>
        ) : (
          <ConnectWalletButton connect={connect} />
        )}
      </Box>

      {account ? (
        <Box maxWidth={900} minWidth={800} width={"inherit"} marginTop={"-15%"}>
          <FullWidth item container xs={12} direction="row">
            <StyledStepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
            >
              <Step key={0}>
                <StyledLabel>{""}</StyledLabel>
              </Step>
              <Step key={1}>
                <StyledLabel>{""}</StyledLabel>
              </Step>
              <Step key={2}>
                <StyledLabel>{""}</StyledLabel>
              </Step>
            </StyledStepper>
          </FullWidth>
        </Box>
      ) : null}
    </>
  );
};
