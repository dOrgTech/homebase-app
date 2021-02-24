import { Box, BoxProps, styled } from "@material-ui/core";
import React from "react";
import { getBlockie } from "services/contracts/utils";

const StyledBox = styled(Box)(({ address }: { address: string }) => ({
  width: 23,
  height: 23,
  borderRadius: "3px",
  background: `url(${address})`,
}));

export const Blockie = ({
  address,
  ...props
}: BoxProps & { address: string }) => {
  return <StyledBox address={getBlockie(address)} {...props} />;
};
