import { Box, styled, Theme, Typography } from "@material-ui/core"
import React from "react"

const SecondaryText = styled("span")(({ theme }: { theme: Theme }) => ({
  color: theme.palette.secondary.main
}))

export const NotIndexed: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Box width="100%" padding="50px">
      <Typography variant="subtitle1" color="textSecondary" align={"center"}>
        Your DAO with address: <br /> <SecondaryText>{address}</SecondaryText> <br /> is currently being{" "}
        <SecondaryText>indexed</SecondaryText> and will be available in a few minutes
      </Typography>
    </Box>
  )
}
