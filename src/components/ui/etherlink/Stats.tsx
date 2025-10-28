import { Grid, Typography, Paper, styled } from "@material-ui/core"

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#24282d",
  borderRadius: 8,
  color: theme.palette.text.primary,
  height: 84,
  display: "flex",
  padding: "33px 40px 30px 40px",
  flexDirection: "column",
  gap: 8
}))

export const ItemContent = styled(Grid)({
  gap: 8
})

export const ItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  [theme.breakpoints.down("md")]: {
    fontSize: 15
  }
}))

export const ItemValue = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 300,
  overflowX: "scroll",
  cursor: "default",
  [theme.breakpoints.down("sm")]: {
    fontSize: 28
  }
}))
