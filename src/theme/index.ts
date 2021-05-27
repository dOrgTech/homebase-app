import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1C1F23",
      light: "#3D3D3D",
    },
    secondary: {
      main: "#4BCF93",
      light: "#81FEB7",
    },
    text: {
      primary: "#000000",
      secondary: "#fff",
    },
    error: {
      main: "#ED254E",
    },
    info: {
      main: "#FFC839",
    }
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
    body2: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: "413.4%",
      opacity: 0.8,
    },
  },
  overrides: {
    MuiSlider: {
      root: {
        color: "#3D3D3D",
      },
    },
    MuiTab: {
      root: {
        maxWidth: "100%",
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: "#4BCF93",
        fontSize: 14,
        padding: "10px 15px"
      },
    },
    MuiStepLabel: {
      label: {
        color: "#fff",
        opacity: 0.5,
        marginLeft: 15,
        lineHeight: "40px",
        "&$completed": {
          fontWeight: 300,
        },
        "&$active": {
          fontWeight: 300,
        },
        "& .MuiStepLabel-completed": {
          fontWeight: 300,
        },
      },
      active: {
        color: "#fff !important",
        opacity: 1,
      },
      completed: {
        color: "#fff !important",
        opacity: 0.5,
        fontWeight: 300,
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
        height: 32,
        width: 32,
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
        "&:after": {
          borderBottom: "none",
        },
        "&$focused:after": {
          borderBottom: "none",
        },
        "&$error:after": {
          borderBottom: "none",
        },
        "&:before": {
          borderBottom: "none",
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: "none",
        },
        "&$disabled:before": {
          borderBottom: "none",
        },
        "&:active:not($disabled):not($focused):not($error):before": {
          borderBottom: "none",
        },
      },
    },
    MuiButton: {
      root: {
        "&$disabled": {
          color: "#3d3d3d",
        },
      },
      outlined: {
        "&$disabled": {
          border: "1px solid #3d3d3d",
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
    MuiDialog: {
      paper: {
        background: "#1C1F23",
        width: 570,
        maxWidth: "100%",
      },
      root: {
        minHeight: 600,
        height: "auto",
      },
      paperWidthSm: {
        minHeight: 600,
        height: "auto",
      },
    },
    MuiFormControl: {
      root: {
        width: "100%",
      },
    },
    MuiDialogContent: {
      root: {
        padding: 0,
      },
    },
    MuiSelect: {
      selectMenu: {
        textAlign: "right",
      },
    },
    MuiDialogContentText: {
      root: {
        marginBottom: 0,
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
          backgroundColor: "#1C1F23",
          color: "#81FEB7",
        },
      },
      track: {
        borderRadius: "40px",
        backgroundColor: "inherit",
        border: "1px solid #fff",
        opacity: 0.5,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#1C1F23",
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
        color: "#fff",
        "$checked$checked + &": {
          color: "#81FEB7",
        },
        "& .Mui-checked": {
          color: "#81FEB7",
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
