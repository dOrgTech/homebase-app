import React, { useContext, useEffect, useMemo } from "react";
import {
  Button,
  Grid,
  Box,
  styled as styledMat,
  Typography,
} from "@material-ui/core";
import Rocket from "../../../assets/img/rocket.svg";
import { CreatorContext } from "../state/context";
import { useOriginateTreasury } from "../../../services/contracts/baseDAO/hooks/useOriginateTreasury";
import { fromStateToTreasuryStorage, getTokensInfo } from "../state/utils";
import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import { MigrationParams } from "../../../services/contracts/baseDAO/types";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const RocketImg = styledMat("img")({
  marginBottom: 46,
});

const WaitingText = styledMat(Typography)({
  marginTop: 9,
});

const CustomButton = styledMat(Button)({
  marginTop: 20,
});

const animation1 = keyframes`
  0% {
  opacity: 1;
  }
  65% {
  opacity: 1;
  }
  66% {
  opacity: 0;
  }
  100% {
  opacity: 0;
  }
 `;

const animation2 = keyframes`
  0% {
   opacity: 0;
  }
  21% {
   opacity: 0;
  }
  22% {
   opacity: 1;
  }
  65% {
   opacity: 1;
  }
  66% {
   opacity: 0;
  }
  100% {
   opacity: 0;
  }
 `;

const animation3 = keyframes`
  0% {
   opacity: 0;
  }
  43% {
   opacity: 0;
  }
  44% {
   opacity: 1;
  }
  65% {
   opacity: 1;
  }
  66% {
   opacity: 0;
  }
  100% {
   opacity: 0;
  }
 }`;

const Dot1 = styled.span`
  animation: ${animation1} 2s linear infinite;
`;

const Dot2 = styled.span`
  animation: ${animation2} 2s linear infinite;
`;

const Dot3 = styled.span`
  animation: ${animation3} 2s linear infinite;
`;

export const Review: React.FC = () => {
  const { state } = useContext(CreatorContext);
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
            <WaitingText
              variant="subtitle1"
              color="textSecondary"
              style={{ fontWeight: "bold" }}
            >
              {current} <Dot1>.</Dot1>
              <Dot2>.</Dot2>
              <Dot3>.</Dot3>
            </WaitingText>
          ) : (
            error && (
              <WaitingText
                variant="subtitle1"
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
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
