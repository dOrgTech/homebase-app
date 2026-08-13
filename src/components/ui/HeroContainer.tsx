import { styled } from "@mui/material"
import { ContentContainer } from "./ContentContainer"

export const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: 38,
  [theme.breakpoints.down("lg")]: {
    width: "inherit"
  }
}))
