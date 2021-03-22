import React from "react";
import { styled, Typography } from "@material-ui/core";

const RightText = styled(Typography)({
  opacity: 0.8,
  fontWeight: 400,
});

const LeftText = styled(Typography)({
  fontWeight: 700,
});

export const ProposalTableHeadText: React.FC<{ align: any }> = ({
  children,
  align,
}) =>
  align === "left" ? (
    <LeftText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </LeftText>
  ) : (
    <RightText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </RightText>
  );
