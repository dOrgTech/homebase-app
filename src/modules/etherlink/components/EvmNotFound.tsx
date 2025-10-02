import { Box, Typography } from "components/ui"
import { BackButton } from "modules/lite/components/BackButton"
import React from "react"

export const EvmNotFound: React.FC = () => {
  return (
    <Box width="100%" padding="50px">
      <BackButton />
      <Typography variant="h2" color="textSecondary" align={"center"}>
        404 Not Found
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" align={"center"}>
        The requested DAO could not be found. Please check the address and try again.
      </Typography>
    </Box>
  )
}
