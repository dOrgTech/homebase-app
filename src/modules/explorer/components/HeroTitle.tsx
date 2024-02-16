import { styled, Typography } from "@material-ui/core"

export const HeroTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: "9px",
  fontSize: 36,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 26
  }
}))
