import React from "react"
import { Box, styled } from "@material-ui/core"
import { ArrowBack } from "@material-ui/icons"

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
