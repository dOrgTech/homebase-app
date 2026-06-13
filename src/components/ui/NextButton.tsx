import { MainButton } from "modules/common/MainButton"
import { styled } from "@mui/material"

export const NextButton = styled(MainButton)(({ theme }) => ({
  textAlign: "center",
  float: "right",
  cursor: "pointer",
  background: theme.palette.secondary.light,
  padding: "8px 16px"
}))
