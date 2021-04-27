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

import TreasuryIcon from "../../../assets/img/treasury.svg";
import RegistryIcon from "../../../assets/img/registry.svg";

const CustomCard = styled(withTheme(Grid))((props) => ({
  minHeight: 248,
  boxShadow: "none",
  maxWidth: 380,
  background: props.theme.palette.primary.main,
  border: `1px solid ${props.theme.palette.primary.light}`,
  boxSizing: "border-box",
  marginBottom: 16,
  borderRadius: "0px",
  "&:last-child": {
    marginLeft: "0px",
  },
}));

const CustomSecondCard = styled(withTheme(Grid))((props) => ({
  minHeight: 248,
  boxShadow: "none",
  maxWidth: 380,
  background: props.theme.palette.primary.main,
  border: `1px solid ${props.theme.palette.primary.light}`,
  borderLeft: 0,
  boxSizing: "border-box",
  marginBottom: 16,
  borderRadius: "0px",
  "&:last-child": {
    marginLeft: "0px",
  },
  [props.theme.breakpoints.down("md")] : {
    borderLeft: `1px solid ${props.theme.palette.primary.light}`,
  }
}));

const FooterContainer = styled(withTheme(Paper))((props) => ({
  boxShadow: "none",
  background: props.theme.palette.primary.main,
  height: 61,
  borderRadius: 0,
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  padding: "0 25px",
  borderTop: `1px solid ${props.theme.palette.primary.light}`,
  cursor: "pointer",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
    borderRight: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const Description = styled(Typography)({
  maxWidth: 225,
  minHeight: 70,
  textAlign: "center",
  marginBottom: 32,
});

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  padding: "27px 37px 0px 37px",
  "&:last-child": {
    paddingBottom: "0px",
  },
  textAlign: "left",
  minHeight: 168,
  minWidth: 280,
  [theme.breakpoints.down("xs")]: {
    minWidth: "unset",
  },
}));

const Phrase = styled(Typography)({
  marginTop: 12,
  marginBottom: 19,
});

const Subtitle = styled(Typography)({
  marginTop: 16,
  marginBottom: 8,
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
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12} container direction="row" justify="center">
                    <img src={TreasuryIcon} />
                  </Grid>
                  <Grid item xs={12} container direction="row" justify="center">
                    <Subtitle variant="subtitle1" color="textSecondary">
                      Treasury
                    </Subtitle>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Description
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    Manage resources (tez, FA2) collectively
                  </Description>
                </Grid>
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
            <CustomSecondCard>
              <CustomCardContent>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12} container direction="row" justify="center">
                    <img src={RegistryIcon} />
                  </Grid>
                  <Grid item xs={12} container direction="row" justify="center">
                    <Subtitle variant="subtitle1" color="textSecondary">
                      Registry
                    </Subtitle>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Description variant="subtitle1" color="textSecondary">
                    Govern arbitrary smart contracts, curate marketplaces, and more
                  </Description>
                </Grid>
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
            </CustomSecondCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
