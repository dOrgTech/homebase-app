import React, { Fragment } from "react"
import { Button, styled } from "@material-ui/core"
import { OptionsObject, useSnackbar } from "notistack"
import { Close, OpenInNew } from "@material-ui/icons"
import { ExternalLink } from "modules/common/ExternalLink"

const CloseIcon = styled(Close)({
  color: "#fff"
})

const ExpandIcon = styled(OpenInNew)({
  color: "#fff",
  fontSize: 25
})

const NotificationActions = ({ detailsLink, onClose }: { detailsLink?: string; onClose: () => void }) => (
  <Fragment>
    {detailsLink ? (
      <ExternalLink link={detailsLink}>
        <ExpandIcon />
      </ExternalLink>
    ) : null}
    <Button onClick={onClose}>
      <CloseIcon />
    </Button>
  </Fragment>
)

interface NotificationParams extends OptionsObject {
  message: string
  detailsLink?: string
}

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const open = ({ message, detailsLink, ...options }: NotificationParams) => {
    const key = enqueueSnackbar(message, {
      ...options,
      persist: false,
      action: <NotificationActions detailsLink={detailsLink} onClose={() => closeSnackbar(key)} />
    })

    return { key, closeSnackbar }
  }

  return open
}
