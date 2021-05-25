import { styled, Grid, Typography } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field } from "formik";
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
  paddingTop: 24
});

export const DescriptionContainer = styled(Grid)(({theme}) => ({
  paddingLeft: 65,
  paddingRight: 65,
  paddingTop: 24,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 24,
    paddingRight: 24,
  }
}));

export const ProposalTextContainer: React.FC<{ title: string, value: string, type: "description" | "title" }> = ({ title, value, type }) => {
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
            <Typography
              variant="subtitle1"
              color="textSecondary"
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              align="right"
              variant="subtitle1"
              color="textSecondary"
            >
              {value
                ? value.trim().split(" ")
                  .length
                : 0}{" "}
            Words
          </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Field
          name={type}
          type="string"
          multiline
          rows={type === "description" ? 6 : 2}
          placeholder={`Type a ${title}`}
          component={CustomTextarea}
        />
      </Grid>
    </DescriptionContainer>
  );
};
