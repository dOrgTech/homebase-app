import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Link,
  Paper,
  styled,
  Switch,
  Typography,
  Slider,
  withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import Input from "@material-ui/core/Input";

const CustomUrlButton = styled(Paper)({
  border: "1px solid #3866F9",
  width: 165,
  height: 31,
  boxSizing: "border-box",
  borderRadius: 21,
  cursor: "pointer",
  backgroundColor: "#fff",
  boxShadow: "none",
  textAlign: "center",
  margin: "auto",
  padding: 5,
  color: "#3866F9",
  marginTop: 12,
  fontFamily: "system-ui",
});

const CustomTypography = styled(Typography)({
  paddingBottom: 21,
  borderBottom: "1px solid #E4E4E4",
  marginTop: 10,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomInputContainer = styled(Grid)({
  border: "1px solid #E4E4E4",
  height: 62,
  marginTop: 14,
  "&:first-child": {
    borderRight: "none",
  },
  "&:last-child": {
    borderLeft: "none",
  },
});

const CustomInput = styled(Input)({
  fontSize: 21,
  color: "rgba(0, 0, 0, 0.5)",
  fontWeight: 300,
});

const GridItemCenter = styled(Grid)({
  textAlign: "center",
});

const ItemContainer = styled(Grid)({
  height: "100%",
  padding: 12,
});

const CustomLink = styled(Link)({
  color: "#3866F9",
  fontWeight: 700,
});

const Title = styled(Typography)({
  marginLeft: 10,
});

const StyledSlider = withStyles({
  root: {
    textAlign: "center",
    width: "95%",
  },
  valueLabel: {
    textAlign: "center",
  },
  thumb: {
    height: 28,
    width: 28,
    top: "15.5%",
    backgroundColor: "#000000",
    border: "2px solid #000000",
  },
  track: {
    backgroundColor: "#3866F9",
    borderRadius: "4px",
    height: 2,
  },
})(Slider);

const CustomSliderValue = styled(Paper)({
  boxShadow: "none",
  height: 62,
  border: "1px solid #000000",
  borderRadius: 0,
});

const Value = styled(Typography)({
  textAlign: "center",
  padding: "30%",
});

export const Governance: React.FC = () => {
  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();
  const [stake, setStake] = useState(0);
  const [support, setSupport] = useState(0);
  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12}>
          <Typography variant="h1">Proposals & Voting</Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the duration, support and approval
            required for proposals.
          </CustomTypography>
        </Grid>
      </Grid>

      <SecondContainer container direction="row">
        <Typography variant="subtitle1">Proposal Period Duration</Typography>
      </SecondContainer>

      <Grid container direction="row">
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>days</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography variant="subtitle1">Voting Period Duration</Typography>
      </SecondContainer>

      <Grid container direction="row">
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>days</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row" alignItems="center">
        <Switch
          name="checkedA"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />
        <Typography variant="subtitle1">
          Requires an
          <CustomLink href="#" onClick={preventDefault}>
            {" "}
            Agora
          </CustomLink>{" "}
          Link to submit a proposal
        </Typography>
      </SecondContainer>

      <SecondContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Stake </Typography>
        <Title variant="subtitle2">(% of proposal value)</Title>
      </SecondContainer>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <StyledSlider
            value={stake}
            onChange={(value: any, newValue: any) => setStake(newValue)}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{stake}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>

      <SecondContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Support</Typography>
      </SecondContainer>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <StyledSlider
            value={support}
            onChange={(value: any, newValue: any) => setSupport(newValue)}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{support}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>
    </>
  );
};
