import { Box, styled, Theme, Typography } from "@material-ui/core"
import React from "react"
import { ContentContainer } from "./ContentContainer"

const SecondaryText = styled("span")(({ theme }: { theme: Theme }) => ({
  color: theme.palette.secondary.main
}))

const Hero = styled(ContentContainer)({
  margin: "0 auto",
  padding: "38px 38px"
})

export const NotIndexed: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Box>
      <Hero>
        <Typography variant="subtitle1" color="textPrimary" align={"center"}>
          Your DAO with address: <br /> <SecondaryText>{address}</SecondaryText> <br /> is currently being{" "}
          <SecondaryText>indexed</SecondaryText> and will be available in a few minutes
        </Typography>
      </Hero>
    </Box>
  )
}
