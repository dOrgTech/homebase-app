import { Grid, styled, Button, Box, Tooltip, useTheme } from "@material-ui/core"

export const ThemedTabButton = styled(Button)(({ active }: { active?: boolean }) => ({
  "marginRight": "8px",
  "marginBottom": "16px",
  "fontSize": "16px",
  "borderRadius": "4px",
  "backgroundColor": active ? "rgb(129, 254, 183)" : "transparent",
  "color": active ? "#000" : "#ccc",
  "&:hover": {
    backgroundColor: active ? "rgba(98, 237, 165, 0.8)" : "rgba(98, 237, 165, 0.2)"
  },
  "&.Mui-disabled": {
    color: "rgba(255, 255, 255, 0.3)"
  }
}))
