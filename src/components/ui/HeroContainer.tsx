import { styled } from "@material-ui/core"
import { ContentContainer } from "./ContentContainer"

export const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: 38,
  [theme.breakpoints.down("sm")]: {
    width: "inherit"
  }
}))
