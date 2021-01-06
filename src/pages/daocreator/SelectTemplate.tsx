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

interface Props {
  setActiveStep: any;
}

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
  fontFamily: "system-ui",
  height: "fit-content",
});

const CustomFooterCard = styled(Card)({
  minHeight: 124,
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

const CustomCardContent = styled(CardContent)({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "0px",
  },
  minHeight: 330,
});

const CustomCardFooterContent = styled(CardContent)({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "inherit",
    display: "flex",
  },
});

const CustomRow = styled(Grid)({
  padding: "15px 40px",
  width: "70%",
});

export const SelectTemplate: React.FC<Props> = (props) => {
  const { setActiveStep } = props;
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
              <CustomCardContent>
                <Circle />
                <Typography variant="h3">Treasury</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
                <Divider />
                <Typography variant="subtitle2" color="textPrimary">
                  Manage resources collectively
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
                <Circle />
                <Typography variant="h3">Registry</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Non-profits, Companies, Founders
                </Typography>
                <Divider />
                <Typography variant="subtitle2" color="textPrimary">
                  Manage a list, collectively
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

        {/* <Grid item container direction="row" justify="space-between">
          <Grid item xs={12}>
            <CustomFooterCard>
              <CustomCardFooterContent>
                <Circle />

                <CustomRow container direction="column">
                  <Typography variant="h3">Blank slate</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Blank slate test
                  </Typography>
                </CustomRow>
                <CustomButton
                  style={{ margin: "auto" }}
                  onClick={() => setActiveStep(1)}
                >
                  View details
                </CustomButton>
              </CustomCardFooterContent>
            </CustomFooterCard>
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
};
