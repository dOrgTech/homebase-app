import { styled } from "@material-ui/core"

const PageLayout = styled("div")(({ theme }) => ({
  background: theme.palette.primary.dark,
  width: "1000px",
  margin: "42px auto 0px auto",
  minHeight: "calc(100vh - 200px)",

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {
    marginTop: 0
  }
}))

export { PageLayout }
