import { Grid, Box, Typography, Button, Link, styled, TextField, Theme } from "@material-ui/core";
import React, { useState } from "react";

const StyledInput = styled(TextField)(({ theme }: { theme: Theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 8,
    background: theme.palette.primary.main,
    height: 54,
    padding: "7px 20px",
    textAlign: "initial",
  },
}));

const ButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  width: "100%",
});

export const MigrationCreateStep: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [daoAddress, setDaoAddress] = useState<string>("");
  return (
    <Grid container>
      <Box>
        <Typography variant='subtitle2' color='textPrimary'>
          Go to{" "}
          <Link target='_blank' href='https://tezos-homebase.io/' color='secondary'>
            tezos-homebase.io
          </Link>{" "}
          and start the creation process for you DAO.
        </Typography>
      </Box>
      <Box marginTop={2}>
        <Typography variant='subtitle2' color='textPrimary'>
          When you&apos;re finished, please paste your DAO&apos;s address here:
        </Typography>
      </Box>
      <Box marginTop={2} style={{ width: "100%" }}>
        <StyledInput
          type='text'
          placeholder='KT1...'
          value={daoAddress}
          InputProps={{ disableUnderline: true }}
          onChange={(newValue) => setDaoAddress(newValue.target.value)}
        />
      </Box>
      <ButtonContainer>
        <Button variant='contained' color='secondary' onClick={onClick}>
          Continue
        </Button>
      </ButtonContainer>
    </Grid>
  );
};
