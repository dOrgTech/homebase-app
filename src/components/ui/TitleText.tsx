import { styled, Typography } from "@material-ui/core"

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 36,
  fontWeight: 600,
  lineHeight: 0.8,

  ["@media (max-width:642px)"]: {
    fontSize: 35
  },

  ["@media (max-width:583px)"]: {
    fontSize: 30
  },

  ["@media (max-width:533px)"]: {
    fontSize: 25
  },

  ["@media (max-width:462px)"]: {
    fontSize: 22
  }
}))
