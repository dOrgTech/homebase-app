import { styled } from "@material-ui/core";
import { ResponsiveTableContainer } from "./ResponsiveTable";

export const ResponsiveGenericTable = styled(ResponsiveTableContainer)(
  ({ theme }) => ({
    width: "100%",
    padding: "72px 0%",
    boxSizing: "border-box",
    paddingBottom: "24px",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
      borderBottom: `2px solid ${theme.palette.primary.light}`,
    },
    "& #demo": {
      margin: "0 8%",
      width: "auto",
      [theme.breakpoints.down("sm")]: {
        marginTop: 25,
      },
    },
  })
);
