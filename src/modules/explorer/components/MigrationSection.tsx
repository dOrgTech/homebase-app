import React, { Fragment, useState } from "react";
import { Box, Button, Grid, styled, Typography } from "@material-ui/core";
import { MigrationModalForm } from "./MigrationModalForm";

const MigrationContainer = styled(Grid)(({ theme }) => ({
  minHeight: "200px",
  padding: "38px 55px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
}));

export const MigrationSection: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <Fragment>
      <MigrationContainer container>
        <Box>
          <Typography variant='subtitle1' color='textPrimary'>
            Homebase V2 is now available!
          </Typography>
        </Box>
        <Box marginTop={4}>
          <Typography variant='subtitle2' color='textPrimary'>
            Homebase is now live on V2! More copy text would go here explaining any changes, why they’d want to
            migrate,etc.
          </Typography>
        </Box>
        <Box marginTop={3}>
          <Button variant='contained' color='secondary' onClick={() => setShowModal(true)}>
            Migrate to V2
          </Button>
        </Box>
      </MigrationContainer>
      <MigrationModalForm showModal={showModal} onClose={() => setShowModal(false)} />
    </Fragment>
  );
};
