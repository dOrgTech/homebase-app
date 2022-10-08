import { styled, Typography } from "@material-ui/core"

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: 30,
  fontWeight: 500,
  color: theme.palette.text.primary,
  lineHeight: .80,
  marginBottom: "9px",

  ["@media (max-width:1030px)"]: { 
    fontSize: 25,
  },
}))