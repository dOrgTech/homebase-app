import {
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  withTheme,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { ConnectWallet } from "./ConnectWallet";
import { Governance } from "./Governance";
import { SelectTemplate } from "./SelectTemplate";
import { TokenSettings } from "./TokenSettings";
import { DaoSettings } from "./DaoSettings";
import { Summary } from "./Summary";
import { Review } from "./Review";
import { useHistory } from "react-router-dom";
import { useConnectWallet } from "../../store/wallet/hook";
import ProgressBar from "react-customizable-progressbar";
import { useOriginate } from "../../hooks/useOriginate";
import { MichelsonMap } from "@taquito/taquito";
import { TokenHolders } from "../../store/dao-info/types";

const PageContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
}));

const fullHeightStyles = makeStyles({
  root: {
    height: "100%",
  },
});

const reducedHeightStyles = makeStyles({
  root: {
    height: "87%",
  },
});

const CustomGrid = styled(Grid)({
  alignItems: "center",
  justifyContent: "center",
  borderRight: "2px solid #3D3D3D",
});

const StepContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  marginTop: "2.5%",
  marginBottom: "2%",
  height: "calc(100% - 112px)",
  alignItems: "center",
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  marginTop: "2.5%",
  marginBottom: "2%",
  height: "80%",
  alignItems: "center",
});

const Footer = styled(withTheme(Grid))((props) => ({
  boxShadow: "none",
  background: props.theme.palette.primary.main,
  height: 62,
  paddingTop: "1%",
  borderTop: "2px solid #3D3D3D",
}));

const BackButton = styled(Paper)({
  boxShadow: "none",
  width: "121px",
  height: 31,
  background: "inherit",
  color: "#fff",
  textAlign: "center",
  marginLeft: "4%",
  paddingTop: "1%",
  cursor: "pointer",
});

const NextButton = styled(Paper)({
  boxShadow: "none",
  minWidth: "121px",
  height: 31,
  borderRadius: 21,
  textAlign: "center",
  paddingTop: "1%",
  background: "inherit",
  float: "right",
  marginRight: "4%",
  cursor: "pointer",
  paddingLeft: "3%",
  paddingRight: "3%",
});

const WhiteText = styled(withTheme(Typography))((props) => ({
  color: props.theme.palette.secondary.main,
}));

const StyledStepper = styled(withTheme(Stepper))((props) => ({
  background: "inherit",
}));

const IndicatorValue = styled(withTheme(Paper))((props) => ({
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
  color: props.theme.palette.text.secondary,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
}));

const STEPS = [
  "Select template",
  // "Claim a name",
  "Configure template",
  "Review information",
  "Launch organization",
];

const metadataCarrierParams = {
  keyName: "jaja",
  metadata: {
    frozenToken: {
      name: "J",
      symbol: "JAJA",
      decimals: 18,
    },
    unfrozenToken: {
      name: "J",
      symbol: "JAJA",
      decimals: 18,
    },
  },
};

export const DAOCreate: React.FC = () => {
  const [
    originateMetaData,
    { loading: loadingMetadataContract, data: carrierData },
  ] = useOriginate("MetadataCarrier", metadataCarrierParams);

  const daoInfo = useSelector<AppState, AppState["saveDaoInformationReducer"]>(
    (state) => state.saveDaoInformationReducer
  );
  const membersTokenAllocation = daoInfo.token_holders.map(
    (holder: TokenHolders) => {
      return {
        address: holder.token_holder,
        amount: holder.balance.toString(),
        tokenId: "1",
      };
    }
  );

  const unfrozenScale = daoInfo.stake_returned_percentage;
  const unfrozenExtra = daoInfo.stake_returned;
  const frozenScale = daoInfo.min_stake_percentage;
  const frozenExtra = daoInfo.min_stake;

  const [
    originateTreasury,
    { loading: loadingTrasuryData, data: treasuryData },
  ] = useOriginate("Treasury", {
    storage: {
      membersTokenAllocation,
      adminAddress: daoInfo.administrator,
      frozenScaleValue: 1,
      frozenExtraValue: 0,
      slashScaleValue: 1,
      slashDivisionValue: 1,
      minXtzAmount: 1,
      maxXtzAmount: daoInfo.max_agent!,
      maxProposalSize: 100,
      quorumTreshold: 4,
      votingPeriod:
        daoInfo.voting_hours! * 3600 +
        daoInfo.voting_days! * 24 * 3600 +
        daoInfo.voting_minutes! * 60,
    },
    metadataCarrierDeploymentData: {
      deployAddress: carrierData ? carrierData.address : "",
      keyName: "jaja",
    },
  });

  useEffect(() => {
    console.log("loading data ", loadingTrasuryData);
    if (treasuryData) {
      console.log("trasury data ", treasuryData);
    }
  }, [loadingTrasuryData, treasuryData]);

  console.log(carrierData);
  console.log("loading: loadingMetadataContract ", loadingMetadataContract);

  const [activeStep, setActiveStep] = React.useState(0);
  const [governanceStep, setGovernanceStep] = useState(0);
  const [handleNextStep, setHandleNextStep] = useState(() => undefined);
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );
  const [progress, setProgress] = useState(0.5);
  const fullHeight = fullHeightStyles();
  const reducedHeight = reducedHeightStyles();

  const history = useHistory<any>();

  const handleStep = () => {
    if (activeStep === 2) {
      originateMetaData();
    }

    setActiveStep(activeStep + 1);
  };

  useEffect(() => {
    if (carrierData) {
      originateTreasury();
    }
  }, [carrierData]);

  function getStepContent(step: number, handleNextStep: any) {
    switch (step) {
      case 0:
        return <SelectTemplate setActiveStep={setActiveStep} />;
      case 1:
        return governanceStep === 0 ? (
          <Governance
            setProgress={setProgress}
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        ) : governanceStep === 1 ? (
          <TokenSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        ) : (
          <DaoSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 2:
        return (
          <Summary
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 3:
        return <Review />;
    }
  }

  const handleBackStep = () => {
    if (activeStep === 1 && governanceStep === 0) {
      return setActiveStep(0);
    } else if (activeStep === 1 && governanceStep !== 0) {
      return setGovernanceStep(governanceStep - 1);
    } else if (activeStep === 0) {
      history.push("/explorer");
    }
  };

  const { tezos } = useConnectWallet();

  return (
    <PageContainer
      container
      classes={
        !account || (account && activeStep === 0) ? reducedHeight : fullHeight
      }
    >
      <CustomGrid container item xs={3} direction="column" justify="flex-end">
        {
          <ProgressBar
            progress={progress}
            radius={62}
            strokeWidth={4}
            strokeColor={"#81FEB7"}
            trackStrokeWidth={2}
            trackStrokeColor={"#3d3d3d"}
          >
            <div className="indicator">
              <IndicatorValue>
                {progress === 0.5 ? 0 : progress}%
              </IndicatorValue>
            </div>
          </ProgressBar>
        }
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {STEPS.map((label, index) => (
            <Step key={label} {...(!account && { active: false })}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </CustomGrid>
      <Grid item container justify="center" alignItems="center" xs={9}>
        {account ? (
          <StepContentContainer item container justify="center">
            {getStepContent(activeStep, handleNextStep)}
          </StepContentContainer>
        ) : (
          <StepOneContentContainer item container justify="center">
            <ConnectWallet />
          </StepOneContentContainer>
        )}

        {activeStep !== 0 && activeStep !== 1 && activeStep !== 3 ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={() => setActiveStep(activeStep - 1)}>
                <Typography>BACK</Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={handleStep}>
                {" "}
                <WhiteText>
                  {activeStep !== 2 ? "CONTINUE" : "Launch Organization"}
                </WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}

        {account && (activeStep === 1 || activeStep === 0) ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={handleBackStep}>
                <Typography>BACK </Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={handleNextStep}>
                {" "}
                <WhiteText>CONTINUE</WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}

        {!account ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={() => history.push("/explorer")}>
                <Typography>BACK </Typography>{" "}
              </BackButton>
            </Grid>
          </Footer>
        ) : null}
      </Grid>
    </PageContainer>
  );
};
