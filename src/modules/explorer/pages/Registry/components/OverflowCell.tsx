import { TableCell } from "@mui/material"
import { styled } from "@mui/material/styles"

export const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})
