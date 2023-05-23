import React from "react"
import { useTheme, useMediaQuery, Dialog, styled, Grid, Typography, makeStyles } from "@material-ui/core"
import { BottomSheet } from "./BottomSheet"
import CloseButton from "modules/common/CloseButton"
import BackButton from "modules/common/BackButton"

const Content = styled(Grid)({
  padding: "41px 46px"
})

const TitleText = styled(Typography)({
  color: "#ffff",
  fontWeight: 550,
  lineHeight: ".80",
  textTransform: "capitalize"
})

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthMd": {
    width: "-webkit-fill-available",
    height: "-webkit-fill-available"
  },
  "& .MuiDialog-paperWidthXs": {
    width: "-webkit-fill-available",
    height: "auto",
    maxWidth: "960px !important"
  }
})

export const ResponsiveDialog: React.FC<{
  open: boolean
  onClose: () => void
  onGoBack?: () => void
  title?: string
  customTitleColor?: string
  template?: "xs" | "md" | "sm"
  children: any
}> = props => {
  const { open, onClose, onGoBack, title, children, template = "sm" } = props
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return isSmall ? (
    <BottomSheet open={open} onDismiss={onClose}>
      <Content container direction="column" style={{ gap: 46 }}>
        <Grid item container direction="row" wrap="nowrap" justifyContent="space-between">
          <Grid item>{onGoBack ? <BackButton onGoBack={onGoBack} /> : null}</Grid>
          <Grid item>
            <TitleText>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={onClose} />
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </Content>
    </BottomSheet>
  ) : (
    <CustomDialog open={open} onClose={onClose} maxWidth={template}>
      <Content container direction="column" style={{ gap: 30 }}>
        <Grid item container direction="row" wrap="nowrap" justifyContent="space-between">
          <Grid item>{onGoBack ? <BackButton onGoBack={onGoBack} /> : null}</Grid>
          <Grid item>
            <TitleText color="textPrimary">{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={onClose} />
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </Content>
    </CustomDialog>
  )
}

export const ProposalFormResponsiveDialog: React.FC<{ open: boolean; onClose: () => void; children: any }> = ({
  open,
  onClose,
  children
}) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return isSmall ? (
    <BottomSheet open={open} onDismiss={onClose}>
      {children}
    </BottomSheet>
  ) : (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  )
}
