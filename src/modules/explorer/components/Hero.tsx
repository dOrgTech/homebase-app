import { Grid, GridProps, styled } from "@material-ui/core"
import React from "react"
import { ContentContainer } from "./ContentContainer"

const Container = styled(ContentContainer)({
  "padding": "38px 38px",
  "boxSizing": "border-box",

  "& > *": {
    height: "100%"
  }
})

export const Hero: React.FC<GridProps> = ({ children, ...props }) => {
  return (
    <Container item {...props}>
      <Grid container justifyContent="space-between" alignItems="center">
        {children}
      </Grid>
    </Container>
  )
}
