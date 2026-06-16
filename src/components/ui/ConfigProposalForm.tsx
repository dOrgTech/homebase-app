import { Grid, Typography, styled, CircularProgress } from "@mui/material"
import { CheckOutlined } from "@mui/icons-material"

const StyledRow = styled(Grid)({
  marginTop: 30
})

const LoadingContainer = styled(Grid)({
  minHeight: 651
})

const LoadingStateLabel = styled(Typography)({
  marginTop: 40
})

const CheckIcon = styled(CheckOutlined)({
  fontSize: 169
})

export { StyledRow, LoadingContainer, LoadingStateLabel, CheckIcon }
