import {
  Dialog,
  Grid,
  Typography,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
  styled,
  TextField,
} from "@material-ui/core";
import { Formik, Form, FieldArray, Field } from "formik";
import React, { useCallback } from "react";
import { Switch, useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

const Title = styled(DialogTitle)({
  borderBottom: "2px solid #3D3D3D",
  height: 30,
  paddingTop: 28,
  minWidth: 500,
});

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const SendContainer = styled(Grid)({
  height: 55,
});

const ListItem = styled(Grid)({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #3D3D3D",
  padding: "0px 24px",
});

const TokenAddress = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: "#4BCF93",
  fontWeight: 400,
}));

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

interface Values {
  registries: Record<string, string>[];
  agoraPostId: number;
}

const INITIAL_FORM_VALUES: Values = {
  registries: [],
  agoraPostId: 0,
};

export const NewRegistryProposalDialog = () => {
  const [open, setOpen] = React.useState(false);

  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = useCallback(() => {
    console.log("si");
  }, []);

  return (
    <div>
      <StyledButton
        variant="outlined"
        onClick={handleClickOpen}
        disabled={!dao}
      >
        NEW PROPOSAL
      </StyledButton>
      {dao && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Title id="alert-dialog-title" color="textSecondary">
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Typography variant="subtitle1" color="textSecondary">
                  REGISTRY ITEM
                </Typography>
              </Grid>
              <Grid item>
                <CloseButton
                  color="textSecondary"
                  align="right"
                  onClick={handleClose}
                >
                  X
                </CloseButton>
              </Grid>
            </Grid>
          </Title>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ListItem container direction="row" justify="space-evenly">
                <Grid item>
                  <Typography variant="subtitle1" color="textSecondary">
                    {dao.unfrozenToken.symbol}
                  </Typography>
                </Grid>
                <Grid item>
                  <TokenAddress>{dao.address}</TokenAddress>
                </Grid>
              </ListItem>

              <Formik initialValues={INITIAL_FORM_VALUES} onSubmit={onSubmit}>
                {({ submitForm, values }) => (
                  <Form autoComplete="off">
                    <ListItem container direction="row">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Agora Post ID
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <SwitchContainer item xs={12} justify="flex-end">
                          <Field
                            name={`agoraPostId`}
                            type="number"
                            placeholder="Type an Agora Post ID"
                            component={CustomTextField}
                          />
                        </SwitchContainer>
                      </Grid>
                    </ListItem>

                    

                    <SendContainer container direction="row" justify="center">
                      <Button onClick={submitForm}>
                        <Typography variant="subtitle1" color="textSecondary">
                          SEND
                        </Typography>
                      </Button>
                    </SendContainer>
                  </Form>
                )}
              </Formik>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
