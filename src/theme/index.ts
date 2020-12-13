import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.5)",
    },
  },
  typography: {
    h1: {
      color: "#000000",
      fontSize: 25,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
    },
    subtitle2: {
      color: "rgba(0, 0, 0, 0.5)",
      fontSize: 16,
      fontWeight: 300,
    },
    h3: {
      fontSize: 20,
    },
  },
  overrides: {
    MuiStepConnector: {
      lineVertical: {
        display: "none",
      },
    },
    MuiStepContent: {
      root: {
        borderLeft: "none",
      },
    },
    MuiStep: {
      root: {
        marginBottom: 15,
      },
    },
    MuiStepIcon: {
      active: {
        color: "#3866F9 !important",
      },
      root: {
        color: "#eeeeee",
        "&$active": {
          fill: "#3866F9",
          "& $text": {
            fill: "#fff",
          },
        },
      },
      text: {
        fill: "#000000",
      },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "none",
          transition: "none",
        },
        "&:after": {
          borderBottom: "none",
          transition: "none",
        },
      },
    },
    MuiInputBase: {
      input: {
        textAlign: "center",
      },
    },
    MuiDivider: {
      root: {
        marginTop: 16,
        marginBottom: 16,
      },
    },
  },
});
