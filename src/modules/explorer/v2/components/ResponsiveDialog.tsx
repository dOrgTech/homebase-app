import React from "react"
import { useTheme, useMediaQuery, Dialog } from "@material-ui/core";
import { BottomSheet } from "./BottomSheet";

export const ResponsiveDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
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