import React from "react";
import { Grid, Box, Typography, Button, styled } from "@material-ui/core";

const ButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  width: "100%",
});

export const MigrationInitialStep: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Grid container>
      <Box>
        <Typography variant='subtitle2' color='textPrimary'>
          Homebase is now live on V2! More copy text would go here explaining any changes, why they’d want to
          migrate,etc.
        </Typography>
      </Box>
      <Box marginTop={4}>
        <Typography variant='subtitle2' color='textPrimary'>
          You can start the migration process by clicking on the button below!
        </Typography>
      </Box>
      <ButtonContainer>
        <Button variant='contained' color='secondary' onClick={onClick}>
          Migrate to V2
        </Button>
      </ButtonContainer>
    </Grid>
  );
};
