import React, { useContext } from "react";
import {
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import { ActionTypes, ModalsContext } from "../ModalsContext";
import { useParams } from "react-router";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  minHeight: 104,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

export const Header: React.FC<{
  name: string;
}> = ({ name }) => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <StyledContainer container direction="row">
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" color="secondary">
          {name}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Treasury
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        container
        justify={isMobileExtraSmall ? "flex-start" : "flex-end"}
      >
        <Grid item>
          <StyledButton
            variant="outlined"
            onClick={() => {
              dispatch({
                type: ActionTypes.OPEN_TREASURY_PROPOSAL,
                payload: {
                  daoAddress: id,
                },
              });
            }}
          >
            NEW PROPOSAL
          </StyledButton>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};
