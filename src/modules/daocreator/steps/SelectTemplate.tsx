import {
  CardContent,
  Grid,
  Paper,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CreatorContext } from "../state/context";
import { ActionTypes } from "../state/types";

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

const CustomCardContent = styled(CardContent)({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "0px",
  },
  minHeight: 168,
});

const Phrase = styled(Typography)({
  marginTop: 12,
  marginBottom: 19,
});

const Subtitle = styled(Typography)({
  marginTop: 26,
});

export const SelectTemplate = (): JSX.Element => {
  const { dispatch } = useContext(CreatorContext);
  const history = useHistory();

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      back: {
        text: "BACK",
        handler: () => history.push("/explorer"),
      },
    });
  }, [dispatch, history]);

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
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Circle />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={8}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Treasury
                    </Typography>
                  </Grid>
                </Grid>
                <Subtitle variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Subtitle>
              </CustomCardContent>
              <FooterContainer
                onClick={() =>
                  dispatch({ type: ActionTypes.UPDATE_STEP, step: 1 })
                }
              >
                <Typography variant="subtitle1" color="textSecondary">
                  USE TEMPLATE
                </Typography>
              </FooterContainer>
            </CustomCard>
          </Grid>
          <Grid item xs={6}>
            <CustomCard>
              <CustomCardContent>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Circle />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={8}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Registry
                    </Typography>
                  </Grid>
                </Grid>
                <Subtitle variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Subtitle>
              </CustomCardContent>
              <FooterContainer
                onClick={() =>
                  dispatch({ type: ActionTypes.UPDATE_STEP, step: 1 })
                }
              >
                <Typography variant="subtitle1" color="textSecondary">
                  USE TEMPLATE
                </Typography>
              </FooterContainer>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
