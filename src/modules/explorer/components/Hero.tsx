import React from "react"
import { Grid, GridProps, styled } from "@material-ui/core"
import { ContentContainer } from "components/ui/Table"

const Container = styled(ContentContainer)({
  "padding": "0px",
  "boxSizing": "border-box",
  "background": "inherit",

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
