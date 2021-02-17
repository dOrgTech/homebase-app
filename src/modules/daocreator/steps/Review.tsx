import React, { useContext, useEffect, useMemo } from "react";
import {
  Button,
  Grid,
  Box,
  styled,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Rocket from "../../../assets/img/rocket.svg";
import { CreatorContext } from "../state/context";
import { useOriginateTreasury } from "../../../services/contracts/baseDAO/hooks/useOriginateTreasury";
import { fromStateToTreasuryStorage, getTokensInfo } from "../state/utils";
import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import { MigrationParams } from "../../../services/contracts/baseDAO/types";
import { ActionTypes } from "../state/types";

const RocketImg = styled("img")({
  marginBottom: 46,
});

const WaitingText = styled(Typography)({
  marginTop: 9,
  fontWeight: "bold",
});

const CustomButton = styled(Button)({
  marginTop: 20,
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

export const Review: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(CreatorContext);
  const info: MigrationParams = state.data;
  const { frozenToken, unfrozenToken } = getTokensInfo(info);

  const metadataCarrierParams: MetadataCarrierParameters = useMemo(
    () => ({
      keyName: info.orgSettings.name,
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
      info.orgSettings.name,
      unfrozenToken,
    ]
  );

  const {
    mutation: { mutate, error, data },
    stateUpdates: { states, current },
  } = useOriginateTreasury();
  const history = useHistory();

  //TODO: Fix infinite calling here
  useEffect(() => {
    (async () => {
      if (!data && info && metadataCarrierParams)
        mutate({
          metadataParams: metadataCarrierParams,
          treasuryParams: fromStateToTreasuryStorage(info),
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
    <Box maxWidth={650}>
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
            Deploying <strong> {state.data.orgSettings.name} </strong> to the
            Tezos Network
          </Typography>
        </Grid>
        <Grid item>
          {states.map((state, i) => (
            <WaitingText
              variant="subtitle1"
              color="textSecondary"
              key={`state-${i}`}
            >
              {state}
            </WaitingText>
          ))}
          {current && !error ? (
            <WaitingText variant="subtitle1" color="textSecondary">
              {current} <span className={classes.firstDot}>.</span>
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
                onClick={() => history.push("/explorer/dao/" + data.address)}
              >
                Go to my DAO
              </CustomButton>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
