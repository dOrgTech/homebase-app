import React from "react"
import { useTheme, useMediaQuery, Dialog, styled, Grid, Typography, Theme } from "@material-ui/core"
import { BottomSheet } from "./BottomSheet"

const Content = styled(Grid)({
  padding: "41px 46px"
})

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer"
})

const TitleText = styled(Typography)({
  color: ({ theme, customColor }: { theme: Theme; customColor?: string }) => customColor || theme.palette.text.primary
})

export const ResponsiveDialog: React.FC<{
  open: boolean
  onClose: () => void
  title?: string
  customTitleColor?: string
}> = ({ open, onClose, customTitleColor, title, children }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  return isSmall ? (
    <BottomSheet open={open} onDismiss={() => onClose()}>
      <Content container direction={"column"} style={{ gap: 46 }}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            {title && (
              <TitleText variant={"h4"} customColor={customTitleColor}>
                {title}
              </TitleText>
            )}
          </Grid>
          <Grid item>
            <CloseButton color="textPrimary" align="right" onClick={onClose}>
              X
            </CloseButton>
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </Content>
    </BottomSheet>
  ) : (
    <Dialog open={open} onClose={() => onClose()}>
      <Content container direction={"column"} style={{ gap: 46 }}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            {title && (
              <Typography variant={"h4"} color={"textPrimary"}>
                {title}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <CloseButton color="textPrimary" align="right" onClick={onClose}>
              X
            </CloseButton>
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </Content>
    </Dialog>
  )
}

export const ProposalFormResponsiveDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
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
