import React, { useContext, useEffect, useMemo } from "react";
import {
  Button,
  Grid,
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

  const { mutate, isLoading, error, data } = useOriginateTreasury();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (!data && info && metadataCarrierParams)
        mutate({
          metadataParams: metadataCarrierParams,
          treasuryParams: fromStateToTreasuryStorage(info),
        });
    })();
  }, []);

  console.log(error);

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <RocketImg src={Rocket} alt="rocket" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary">
            Deploying <strong> {state.data.orgSettings.name} </strong> to the
            Tezos Network
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {!isLoading ? (
            <WaitingText variant="subtitle1" color="textSecondary">
              Waiting for confirmation <Dot1>.</Dot1>
              <Dot2>.</Dot2>
              <Dot3>.</Dot3>
            </WaitingText>
          ) : (
            <>
              <WaitingText variant="subtitle1" color="textSecondary">
                Your DAO has been deployed!
              </WaitingText>

              {data && data.address ? (
                <CustomButton
                  color="secondary"
                  variant="outlined"
                  onClick={() => history.push("/explorer/dao/" + data.address)}
                >
                  Go to my DAO
                </CustomButton>
              ) : null}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
