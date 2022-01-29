import React from 'react';
import {Box, Button, Grid, styled, Typography} from "@material-ui/core";

const ButtonContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
});

export const MigrationExecutionStep: React.FC<{ onClick: () => void }> = ({onClick}) => {
    return (
        <Grid item>
            <Typography>
                Vote and execute the proposal.
            </Typography>
            <ButtonContainer>
                <Button variant='contained' color='secondary' onClick={onClick}>
                    Finish
                </Button>
            </ButtonContainer>
        </Grid>
    );
}

