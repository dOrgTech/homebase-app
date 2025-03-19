import { styled, Typography } from "@material-ui/core"

export const SubtitleText = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.light,
  width: "875px",
  fontWeight: 300,
  maxHeight: "200px",
  overflowY: "scroll",

  ["@media (max-width:1166px)"]: {
    width: "75.3vw"
  },

  ["@media (max-width:1138px)"]: {
    width: "100%"
  },

  ["@media (max-width:599.98px)"]: {
    width: "100%",
    margin: "-15px auto 0 auto"
  }
}))
