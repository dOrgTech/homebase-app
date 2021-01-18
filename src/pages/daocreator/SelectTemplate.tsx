import {
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
import React from "react";

interface Props {
  setActiveStep: any;
}

const CustomCard = styled(withTheme(Grid))((props) => ({
  minHeight: 248,
  boxShadow: "none",
  background: props.theme.palette.primary.main,
  border: "1px solid #3D3D3D",
  boxSizing: "border-box",
  borderRadius: "0px",
  marginRight: "25px",
  marginTop: 25,
  "&:first-child": {
    marginLeft: "0px",
  },
}));

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
  fontFamily: "system-ui",
  height: "fit-content",
});

const CustomCardContent = styled(CardContent)({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "0px",
  },
  minHeight: 248,
});

export const SelectTemplate: React.FC<Props> = (props) => {
  const { setActiveStep } = props;
  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="h1" color="textSecondary">
            Select template
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            Create an organization by picking a template below.
          </Typography>
        </Grid>

        <Grid item container direction="row" justify="space-between">
          <Grid item xs={6}>
            <CustomCard>
              <CustomCardContent>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={4}>
                    <Circle />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h3" color="textSecondary">
                      Treasury
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
              </CustomCardContent>
              <FooterContainer>
                <CustomButton onClick={() => setActiveStep(1)}>
                  View details
                </CustomButton>
              </FooterContainer>
            </CustomCard>
          </Grid>
          <Grid item xs={6}>
            <CustomCard>
              <CustomCardContent>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={4}>
                    <Circle />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h3" color="textSecondary">
                      Registry
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
              </CustomCardContent>
              <FooterContainer>
                <CustomButton onClick={() => setActiveStep(1)}>
                  View details
                </CustomButton>
              </FooterContainer>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
