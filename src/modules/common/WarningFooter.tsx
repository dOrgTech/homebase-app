import { Box, Grid, IconButton, Typography, styled } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { ReactComponent as WarningIcon } from "assets/logos/warning.svg"
import CloseIcon from "@material-ui/icons/Close"
import hexToRgba from "hex-to-rgba"

const Container = styled(Box)({
  position: "fixed",
  width: "100%",
  minHeight: 92,
  bottom: 0,
  background: hexToRgba("#746438", 0.95),
  boxSizing: "border-box",
  padding: "25px 50px",
  color: "#FFC839",
  zIndex: 10000
})

const ContainerText = styled(Typography)({
  maxWidth: 1160,
  fontWeight: 400,
  color: "inherit",
  fontSize: "18px",

  ["@media (max-width:1030px)"]: {
    fontSize: "16px"
  }
})

export const WarningFooter: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(true)

  // use this to make the warning come only once
  // const isWarningClosed = localStorage.getItem("warning-closed")
  const isWarningClosed = null

  const closeButton = () => {
    localStorage.setItem("warning-closed", "true")
    setOpen(false)
  }

  return (
    <>
      {open && !isWarningClosed && isWarningClosed !== "true" && (
        <Container>
          <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
            <Grid item>
              <WarningIcon fill="#FFC839" />
            </Grid>
            <Grid item style={{ marginRight: "10px" }}></Grid>
            <Grid item>
              <ContainerText align="center">{text}</ContainerText>
            </Grid>
            <Grid item>
              <IconButton onClick={closeButton}>
                <CloseIcon htmlColor="#FFC839" />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  )
}
