import React, { useContext, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
  Button,
} from "@material-ui/core";
import ProgressBar from "react-customizable-progressbar";
import { useHistory } from "react-router";

import { ConnectWallet } from "src/modules/daocreator/components/ConnectWallet";
import { CreatorContext } from "src/modules/daocreator/state/context";
import {
  CurrentStep,
  STEPS,
  useStepNumber,
} from "src/modules/daocreator/steps";
import HomeButton from "src/assets/logos/homebase.svg";
import { useTezos } from "src/services/beacon/hooks/useTezos";
import { toShortAddress } from "src/services/contracts/utils";
import { NavigationBar } from "src/modules/daocreator/components/NavigationBar";
import { StepInfo } from "src/modules/daocreator/state/types";

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "100vh",
}));

const StepContentContainer = styled(Grid)({
  alignItems: "center",
  height: "100%",
  maxHeight: "calc(100vh - 75px - 58px)",
  paddingTop: 50,
  boxSizing: "border-box",
  overflowY: "auto",
  paddingRight: "8vw",
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
});

const StyledStepper = styled(Stepper)({
  background: "inherit",
  marginTop: 70,
});

const StepContentHeigth = styled(Grid)({
  height: "calc(100vh - 75px)",
});

const IndicatorValue = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  margin: "0 auto",
  fontSize: 25,
  color: theme.palette.text.secondary,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
}));

const ProgressContainer = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
});

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
});

const custom = {
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22,
  },
  appBorder: {
    borderBottom: "2px solid #3D3D3D",
  },
  appHeight: {
    height: "inherit",
  },
  appLogoHeight: {
    height: "inherit",
    borderRight: "2px solid #3D3D3D",
  },
};

const LogoItem = styled("img")({
  cursor: "pointer",
});

const AddressContainer = styled(Grid)({
  width: "min-content",
  paddingRight: 24,
  alignItems: "baseline",
  marginTop: 22,
});

const StatusDot = styled(Box)({
  borderRadius: "100%",
  width: 8,
  height: 8,
  background: "#4BCF93",
  marginLeft: 8,
});

const ConnectButton = styled(Button)({
  maxHeight: 50,
  alignSelf: "baseline",
  marginTop: 22,
  marginRight: 14,
});

export const DAOCreate: React.FC = () => {
  const creator = useContext(CreatorContext);

  const { back, next } = creator.state;
  const step = useStepNumber();
  const progress = useMemo(() => step * 25, [step]);
  const history = useHistory();
  const { connect, account } = useTezos();

  return (
    <PageContainer container direction="row">
      <ProgressContainer
        item
        xs={3}
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          xs={3}
          style={{ maxWidth: "unset" }}
        >
          <Grid item>
            <Box
              style={location.pathname === "/creator" ? custom.logo : undefined}
              onClick={() => history.push("/explorer")}
              margin="auto"
              marginTop="22px"
            >
              <Grid
                container
                alignItems="center"
                wrap="nowrap"
                justify="center"
              >
                <Grid item>
                  <LogoItem src={HomeButton} />
                </Grid>
                <Grid item>
                  <Box paddingLeft="10px">
                    <LogoText color="textSecondary">Homebase</LogoText>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item container direction="column" alignItems="center" xs>
          <ProgressBar
            progress={progress}
            radius={62}
            strokeWidth={4}
            strokeColor={"#81FEB7"}
            trackStrokeWidth={2}
            trackStrokeColor={"#3d3d3d"}
          >
            <Box className="indicator">
              <IndicatorValue>
                {progress === 0.5 ? 0 : step * 25}%
              </IndicatorValue>
            </Box>
          </ProgressBar>
          <StyledStepper activeStep={step} orientation="vertical">
            {STEPS.map(({ title }: StepInfo, index: any) => (
              <Step key={title}>
                <StepLabel icon={index + 1}>{title}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
        </Grid>
      </ProgressContainer>

      <StepContentHeigth item xs={9} container justify="center">
        <Grid
          container
          direction="column"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <Grid item style={{ marginLeft: "auto" }}>
            {account ? (
              <AddressContainer
                container
                alignItems="center"
                wrap="nowrap"
                justify="flex-end"
              >
                <Grid item>
                  <Typography variant="subtitle1" color="textSecondary">
                    {toShortAddress(account)}
                  </Typography>
                </Grid>
                <Grid item>
                  <StatusDot />
                </Grid>
              </AddressContainer>
            ) : (
              <ConnectButton
                color="secondary"
                variant="outlined"
                onClick={connect}
              >
                Connect Wallet
              </ConnectButton>
            )}
          </Grid>
          <Grid item style={{ width: "100%" }} xs>
            <StepContentContainer item container justify="center">
              <CurrentStep />
            </StepContentContainer>
          </Grid>
        </Grid>
      </StepContentHeigth>
      {step < 4 && <NavigationBar back={back} next={next} />}
    </PageContainer>
  );
};
