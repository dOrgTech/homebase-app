import React from "react"
import { Box, styled } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"

const BackIcon = styled(ArrowBack)({
  cursor: "pointer",
  width: "18px",
  color: "#ffff",
  marginTop: "-5px"
})

export const CloseButton: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  return (
    <Box onClick={onGoBack}>
      <BackIcon />
    </Box>
  )
}

export default CloseButton
