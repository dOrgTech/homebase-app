import { Box, BoxProps, styled } from "@material-ui/core"
import React from "react"
import { getBlockie } from "services/contracts/utils"

const StyledBox = styled(Box)(({ address, size }: { address: string; size?: number }) => ({
  width: size || 23,
  height: size || 23,
  minWidth: size || 23,
  maxHeight: size || 23,
  borderRadius: "50%",
  background: `url(${address})`,
  backgroundSize: "contain"
}))

export const Blockie = ({ address, size, ...props }: BoxProps & { address: string; size?: number }) => {
  return <StyledBox address={getBlockie(address.toLowerCase())} size={size} {...props} />
}
