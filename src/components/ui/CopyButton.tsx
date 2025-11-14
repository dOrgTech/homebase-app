import React, { useState } from "react"
import { Box, Tooltip, styled } from "@material-ui/core"
import { ReactComponent as CopyIcon } from "assets/img/copy_icon.svg"

const TooltipButton = styled(Tooltip)({
  cursor: "pointer"
})

type CopyButtonProps = {
  text: string
  ariaLabel?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, ariaLabel }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box
      role="button"
      aria-label={ariaLabel || "Copy"}
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
