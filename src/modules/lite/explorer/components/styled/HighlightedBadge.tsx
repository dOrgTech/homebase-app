import { styled, Grid } from "@material-ui/core"
import hexToRgba from "hex-to-rgba"

export const HighlightedBadge = styled(Grid)(({ theme }) => ({
  backgroundColor: hexToRgba(theme.palette.secondary.main, 0.07),
  boxSizing: "border-box",
  padding: "8px 16px",
  width: "fit-content",
  borderRadius: 4
}))
