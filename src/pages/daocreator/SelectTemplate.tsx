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

const FooterContainer = styled(withTheme(Paper))((props) => ({
  boxShadow: "none",
  background: props.theme.palette.primary.main,
  height: 61,
  borderRadius: 0,
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  paddingRight: 29,
  borderTop: "1px solid #3D3D3D",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
}));

const CustomButton = styled(withTheme(Paper))((props) => ({
  boxShadow: "none",
  width: 121,
  background: "#3866F9",
  borderRadius: 21,
  color: props.theme.palette.primary.main,
  padding: "6px 24px",
  textAlign: "center",
  fontSize: 16,
  fontWeight: 400,
  cursor: "pointer",
  fontFamily: "system-ui",
  height: "fit-content",
}));

const CustomCardContent = styled(CardContent)({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "0px",
  },
  minHeight: 168,
});

const Phrase = styled(Typography)({
  marginTop: 20,
  marginBottom: 39,
});

export const SelectTemplate: React.FC<Props> = (props) => {
  const { setActiveStep } = props;
  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="h3" color="textSecondary">
            Select template
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Phrase variant="subtitle1" color="textSecondary">
            Create an organization by picking a template below.
          </Phrase>
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
                    <Typography variant="subtitle1" color="textSecondary">
                      Treasury
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
              </CustomCardContent>
              <FooterContainer onClick={() => setActiveStep(1)}>
                <Typography variant="subtitle1" color="textSecondary">
                  USE TEMPLATE
                </Typography>
                {/* <CustomButton onClick={() => setActiveStep(1)}>
                  View details
                </CustomButton> */}
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
                    <Typography variant="subtitle1" color="textSecondary">
                      Registry
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
              </CustomCardContent>
              <FooterContainer onClick={() => setActiveStep(1)}>
                <Typography variant="subtitle1" color="textSecondary">
                  USE TEMPLATE
                </Typography>
                {/* <CustomButton >
                  View details
                </CustomButton> */}
              </FooterContainer>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
