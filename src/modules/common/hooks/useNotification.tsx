import React, { Fragment } from "react";
import { Button, Typography } from "@material-ui/core";
import { OptionsObject, useSnackbar } from "notistack";
import { Close } from "@material-ui/icons"
import { ExternalLink } from "modules/common/ExternalLink";

const NotificationActions = ({
  detailsLink,
  onClose,
}: {
  detailsLink?: string;
  onClose: () => void;
}) => (
  <Fragment>
    {detailsLink ? (
      <ExternalLink link={detailsLink}>
        <Typography>View Details</Typography>
      </ExternalLink>
    ) : null}
    <Button onClick={onClose}>
      <Typography>Dismiss</Typography>
    </Button>
  </Fragment>
);

interface NotificationParams extends OptionsObject {
  message: string;
  detailsLink?: string;
}

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const open = ({ message, detailsLink, ...options }: NotificationParams) => {
    const key = enqueueSnackbar(message, {
      ...options,
      persist: true,
      action: (
        <NotificationActions
          detailsLink={detailsLink}
          onClose={() => closeSnackbar(key)}
        />
      ),
    });

    return { key, closeSnackbar };
  };

  return open;
};
