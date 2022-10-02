import React from "react"
import { useTheme, useMediaQuery, Dialog, styled, Grid, Typography, Theme, makeStyles } from "@material-ui/core"
import { BottomSheet } from "./BottomSheet"
import CloseButton from "modules/common/CloseButton"

const Content = styled(Grid)({
  padding: "41px 46px"
})

// const CloseButton = styled(Typography)({
//   fontWeight: 400,
//   cursor: "pointer",
//   lineHeight: ".6",
//   verticalAlign: "top",
//   display: "inline"
// });

const TitleText = styled(Typography)({
  color: "#ffff",
  fontWeight: 550,
  lineHeight: ".80",
  textTransform: "capitalize"
})

const styles = makeStyles({
  selected: {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 41px"
  }
})

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthMd": {
    width: "-webkit-fill-available"
  }
})

export const ResponsiveDialog: React.FC<{
  open: boolean
  onClose: () => void
  title?: string
  customTitleColor?: string
  template?: string
  children: any
}> = ({ open, onClose, title, children, template = "" }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const style = styles()

  return isSmall ? (
    <BottomSheet open={open} onDismiss={() => onClose()}>
      <Content container direction={"column"} style={{ gap: 46 }}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            <TitleText>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={() => onClose()} />
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </Content>
    </BottomSheet>
  ) : (
    <CustomDialog open={open} onClose={() => onClose()} maxWidth={template ? "md" : "sm"}>
      <Content container direction={"column"} style={{ gap: 30 }}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            <TitleText color={"textPrimary"}>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={() => onClose()} />
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
    <BottomSheet open={open} onDismiss={() => onClose()}>
      {children}
    </BottomSheet>
  ) : (
    <Dialog open={open} onClose={() => onClose()}>
      {children}
    </Dialog>
  )
}
