import { Box, Typography } from "@material-ui/core"
import React from "react"

export const NotFound: React.FC = () => {
  return (
    <Box width="100%" padding="50px">
      <Typography variant="h2" color="textSecondary" align={"center"}>
        404 Not Found
      </Typography>
    </Box>
  )
}
