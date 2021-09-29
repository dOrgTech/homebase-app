import { styled, Grid, Typography, TextField, StandardTextFieldProps } from "@material-ui/core";
import React from "react";

export const CustomTextarea = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-multiline": {
    textAlign: "initial",
    border: "1px solid #434242",
    boxSizing: "border-box",
    "& .MuiInputBase-inputMultiline": {
      padding: 12,
      textAlign: "initial",
    },
  },
  paddingTop: 24,
});

export const DescriptionContainer = styled(Grid)(({ theme }) => ({
  paddingLeft: 65,
  paddingRight: 65,
  paddingTop: 24,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 24,
    paddingRight: 24,
  },
}));

interface Props extends StandardTextFieldProps {
  title: string;
  value: string;
  type: "description" | "title";
}

export const ProposalTextContainer: React.FC<Props> = ({ title, value, type, ...props }) => {
  return (
    <DescriptionContainer container direction="row">
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" variant="subtitle1" color="textSecondary">
              {value ? value.trim().split(" ").length : 0} Words
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CustomTextarea
          type="string"
          multiline
          rows={type === "description" ? 6 : 2}
          placeholder={`Type a ${title}`}
          {...props}
        />
      </Grid>
    </DescriptionContainer>
  );
};
