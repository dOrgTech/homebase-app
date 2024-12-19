import { MainButton } from "modules/common/MainButton"
import { styled } from "@material-ui/core"

export const NextButton = styled(MainButton)(({ theme }) => ({
  textAlign: "center",
  float: "right",
  cursor: "pointer",
  background: theme.palette.secondary.light,
  padding: "8px 16px"
}))
