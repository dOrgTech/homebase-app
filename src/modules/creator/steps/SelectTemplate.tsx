import {
  Box,
  CardContent,
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CreatorContext,
  ActionTypes,
  DAOTemplate,
} from "modules/creator/state";

const CustomCard = styled(withTheme(Grid))((props) => ({
  minHeight: 248,
  boxShadow: "none",
  maxWidth: 380,
  background: props.theme.palette.primary.main,
  border: "1px solid #3D3D3D",
  boxSizing: "border-box",
  marginBottom: 16,
  borderRadius: "0px",
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
  padding: "0 25px",
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
  textAlign: "left",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      back: {
        text: "BACK",
        handler: () => history.push("/explorer"),
      },
    });
  }, [dispatch, history]);

  const selectTemplate = useCallback(
    (template: DAOTemplate) => {
      dispatch({
        type: ActionTypes.UPDATE_TEMPLATE,
        template,
      });

      history.push("dao");
    },
    [dispatch, history]
  );

  return (
    <Box>
      <Box textAlign={isMobile ? "center" : "left"}>
        <Typography variant="h3" color="textSecondary">
          Select template
        </Typography>
        <Phrase variant="subtitle1" color="textSecondary">
          Create an organization by picking a template below.
        </Phrase>
        <Grid container direction="row" justify="center" wrap="wrap">
          <Grid item>
            <CustomCard>
              <CustomCardContent>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={5}>
                    <Circle />
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Treasury
                    </Typography>
                  </Grid>
                </Grid>
                <Subtitle variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Subtitle>
              </CustomCardContent>
              <FooterContainer onClick={() => selectTemplate("treasury")}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  display="block"
                  style={{ margin: "auto" }}
                >
                  USE TEMPLATE
                </Typography>
              </FooterContainer>
            </CustomCard>
          </Grid>
          <Grid item>
            <CustomCard>
              <CustomCardContent>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={5}>
                    <Circle />
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Registry
                    </Typography>
                  </Grid>
                </Grid>
                <Subtitle variant="subtitle1" color="textSecondary">
                  Non-profits, Companies, Founders
                </Subtitle>
              </CustomCardContent>
              <FooterContainer onClick={() => selectTemplate("registry")}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  display="block"
                  style={{ margin: "auto" }}
                >
                  USE TEMPLATE
                </Typography>
              </FooterContainer>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
