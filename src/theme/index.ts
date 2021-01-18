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
      fontSize: 35,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: "146.3%",
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      opacity: 0.5,
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
    MuiSlider: {
      root: {
        color: "#3D3D3D",
      },
    },
    MuiStepLabel: {
      label: {
        color: "#fff",
        opacity: 0.5,
      },
      active: {
        color: "#fff !important",
        opacity: 1,
      },
      completed: {
        color: "#fff !important",
        opacity: 0.5,
      },
    },
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
        color: "#1C1F23 !important",
      },
      completed: {
        color: "#fff !important",
      },
      root: {
        color: "#1C1F23",
        border: "1px solid #3D3D3D",
        borderRadius: "50%",
        "&$active": {
          fill: "#fff",
          border: "1px solid #3D3D3D",
          borderRadius: "50%",
          "& $text": {
            fill: "#1C1F23",
            border: "1px solid #3D3D3D",
          },
        },
      },
      text: {
        fill: "#fff",
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
        color: "#fff",
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
          backgroundColor: "#1C1F23 !important",
          color: "#81FEB7",
        },
      },
      track: {
        borderRadius: "40px",
        backgroundColor: "inherit",
        border: "1px solid black",
        opacity: 0.5,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#1C1F23 !important",
          color: "#81FEB7",
        },
      },
      thumb: {
        width: 18,
        height: 18,
        "$checked$checked + &": {
          color: "#81FEB7",
        },
      },
      colorSecondary: {
        color: "black",
        "$checked$checked + &": {
          color: "#81FEB7 !important",
        },
        "& .Mui-checked": {
          color: "#81FEB7 !important",
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
