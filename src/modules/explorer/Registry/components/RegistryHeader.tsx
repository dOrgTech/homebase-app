import React, { useContext } from "react";
import { Button, Grid, styled, Typography, withTheme } from "@material-ui/core";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useParams } from "react-router";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  height: 104,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
}));

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

export const RegistryHeader: React.FC<{
  name: string;
}> = ({ name }) => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);

  return (
    <StyledContainer container direction="row">
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="secondary">
          {name}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Registry
        </Typography>
      </Grid>
      <JustifyEndGrid item xs={6}>
        <StyledButton
          variant="outlined"
          onClick={() =>
            dispatch({
              type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
              payload: {
                isUpdate: false,
                daoAddress: id,
              },
            })
          }
        >
          NEW ITEM
        </StyledButton>
      </JustifyEndGrid>
    </StyledContainer>
  );
};
