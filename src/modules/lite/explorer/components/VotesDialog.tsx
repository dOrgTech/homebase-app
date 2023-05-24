import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
  Button,
  Grid
} from "@material-ui/core"
import { toShortAddress } from "services/contracts/utils"
import { FileCopyOutlined } from "@material-ui/icons"
import { Choice } from "models/Choice"
import { formatByDecimals, getTotalVoters } from "services/lite/utils"
import { useNotification } from "modules/common/hooks/useNotification"

const CustomContent = styled(DialogContent)({
  padding: "0px 54px 22px 54px !important"
})

const CustomDialogActions = styled(DialogActions)({
  justifyContent: "center !important",
  paddingBottom: 20
})

const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

const CustomTitle = styled(Typography)(({ theme }) => ({
  borderBottom: `0.3px solid ${theme.palette.primary.main}`,
  paddingBottom: 16
}))

export const VotesDialog: React.FC<{
  open: boolean
  handleClose: any
  choices: Choice[]
  symbol: string
  decimals: string
}> = ({ open, handleClose, choices, symbol, decimals }) => {
  const descriptionElementRef = React.useRef<HTMLElement>(null)
  const openNotification = useNotification()

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    openNotification({
      message: "Address copied!",
      autoHideDuration: 2000,
      variant: "info"
    })
  }

  return (
    <div>
      <Dialog
        disableEscapeKeyDown={true}
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {" "}
          <CustomTitle color="textPrimary" variant="body2">
            {getTotalVoters(choices)} Votes:
          </CustomTitle>
        </DialogTitle>
        <CustomContent>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            {choices.map((elem: Choice, index: number) => {
              {
                return elem.walletAddresses.map((choice, num) => {
                  return (
                    <Grid container direction="row" alignItems="baseline" key={`'row-'${index}${num}`}>
                      <Grid item xs={6} md={4} lg={4} xl={4} container direction="row" alignItems="center">
                        <Typography color="textPrimary"> {toShortAddress(choice.address)}</Typography>
                        <CopyIcon onClick={() => copyAddress(choice.address)} color="secondary" fontSize="inherit" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={4} xl={4} container justifyContent="center">
                        <Typography color="textPrimary" variant="body1">
                          {" "}
                          {elem.name}{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4} lg={4} xl={4} container justifyContent="flex-end">
                        <Typography color="textPrimary" variant="body1">
                          {" "}
                          {formatByDecimals(choice.balanceAtReferenceBlock, decimals)} {symbol}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                })
              }
            })}
          </DialogContentText>
        </CustomContent>
        <CustomDialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </CustomDialogActions>
      </Dialog>
    </div>
  )
}
