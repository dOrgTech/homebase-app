import React from "react"
import {useTheme, useMediaQuery, Dialog, styled, Grid, Typography, Theme} from "@material-ui/core";
import {BottomSheet} from "./BottomSheet";
import CloseButton from "modules/common/CloseButton";

const Content = styled(Grid)({
  padding: "41px 46px",
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
  lineHeight: ".80"
})

export const ResponsiveDialog: React.FC<{ open: boolean; onClose: () => void; title?: string; customTitleColor?: string }> = ({
                                                                                                                                open,
                                                                                                                                onClose,
                                                                                                                                title,
                                                                                                                                children,
                                                                                                                              }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return isSmall ? (
    <BottomSheet open={open} onDismiss={() => onClose()}>
      <Content container direction={"column"} style={{gap: 46}}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            <TitleText>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={() => onClose()}/>
          </Grid>
        </Grid>
        <Grid item>
          {children}
        </Grid>
      </Content>
    </BottomSheet>
  ) : (
    <Dialog open={open} onClose={() => onClose()}>
      <Content container direction={"column"} style={{gap: 30}}>
        <Grid item container direction="row" wrap={"nowrap"} justifyContent={"space-between"}>
          <Grid item>
            <TitleText color={"textPrimary"}>{title}</TitleText>
          </Grid>
          <Grid item>
            <CloseButton onClose={() => onClose()} />
          </Grid>
        </Grid>
        <Grid item>
          {children}
        </Grid>
      </Content>
    </Dialog>
  );
};

export const ProposalFormResponsiveDialog: React.FC<{ open: boolean; onClose: () => void; }> = ({
                                                                                                open,
                                                                                                onClose,
                                                                                                children,
                                                                                              }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return isSmall ? (
    <BottomSheet open={open} onDismiss={() => onClose()}>
      {children}
    </BottomSheet>
  ) : (
    <Dialog open={open} onClose={() => onClose()}>
      {children}
    </Dialog>
  );
};