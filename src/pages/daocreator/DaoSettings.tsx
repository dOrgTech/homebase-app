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
  TextareaAutosize,
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

const CustomTextarea = styled(TextareaAutosize)({
  height: "153px !important",
  width: "100%",
  border: "1px solid #e4e4e4",
  marginTop: 14,
  fontWeight: 300,
  padding: "21px 20px",
  fontFamily: "system-ui",
  fontSize: 16,
});

export const DaoSettings: React.FC = () => {
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <Typography variant="h1">DAO Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the name, symbol, and initial
            distribution of your token.
          </CustomTypography>
        </Grid>

        <SecondContainer container item direction="row" spacing={2}>
          <Grid item xs={9}>
            <Typography variant="subtitle1"> Token name </Typography>
            <CustomInputContainer>
              <CustomTextField type="number" placeholder="My Group’s Token" />
            </CustomInputContainer>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="subtitle1"> Token symbol </Typography>
            <CustomInputContainer>
              <CustomTextField type="number" placeholder="MYTOK" />
            </CustomInputContainer>
          </Grid>
        </SecondContainer>
        <SecondContainer container direction="row" alignItems="center">
          <Switch
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
          <Typography variant="subtitle1">
            Disable locking until after first voting period.
          </Typography>

          <Grid item xs={12}>
            <Grid container direction="row" justify="flex-end">
              <InfoOutlinedIcon></InfoOutlinedIcon>
            </Grid>
          </Grid>
        </SecondContainer>

        <SecondContainer container direction="row" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1">Description</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextarea
              aria-label="empty textarea"
              placeholder="This is what we’re about..."
            />
          </Grid>
        </SecondContainer>
      </Grid>
    </>
  );
};
