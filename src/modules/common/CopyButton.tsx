import React, { useState } from "react"
import { Box, styled, Tooltip } from "@material-ui/core"
import { FileCopyOutlined } from "@material-ui/icons"

const CopyIcon = styled(FileCopyOutlined)({
  "cursor": "pointer",
  "fontSize": 16,
  "transition": ".15s ease-out",

  "&:hover": {
    color: "#62eda5 !important",
    transition: ".15s ease-in"
  }
})

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
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
        }, 500)
      }}
    >
      <Tooltip placement="right" title={!copied ? "" : "Copied!"}>
        <CopyIcon color="secondary" fontSize="small" />
      </Tooltip>
    </Box>
  )
}
