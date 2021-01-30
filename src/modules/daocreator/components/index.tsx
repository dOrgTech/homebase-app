import React, { useContext, useEffect, useMemo } from "react";
import {
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";
import { useSelector } from "react-redux";

import { ConnectWallet } from "./ConnectWallet";
import { Governance } from "./Governance";
import { SelectTemplate } from "./SelectTemplate";
import { TokenSettings } from "./TokenSettings";
import { DaoSettings } from "./DaoSettings";
import { Summary } from "./Summary";
import { Review } from "./Review";
import { TokenHolders } from "../../../store/dao-info/types";
import { useOriginate } from "../../../hooks/useOriginate";
import { ActionTypes, StepperIndex, StepInfo } from "../state/types";
import { AppState } from "../../../store";
import { CreatorContext } from "../state/context";

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
}));

const StepContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
  height: "inherit",
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
});

const Footer = styled(Grid)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.main,
  height: "inherit",
  paddingTop: "1%",
  borderTop: "2px solid #3D3D3D",
  marginLeft: "24.85%",
  borderLeft: "2px solid #3D3D3D",
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

const WhiteText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
}));

const StyledStepper = styled(Stepper)({
  background: "inherit",
});

const StepContentHeigth = styled(Grid)({
  height: "80vh",
});

const ContentContainer = styled(Grid)({
  height: "inherit",
  alignItems: "center",
  display: "flex",
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

const STEPS: StepInfo[] = [
  { title: "Select template", index: StepperIndex.SELECT_TEMPLATE },
  { title: "Configure template", index: StepperIndex.CONFIGURE_TEMPLATE },
  { title: "Review information", index: StepperIndex.REVIEW_INFORMATION },
  { title: "Launch organization", index: StepperIndex.LAUNCH_ORGANIZATION },
];

const CurrentStep = () => {
  const { activeStep, governanceStep } = useContext(CreatorContext).state;
  console.log("In current step ", activeStep);
  switch (activeStep) {
    case 0:
      return <SelectTemplate />;
    case 1:
      return governanceStep ? <DaoSettings /> : <Governance />;
    case 2:
      return <TokenSettings />;
    case 3:
      return <Summary />;
    case 4:
      return <Review />;

    default:
      return <div />;
  }
};

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
  const { activeStep, governanceStep, onNextStep } = useContext(
    CreatorContext
  ).state;
  const dispatch = useContext(CreatorContext).dispatch;

  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  const [originateMetaData, { data: carrierData }] = useOriginate(
    "MetadataCarrier",
    metadataCarrierParams
  );

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

  const launchOrganization = () => {
    dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep + 1 });
    originateMetaData();
  };

  const [
    originateTreasury,
    { loading: loadingTreasuryData, data: treasuryData },
  ] = useOriginate("Treasury", {
    storage: {
      membersTokenAllocation,
      adminAddress: daoInfo.administrator,
      frozenScaleValue: 1,
      frozenExtraValue: 0,
      slashScaleValue: 1,
      slashDivisionValue: 1,
      minXtzAmount: 1,
      maxXtzAmount: daoInfo.max_agent || 0,
      maxProposalSize: 100,
      quorumTreshold: 4,
      votingPeriod:
        (daoInfo.voting_hours || 1) * 3600 +
        (daoInfo.voting_days || 1) * 24 * 3600 +
        (daoInfo.voting_minutes || 1) * 60,
    },
    metadataCarrierDeploymentData: {
      deployAddress: carrierData ? carrierData.address : "",
      keyName: "jaja",
    },
  });

  useEffect(() => {
    if (carrierData && !loadingTreasuryData) {
      originateTreasury();
    }
  }, [carrierData, originateTreasury, loadingTreasuryData]);

  useEffect(() => {
    if (treasuryData) {
      console.log("Treasury DAO contract data: ", treasuryData);
    }
  }, [treasuryData]);

  const history = useHistory();

  const handleBackStep = () => {
    if (activeStep === 1 && !governanceStep) {
      return dispatch({ type: ActionTypes.UPDATE_STEP, step: 0 });
    }

    if (activeStep === 1 && governanceStep) {
      return dispatch({
        type: ActionTypes.UPDATE_GOVERNANCE_STEP,
        step: governanceStep - 1,
      });
    }

    if (!activeStep) {
      history.push("/explorer");
      return;
    }

    if (activeStep === 3 || activeStep === 2) {
      return dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep - 1 });
    }
  };

  const progress = useMemo(() => activeStep * 25, [activeStep]);

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
              {progress === 0.5 ? 0 : activeStep * 25}%
            </IndicatorValue>
          </div>
        </ProgressBar>
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {STEPS.map(({ title }: StepInfo) => (
            <Step key={title} {...(!account && { active: false })}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </ProgressContainer>

      <StepContentHeigth item xs={9} container>
        <ContentContainer item xs={11}>
          {account ? (
            <StepContentContainer item container justify="center">
              <CurrentStep />
            </StepContentContainer>
          ) : (
            <StepOneContentContainer item container justify="center">
              <ConnectWallet />
            </StepOneContentContainer>
          )}
        </ContentContainer>
      </StepContentHeigth>
      <Footer
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        {account && activeStep !== 3 && activeStep !== 4 ? (
          <Grid item xs={6}>
            <BackButton onClick={handleBackStep}>
              <Typography>BACK </Typography>{" "}
            </BackButton>
          </Grid>
        ) : null}

        {activeStep === 1 || activeStep === 2 ? (
          <Grid item xs={6}>
            <NextButton onClick={onNextStep}>
              {" "}
              <WhiteText>CONTINUE</WhiteText>
            </NextButton>
          </Grid>
        ) : null}

        {!account ? (
          <Grid item xs={6}>
            <BackButton onClick={() => history.push("/explorer")}>
              <Typography>BACK </Typography>{" "}
            </BackButton>
          </Grid>
        ) : null}

        {activeStep === 3 ? (
          <>
            <Grid item xs={6}>
              <BackButton onClick={handleBackStep}>
                <Typography>BACK</Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={launchOrganization}>
                {" "}
                <WhiteText>{"LAUNCH"}</WhiteText>
              </NextButton>
            </Grid>
          </>
        ) : null}
      </Footer>
    </PageContainer>
  );
};
