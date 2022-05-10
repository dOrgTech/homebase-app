import {
    styled,
    Button,
  } from "@material-ui/core";

export const MainButton = styled(Button)({
    fontSize: "18px",

    ["@media (max-width:1030px)"]: { 
        fontSize: "16px",
      },
  });