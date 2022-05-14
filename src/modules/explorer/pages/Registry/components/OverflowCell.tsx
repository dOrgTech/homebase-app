import { TableCell } from "@material-ui/core"
import styled from "@material-ui/core/styles/styled"

export const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})
