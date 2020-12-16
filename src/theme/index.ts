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
    h2: {
      fontSize: 18,
      fontWeight: 300,
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
    MuiFormControl: {
      root: {
        width: "100%",
      },
    },
    MuiSwitch: {
      root: {
        width: 75,
        height: 50,
      },
      switchBase: {
        color: "red",
        top: 8,
        left: 8,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#fff !important",
          color: "black",
        },
      },
      track: {
        borderRadius: "40px",
        backgroundColor: "white",
        border: "1px solid black",
        opacity: 0.5,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#fff !important",
          color: "black",
        },
      },
      thumb: {
        width: 18,
        height: 18,
        "$checked$checked + &": {
          color: "black",
        },
      },
      colorSecondary: {
        color: "black !important",
        "$checked$checked + &": {
          color: "black",
        },
        "& .Mui-checked": {
          color: "black",
        },
      },
    },
  },
});
