import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  styled,
  Typography,
} from "@material-ui/core";
import React from "react";

const CustomCard = styled(Card)({
  minHeight: 412,
  boxShadow: "none",
  background: "#fff",
  border: "1px solid #E4E4E4",
  boxSizing: "border-box",
  borderRadius: "0px",
  marginRight: "25px",
  marginTop: 25,
  "&:first-child": {
    marginLeft: "0px",
  },
});

const Circle = styled(Paper)({
  background: "#eeeeee",
  height: 70,
  width: 70,
  borderRadius: "50%",
  boxShadow: "none",
  marginBottom: 20,
});

const FooterContainer = styled(Paper)({
  boxShadow: "none",
  background: "#000000",
  height: 61,
  borderRadius: 0,
  alignItems: "center",
  display: "flex",
  justifyContent: "flex-end",
  paddingRight: 29,
});

const CustomButton = styled(Paper)({
  boxShadow: "none",
  width: 121,
  background: "#3866F9",
  borderRadius: 21,
  color: "#fff",
  padding: "6px 24px",
  textAlign: "center",
  fontSize: 16,
  fontWeight: 400,
  cursor: "pointer",
});

export const SelectTemplate: React.FC = () => {
  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="h1">Select template</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Create an organization by picking a template below.
          </Typography>
        </Grid>

        <Grid item container direction="row" justify="space-between">
          <Grid item xs={6}>
            <CustomCard>
              <CardContent>
                <Circle />
                <Typography variant="h3">Treasury</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
                <Divider />
                <Typography variant="subtitle2" color="textPrimary">
                  Manage resources collectively
                </Typography>
              </CardContent>
              <FooterContainer>
                <CustomButton>View details</CustomButton>
              </FooterContainer>
            </CustomCard>
          </Grid>
          <Grid item xs={6}>
            <CustomCard>
              <CardContent>
                <Circle />
                <Typography variant="h3">Registry</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
                <Divider />
                <Typography variant="subtitle2" color="textPrimary">
                  Manage a list, collectively
                </Typography>
              </CardContent>
              <FooterContainer>
                <CustomButton>View details</CustomButton>
              </FooterContainer>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
