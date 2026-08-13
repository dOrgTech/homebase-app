import React from "react"
import { Box, styled } from "@mui/material"
import { Close } from "@mui/icons-material"

const CloseIcon = styled(Close)({
  cursor: "pointer",
  width: "18px",
  color: "#ffff",
  marginTop: "-5px"
})

export const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Box onClick={onClose}>
      <CloseIcon />
    </Box>
  )
}

export default CloseButton
