import { createMuiTheme } from "@material-ui/core/styles"
export const legacyTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#1C1F23",
      light: "#3D3D3D",
      dark: "#2F3438"
    },
    secondary: {
      main: "#4BCF93",
      light: "#81FEB7"
    },
    text: {
      primary: "#000000",
      secondary: "#fff"
    },
    error: {
      main: "#ED254E"
    },
    info: {
      main: "#3866F9"
    },
    warning: {
      main: "#FFC839"
    }
  },
  typography: {
    fontFamily: "Roboto Mono",
    h1: {
      fontSize: 35,
      letterSpacing: "-0.01em"
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 300,
      lineHeight: "26.33px",
      letterSpacing: "-0.01em"
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: "26.33px",
      letterSpacing: "-0.01em"
    },
    h3: {
      fontSize: 32,
      fontWeight: 500,
      fontFamily: "Roboto Mono"
    },
    h2: {
      color: "#000000",
      fontSize: 25,
      fontWeight: 500
    },
    h4: {
      fontSize: 20
    },
    h5: {
      fontSize: 35
    },
    body1: {
      fontSize: 16
    },
    body2: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: "413.4%",
      opacity: 0.8
    }
  },
  overrides: {
    MuiSlider: {
      root: {
        color: "#3D3D3D"
      }
    },
    MuiTab: {
      root: {
        maxWidth: "100%"
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: "#4BCF93",
        fontSize: 14,
        padding: "10px 15px"
      }
    },
    MuiStepLabel: {
      root: {
        marginTop: -3
      },
      label: {
        "color": "#fff",
        "opacity": 0.5,
        "marginLeft": 15,
        "fontSize": 14,
        "lineHeight": "18.5px",
        "height": 40,
        "display": "flex",
        "alignItems": "center",
        "&$completed": {
          fontWeight: 300
        },
        "&$active": {
          fontWeight: 300
        },
        "& .MuiStepLabel-completed": {
          fontWeight: 300
        }
      },
      active: {
        color: "#fff !important",
        opacity: 1
      },
      completed: {
        color: "#fff !important",
        opacity: 0.5,
        fontWeight: 300
      }
    },
    MuiStepConnector: {
      vertical: {
        padding: "0px",
        marginLeft: 17
      },
      lineVertical: {
        borderLeftWidth: 2,
        minHeight: 28,
        marginTop: -16
      },
      line: {
        borderColor: "#fff",
        opacity: 0.2
      },
      active: {
        "& span": {
          borderLeftColor: "#81feb7",
          opacity: 1
        }
      },
      completed: {
        "& span": {
          borderLeftColor: "#81feb7",
          opacity: 1
        }
      }
    },
    MuiStepContent: {
      root: {
        borderLeft: "none"
      }
    },
    MuiStep: {
      root: {
        marginBottom: 15
      }
    },
    MuiStepIcon: {
      active: {
        color: "#1C1F23 !important"
      },
      completed: {
        color: "#fff !important"
      },
      root: {
        "height": 32,
        "width": 32,
        "color": "#2f3438",
        "border": "2px solid rgba(255, 255, 255, 0.2)",
        "borderRadius": "50%",
        "&$active": {
          "fill": "#81feb7",
          "border": "2px solid #81feb7",
          "borderRadius": "50%",
          "& $text": {
            fill: "#1C1F23",
            border: "1px solid #2f3438"
          }
        },
        "&$completed": {
          fill: "#81feb7",
          border: "2px solid #81feb7"
        }
      },
      text: {
        fill: "#fff"
      }
    },
    MuiInput: {
      underline: {
        "&:after": {
          borderBottom: "none"
        },
        "&$focused:after": {
          borderBottom: "none"
        },
        "&$error:after": {
          borderBottom: "none"
        },
        "&:before": {
          borderBottom: "none"
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: "none"
        },
        "&$disabled:before": {
          borderBottom: "none"
        },
        "&:active:not($disabled):not($focused):not($error):before": {
          borderBottom: "none"
        }
      },
      disabled: {}
    },
    MuiInputAdornment: {
      positionStart: {
        marginLeft: 8
      }
    },
    MuiButton: {
      root: {
        "&$disabled": {
          color: "#3d3d3d"
        }
      },
      disabled: {},
      outlined: {
        "&$disabled": {
          border: "2px solid #3d3d3d"
        },
        "borderWidth": "2px !important",
        "borderRadius": "4px",
        "padding": "1px 8px",
        "fontSize": "1rem"
      }
    },
    MuiInputBase: {
      input: {
        textAlign: "start",
        color: "#fff"
      },
      root: {
        fontWeight: 300
      }
    },
    MuiDivider: {
      root: {
        marginTop: 16,
        marginBottom: 16
      }
    },
    MuiDialog: {
      paper: {
        background: "#1C1F23",
        width: 570,
        maxWidth: "100%"
      },
      root: {
        minHeight: 600,
        height: "auto"
      },
      paperWidthSm: {
        minHeight: 600,
        height: "auto"
      }
    },
    MuiFormControl: {
      root: {
        width: "100%"
      }
    },
    MuiDialogContent: {
      root: {
        padding: 0
      }
    },
    MuiSelect: {
      selectMenu: {
        textAlign: "right"
      }
    },
    MuiDialogContentText: {
      root: {
        marginBottom: 0
      }
    },
    MuiSwitch: {
      root: {
        width: 75,
        height: 50
      },
      switchBase: {
        "color": "red",
        "top": 8,
        "left": 8,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#1C1F23",
          color: "#81FEB7"
        }
      },
      track: {
        "borderRadius": "40px",
        "backgroundColor": "inherit",
        "border": "1px solid #fff",
        "opacity": 0.5,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#1C1F23",
          color: "#81FEB7"
        }
      },
      thumb: {
        "width": 18,
        "height": 18,
        "$checked$checked + &": {
          color: "#81FEB7"
        }
      },
      colorSecondary: {
        "color": "#fff",
        "$checked$checked + &": {
          color: "#81FEB7"
        },
        "& .Mui-checked": {
          color: "#81FEB7"
        }
      }
    },
    MuiFormHelperText: {
      root: {
        display: "none"
      }
    },
    MuiAccordionSummary: {
      root: {
        "& .Mui-expanded": {
          minHeight: 91
        }
      }
    }
  }
})
