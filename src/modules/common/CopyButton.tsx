import React, { useState } from "react"
import { Box, Grid, styled, Tooltip, Typography } from "@material-ui/core"
import DownloadIcon from "assets/img/download.svg?react"

const CopyIcon = styled("img")({
  cursor: "pointer"
})

export const CopyButton: React.FC<{ text: string; style?: any; displayedText?: string }> = ({
  text,
  style,
  displayedText
}) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box
      style={{ cursor: "pointer" }}
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
        <Grid container direction="row">
          <CopyIcon style={style} src={DownloadIcon} />
          <Typography variant="body2" color="secondary">
            {" "}
            {displayedText}
          </Typography>
        </Grid>
      </Tooltip>
    </Box>
  )
}
