import { Button, styled } from "@material-ui/core";

export const SmallButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  borderRadius: "4px",
  borderWidth: 2,
}));
