import React, { useState } from "react"
import { Box, Tooltip, styled } from "@material-ui/core"
import CopyIcon from "assets/img/copy_icon.svg?react"

const TooltipButton = styled(Tooltip)({
  cursor: "pointer"
})

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box
      marginTop="auto"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }}
    >
      <TooltipButton placement="bottom" title={!copied ? "Copy to Clipboard" : "Copied!"}>
        <CopyIcon />
      </TooltipButton>
    </Box>
  )
}
