import React, { Fragment, useCallback } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { OptionsObject, useSnackbar } from "notistack";
import { TransactionWalletOperation } from "@taquito/taquito";

interface NotificationActionsParams {
  onOpenDetails: (a: string) => void;
}

const NotificationActions = ({
  onOpenDetails,
}: {
  onOpenDetails: () => void;
}) => (
  <Fragment>
    <Button onClick={onOpenDetails}>
      <Typography>View Details</Typography>
    </Button>
    <Button>
      <Typography>Dismiss</Typography>
    </Button>
  </Fragment>
);

interface NotificationParams extends NotificationActionsParams, OptionsObject {
  transactionObject: TransactionWalletOperation;
  message: string;
}

export const useNotification = (handleDetail: (key: string) => void) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const open = async ({
    transactionObject,
    message,
    ...options
  }: NotificationParams) => {
    const t = transactionObject.opHash;
    const handler = () => handleDetail(t);

    console.log("opening notif...");
    const key = enqueueSnackbar(message, {
      ...options,
      action: <NotificationActions onOpenDetails={handler} />,
    });
    console.log("opened notif...");
    await transactionObject.confirmation(1);
    console.log("closing...");
    closeSnackbar(key);
  };

  return open;
};
