import React from "react"
import { useTheme, useMediaQuery, Dialog, styled, Grid, Typography } from "@material-ui/core"
import { BottomSheet } from "./BottomSheet"
import CloseButton from "modules/common/CloseButton"
import BackButton from "modules/common/BackButton"

const Content = styled(Grid)({
  padding: "40px 48px"
})

const TitleText = styled(Typography)(({ theme }) => ({
  color: "#ffff",
  fontWeight: 600,
  lineHeight: "1.2",
  textTransform: "capitalize",
  fontSize: 24,
  [theme.breakpoints.down("sm")]: {
    fontSize: 20
  }
}))

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthMd": {
    width: "-webkit-fill-available",
    height: "-webkit-fill-available"
  },
  "& .MuiDialog-paperWidthXs": {
    width: "-webkit-fill-available",
    height: "auto",
    maxWidth: "960px !important"
  },
  "& .MuiDialog-paperWidthLg": {
    width: "-webkit-fill-available",
    height: "max-content",
    maxWidth: "960px !important"
  }
})

export const ResponsiveDialog: React.FC<{
  open: boolean
  onClose: () => void
  onGoBack?: () => void
  title?: string
  customTitleColor?: string
  template?: "xs" | "md" | "sm" | "lg"
  children: any
}> = props => {
  const { open, onClose, onGoBack, title, children, template = "sm" } = props
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return isSmall ? (
    <BottomSheet open={open} onDismiss={onClose}>
      <Content
        container
        direction="column"
        style={template !== "sm" ? { gap: 46, paddingBottom: 100 } : { gap: 20, paddingBottom: 100 }}
      >
        <Grid item container direction="row" justifyContent="space-between">
          {onGoBack !== undefined ? (
            <Grid item>
              {" "}
              <BackButton onGoBack={onGoBack} />
            </Grid>
          ) : null}
          <Grid item>
            <TitleText>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={onClose} />
          </Grid>
        </Grid>
        <Grid item style={{ width: "inherit" }}>
          {children}
        </Grid>
      </Content>
    </BottomSheet>
  ) : (
    <CustomDialog
      open={open}
      onClose={(event: any, reason) => {
        // TODO: Comment this while creating PR
        if (reason && reason === "backdropClick") return
        onClose()
      }}
      maxWidth={template}
    >
      <Content container direction="column" style={{ gap: 30 }}>
        <Grid item container direction="row" wrap="nowrap" justifyContent="space-between">
          {onGoBack !== undefined ? (
            <Grid item>
              {" "}
              <BackButton onGoBack={onGoBack} />
            </Grid>
          ) : null}{" "}
          <Grid item>
            <TitleText color="textPrimary">{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={onClose} />
          </Grid>
        </Grid>
        {children}
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
