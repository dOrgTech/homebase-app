import { createTheme } from "@mui/material/styles"
export const legacyTheme = createTheme({
  palette: {
    primary: {
      main: "#1C1F23",
      light: "#3D3D3D",
      dark: "#2F3438"
    },
    secondary: {
      main: "#81FEB7",
      light: "#81FEB7",
      dark: "#BFC5CA"
    },
    text: {
      primary: "#000000",
      secondary: "#FDFDFD"
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
    fontFamily: "Roboto Flex",
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
      fontWeight: 600,
      fontFamily: "Roboto Flex"
    },
    h2: {
      color: "#000000",
      fontSize: 25,
      fontWeight: 500
    },
    h4: {
      fontSize: 24,
      fontWeight: 600
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
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        colorSecondary: {
          borderRadius: 8,
          height: 8
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#3D3D3D"
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          maxWidth: "100%"
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#4BCF93",
          fontSize: 14,
          padding: "10px 15px"
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          marginTop: -3
        },
        label: {
          "color": "#FDFDFD",
          "opacity": 0.5,
          "marginLeft": 15,
          "fontSize": 16,
          "lineHeight": "21.6px",
          "height": 40,
          "display": "flex",
          "alignItems": "center",
          "&.Mui-completed": {
            fontWeight: 300
          },
          "&.Mui-active": {
            color: "#FDFDFD !important",
            opacity: 1,
            fontWeight: 300
          },
          "& .MuiStepLabel-completed": {
            fontWeight: 300
          }
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        vertical: {
          padding: "0px",
          marginLeft: 17,
          marginBottom: 2
        },
        lineVertical: {
          borderLeftWidth: 3,
          minHeight: 30,
          marginTop: -16
        },
        line: {
          borderColor: "#FDFDFD",
          opacity: 0.2
        },
        root: {
          "&.Mui-active": {
            "& span": {
              borderLeftColor: "#81feb7",
              opacity: 1
            }
          },
          "&.Mui-completed": {
            "& span": {
              borderLeftColor: "#81feb7",
              opacity: 1
            }
          }
        }
      }
    },
    MuiStepContent: {
      styleOverrides: {
        root: {
          borderLeft: "none"
        }
      }
    },
    MuiStep: {
      styleOverrides: {
        root: {
          marginBottom: 15
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "height": 32,
          "width": 32,
          "color": "#2f3438",
          "border": "3px solid rgba(255, 255, 255, 0.2)",
          "borderRadius": "50%",
          "&.Mui-active": {
            "color": "#1C1F23 !important",
            "fill": "#81feb7",
            "border": "3px solid #81feb7",
            "borderRadius": "50%",
            "& .MuiStepIcon-text": {
              fill: "#1C1F23",
              border: "1px solid #2f3438"
            }
          },
          "&.Mui-completed": {
            color: "#FDFDFD !important",
            fill: "#81feb7",
            border: "3px solid #81feb7"
          }
        },
        text: {
          fill: "#FDFDFD"
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:after": {
            borderBottom: "none"
          },
          "&.Mui-focused:after": {
            borderBottom: "none"
          },
          "&.Mui-error:after": {
            borderBottom: "none"
          },
          "&:before": {
            borderBottom: "none"
          },
          "&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before": {
            borderBottom: "none"
          },
          "&.Mui-disabled:before": {
            borderBottom: "none"
          },
          "&:active:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before": {
            borderBottom: "none"
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionStart: {
          marginLeft: 8
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#3d3d3d"
          }
        },
        outlined: {
          "&.Mui-disabled": {
            border: "2px solid #3d3d3d"
          },
          "borderWidth": "2px !important",
          "borderRadius": "4px",
          "padding": "1px 8px",
          "fontSize": "1rem"
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: "start",
          color: "#FDFDFD"
        },
        root: {
          fontWeight: 300
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: 16,
          marginBottom: 16
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
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
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          textAlign: "right"
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          marginBottom: 0
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 75,
          height: 50
        },
        switchBase: {
          "color": "red",
          "top": 8,
          "left": 8,
          ".Mui-checked.Mui-checked + &": {
            opacity: 1,
            backgroundColor: "#1C1F23",
            color: "#81FEB7"
          }
        },
        track: {
          "borderRadius": "40px",
          "backgroundColor": "inherit",
          "border": "1px solid #FDFDFD",
          "opacity": 0.5,
          ".Mui-checked.Mui-checked + &": {
            opacity: 1,
            backgroundColor: "#1C1F23",
            color: "#81FEB7"
          }
        },
        thumb: {
          "width": 18,
          "height": 18,
          ".Mui-checked.Mui-checked + &": {
            color: "#81FEB7"
          }
        },
        colorSecondary: {
          "color": "#FDFDFD",
          ".Mui-checked.Mui-checked + &": {
            color: "#81FEB7"
          },
          "& .Mui-checked": {
            color: "#81FEB7"
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: "none"
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "& .Mui-expanded": {
            minHeight: 91
          }
        }
      }
    }
  }
})
