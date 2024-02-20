import React, { useState } from "react"
import { Box, Tooltip } from "@material-ui/core"
import { ReactComponent as CopyIcon } from "assets/img/copy_icon.svg"

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
      <Tooltip placement="bottom" title={!copied ? "Copy to Clipboard" : "Copied!"}>
        <CopyIcon />
      </Tooltip>
    </Box>
  )
}
