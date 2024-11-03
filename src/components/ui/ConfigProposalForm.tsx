import { Grid, Typography, styled, CircularProgress } from "@material-ui/core"
import { CheckOutlined } from "@material-ui/icons"

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
