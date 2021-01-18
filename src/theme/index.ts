import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1C1F23",
      light: "#fff",
    },
    secondary: {
      main: "#81FEB7",
    },
    text: {
      primary: "#000000",
      secondary: "#fff",
    },
  },
  typography: {
    fontFamily: "Roboto Mono",
    h1: {
      fontSize: 70,
      letterSpacing: "-0.01em",
      textDecorationLine: "underline",
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: "146.3%",
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      color: "#81FEB7",
      fontSize: 16,
      fontWeight: 400,
    },
    h3: {
      fontSize: 35,
      fontWeight: 400,
      fontFamily: "Roboto",
    },
    h2: {
      color: "#000000",
      fontSize: 25,
      fontWeight: 500,
    },
    h4: {
      fontSize: 20,
    },
    h5: {
      fontSize: 35,
      lineHeight: "146.3%",
    },
    body1: {
      fontSize: 16,
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
    MuiFormHelperText: {
      root: {
        display: "none",
      },
    },
  },
});
