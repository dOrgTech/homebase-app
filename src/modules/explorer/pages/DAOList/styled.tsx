import React from "react"
import { Button, Grid, styled, Theme } from "@material-ui/core"

const PageContainer = styled("div")(({ theme }) => ({
  width: "1000px",
  height: "100%",
  margin: "auto",

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {}
}))

const StyledTab = styled(({ isSelected, ...other }: any) => <Button {...other} />)(
  ({ theme, isSelected }: { theme: Theme; isSelected?: boolean }) => ({
    "fontSize": 18,
    "height": 40,
    "fontWeight": 400,
    "paddingLeft": 20,
    "paddingRight": 20,
    "paddingTop": 0,
    "paddingBottom": 0,
    "borderRadius": 8,
    "color": isSelected ? theme.palette.secondary.main : "#fff",
    "backgroundColor": isSelected ? "rgba(129, 254, 183, 0.20)" : "inherit",
    "&:hover": {
      backgroundColor: isSelected ? "rgba(129, 254, 183, 0.20)" : theme.palette.secondary.dark,
      borderRadius: 8,
      borderTopLeftRadius: "8px !important",
      borderTopRightRadius: "8px !important",
      borderBottomLeftRadius: "8px !important",
      borderBottomRightRadius: "8px !important"
    }
  })
)

const Search = styled(Grid)({
  width: "49.5%",

  ["@media (max-width: 645px)"]: {
    width: "100%",
    marginTop: "14px"
  }
})

const DAOItemGrid = styled(Grid)({
  gap: "30px",
  minHeight: "50vh",
  justifyContent: "space-between",
  ["@media (max-width: 1155px)"]: {
    gap: "32px"
  },

  ["@media (max-width:960px)"]: {
    gap: "20px"
  },

  ["@media (max-width:830px)"]: {
    width: "86vw",
    gap: "20px"
  }
})

const DAOItemCard = styled(Grid)({
  flexBasis: "48.5%",

  ["@media (max-width:1500px)"]: {
    flexBasis: "48.5%"
  },

  ["@media (max-width:1200px)"]: {
    flexBasis: "47.5%"
  },

  ["@media (max-width:760px)"]: {
    minWidth: "100%"
  }
})

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 16
}))

export { PageContainer, StyledTab, Search, DAOItemGrid, DAOItemCard, TabsContainer }
