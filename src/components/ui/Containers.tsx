import { Grid, Typography, styled } from "@mui/material"

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
})

const ContainerTitle = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

export { LoaderContainer, ContainerTitle }
