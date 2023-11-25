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
  Grid,
  useTheme,
  useMediaQuery
} from "@material-ui/core"
import { toShortAddress } from "services/contracts/utils"
import { FileCopyOutlined } from "@material-ui/icons"
import { Choice } from "models/Choice"
import { formatByDecimals, getTotalVoters } from "services/lite/utils"
import { useNotification } from "modules/common/hooks/useNotification"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"

const CustomContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  display: "grid",
  marginTop: 24,
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    display: "inline",
    paddingTop: "0px !important"
  }
}))

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "flex-end !important",
  paddingBottom: 20,
  [theme.breakpoints.down("sm")]: {
    marginTop: 46
  }
}))

const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

const Row = styled(Grid)(({ theme }) => ({
  "background": theme.palette.primary.main,
  "padding": "24px 48px",
  "paddingBottom": "0px",
  "borderBottom": "0.3px solid #7D8C8B",
  "&:last-child": {
    borderRadius: "0px 0px 8px 8px",
    borderBottom: "none"
  },
  "&:first-child": {
    borderRadius: "8px 8px 0px 0px"
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px 24px"
  }
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

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

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
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        title={`${getTotalVoters(choices)} Votes: `}
        template="xs"
      >
        <CustomContent>
          {choices.map((elem: Choice, index: number) => {
            {
              return elem.walletAddresses.map((choice, num) => {
                return (
                  <Row
                    container
                    direction={isMobileSmall ? "column" : "row"}
                    alignItems="baseline"
                    key={`'row-'${index}${num}`}
                  >
                    <Grid
                      item
                      xs={12}
                      md={4}
                      lg={4}
                      xl={4}
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent={isMobileSmall ? "center" : "flex-start"}
                    >
                      <Typography color="textPrimary"> {toShortAddress(choice.address)}</Typography>
                      <CopyIcon onClick={() => copyAddress(choice.address)} color="secondary" fontSize="inherit" />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} xl={4} container justifyContent="center">
                      <Typography color="textPrimary" variant="body1">
                        {" "}
                        {elem.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      lg={4}
                      xl={4}
                      container
                      justifyContent={isMobileSmall ? "center" : "flex-end"}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {" "}
                        {formatByDecimals(choice.balanceAtReferenceBlock, decimals)} {symbol}{" "}
                      </Typography>
                    </Grid>
                  </Row>
                )
              })
            }
          })}
        </CustomContent>
        <CustomDialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </CustomDialogActions>
      </ResponsiveDialog>
    </div>
  )
}
