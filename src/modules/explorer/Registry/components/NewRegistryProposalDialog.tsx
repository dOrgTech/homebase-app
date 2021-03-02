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
import { char2Bytes } from "@taquito/tzip16";
import { Formik, Form, Field } from "formik";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import React, { useCallback, useContext } from "react";
import { RegistryDAO } from "services/contracts/baseDAO";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose";

const Title = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  height: 30,
  paddingTop: 28,
  minWidth: 500,
}));

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

const ListItem = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
}));

const TokenAddress = styled(Typography)(() => ({
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

export const NewRegistryProposalDialog: React.FC = () => {
  const {
    state: { daoId },
  } = useContext(ModalsContext);
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as RegistryDAO | undefined;
  const { mutate, data, error } = useRegistryPropose();
  const {
    state: {
      registryProposal: { open },
    },
    dispatch,
  } = useContext(ModalsContext);

  console.log(data, error);

  const handleClose = useCallback(() => {
    dispatch({
      type: ActionTypes.CLOSE,
      payload: {
        modal: "registryProposal",
      },
    });
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    console.log(dao);
    if (dao) {
      mutate({
        dao,
        tokensToFreeze: 2,
        agoraPostId: 0,
        items: [
          {
            key: char2Bytes("testKey"),
            newValue: char2Bytes("testValue"),
          },
        ],
      });
    }
  }, [dao, mutate]);

  return (
    <>
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
                    {dao.metadata.unfrozenToken.symbol}
                  </Typography>
                </Grid>
                <Grid item>
                  <TokenAddress>{dao.address}</TokenAddress>
                </Grid>
              </ListItem>

              <Formik initialValues={INITIAL_FORM_VALUES} onSubmit={onSubmit}>
                {({ submitForm }) => (
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
    </>
  );
};
