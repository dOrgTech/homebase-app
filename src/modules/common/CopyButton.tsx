import React, { useState } from "react"
import { Box, styled, Tooltip } from "@material-ui/core"
import { FileCopyOutlined, Image } from "@material-ui/icons"
import DownloadIcon from "assets/img/download.svg"

const CopyIcon = styled("img")({
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
        <CopyIcon src={DownloadIcon} />
      </Tooltip>
    </Box>
  )
}
