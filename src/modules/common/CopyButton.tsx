import React, { useState } from "react"
import { Box, styled, Tooltip } from "@material-ui/core"
import { FileCopyOutlined } from "@material-ui/icons"

const CopyIcon = styled(FileCopyOutlined)({
  cursor: "pointer"
})

export const CopyButton: React.FC<{ text: string; style?: any }> = ({ text, style }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box
      padding="5px 0 0 10px"
      marginTop="auto"
      onClick={e => {
        e.preventDefault()
        navigator.clipboard.writeText(text)
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }}
    >
      <Tooltip style={style} placement="bottom" title={!copied ? "Copy to Clipboard" : "Copied!"}>
        <CopyIcon color="secondary" fontSize="small" />
      </Tooltip>
    </Box>
  )
}
