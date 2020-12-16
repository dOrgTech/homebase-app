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
  TextField,
  InputAdornment,
} from "@material-ui/core";
import React, { useState } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

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
  padding: "18px 21px",
  boxSizing: "border-box",
});

const CustomBalanceContainer = styled(Grid)({
  border: "1px solid #E4E4E4",
  height: 62,
  marginTop: 14,
  borderLeft: "none",
  padding: "18px 21px",
  boxSizing: "border-box",
});

const CustomTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial",
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important", // Semi-transparent underline
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important", // Solid underline on hover
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important", // Solid underline on focus
    },
  },
})(TextField);

const CustomTotalContainer = styled(Typography)({
  padding: "29px 21px",
  boxSizing: "border-box",
});

const CustomValueContainer = styled(Typography)({
  padding: "29px 21px",
  boxSizing: "border-box",
  fontWeight: 700,
});

export const TokenSettings: React.FC = () => {
  const [balanceAccountOne, setBalanceAccountOne] = useState(undefined);
  const [balanceAccountTwo, setBalanceAccountTwo] = useState(undefined);

  const getTotalBalance = () => {
    if (balanceAccountOne && !balanceAccountTwo) {
      return (Number(balanceAccountOne) + Number(0)).toFixed(2);
    } else if (!balanceAccountOne && balanceAccountTwo) {
      return (Number(balanceAccountTwo) + Number(0)).toFixed(2);
    } else if (balanceAccountOne && balanceAccountTwo) {
      return (Number(balanceAccountTwo) + Number(balanceAccountOne)).toFixed(2);
    } else {
      return "0.00";
    }
  };
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <Typography variant="h1">Distribution Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the name, symbol, and initial
            distribution of your token.
          </CustomTypography>
        </Grid>

        <SecondContainer item container direction="row">
          <Grid item xs={9}>
            <Typography variant="subtitle1"> Token holder </Typography>
            <CustomInputContainer>
              <CustomTextField type="text" placeholder="0xf8s8d...." />
            </CustomInputContainer>
            <CustomInputContainer>
              <CustomTextField type="text" placeholder="0xf8s8d...." />
            </CustomInputContainer>

            <CustomTotalContainer variant="subtitle1">
              {" "}
              Total{" "}
            </CustomTotalContainer>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1"> Balance </Typography>
            <CustomBalanceContainer>
              <CustomTextField
                type="number"
                placeholder="0.00"
                value={balanceAccountOne}
                onChange={(e: any) => setBalanceAccountOne(e.target.value)}
              />
            </CustomBalanceContainer>
            <CustomBalanceContainer>
              <CustomTextField
                type="number"
                placeholder="0.00"
                value={balanceAccountTwo}
                onChange={(e: any) => setBalanceAccountTwo(e.target.value)}
              />
            </CustomBalanceContainer>

            <CustomValueContainer variant="subtitle1">
              {" "}
              {getTotalBalance()}{" "}
            </CustomValueContainer>
          </Grid>
        </SecondContainer>

        <SecondContainer item container direction="row" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {" "}
              Maximum Agent Spend Per Cycle{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CustomInputContainer>
              <CustomTextField
                type="number"
                placeholder="00"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">TKN</InputAdornment>
                  ),
                }}
              />
            </CustomInputContainer>
          </Grid>

          <Grid item xs={6}>
            <Grid container direction="row" justify="flex-end">
              <InfoOutlinedIcon></InfoOutlinedIcon>
            </Grid>
          </Grid>
        </SecondContainer>

        <SecondContainer item container direction="row" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1"> Administrator </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomInputContainer>
              <CustomTextField type="number" placeholder="0xf8s8d...." />
            </CustomInputContainer>
          </Grid>
        </SecondContainer>
      </Grid>
    </>
  );
};
