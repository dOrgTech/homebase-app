import { createTheme, ThemeOptions } from "@mui/material/styles"
const defaultTheme = createTheme()
const { breakpoints } = defaultTheme

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2F3438",
      dark: "#1C1F23",
      light: "#bfc5ca",
      contrastText: "#24282d"
    },
    secondary: {
      main: "#81FEB7",
      dark: "#6AE9A720",
      contrastText: "#1C1F23",
      light: "#24282D"
    },
    text: {
      primary: "#FDFDFD"
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
      fontSize: 30,
      [breakpoints.down("xs")]: {
        fontSize: 22
      }
    },
    subtitle1: {
      fontSize: 32,
      [breakpoints.down("xs")]: {
        fontSize: 26
      }
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 300
    },
    h3: {
      fontSize: 21,
      fontWeight: 400
    },
    h2: {
      fontSize: 24
    },
    h4: {
      fontSize: 21,
      [breakpoints.down("xs")]: {
        fontSize: 16
      }
    },
    h5: {
      fontSize: 35,
      [breakpoints.down("xs")]: {
        fontSize: 21
      }
    },
    body1: {
      fontSize: 18,
      [breakpoints.down("xs")]: {
        fontSize: 16
      }
    },
    body2: {
      fontSize: 16,
      [breakpoints.down("xs")]: {
        fontSize: 14
      }
    },
    h6: {
      fontSize: 14
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    // MUI v5+ changed the default TextField variant from "standard" to "outlined".
    // This app's fields and theme overrides are all written for the standard
    // (underline) variant, so restore it globally to avoid the stray outlined border.
    MuiTextField: {
      defaultProps: {
        variant: "standard"
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#fff"
        },
        colorSecondary: {
          color: "#81FEB7 !important"
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "-0.03em !important"
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2f3438",
          zIndex: 1000002,
          pointerEvents: "auto"
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          pointerEvents: "auto"
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          pointerEvents: "auto"
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
          backgroundColor: "#62eda5",
          fontSize: 14,
          padding: "10px 15px",
          color: "#1C1F23"
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "cursor": "pointer",
          "color": "#FDFDFD",
          "opacity": 0.5,
          "marginLeft": 15,
          "lineHeight": "40px",
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
        lineVertical: {
          display: "none"
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
          "color": "#1C1F23",
          "border": "1px solid #3D3D3D",
          "borderRadius": "50%",
          "&.Mui-active": {
            "color": "#1C1F23 !important",
            "fill": "#FDFDFD",
            "border": "1px solid #3D3D3D",
            "borderRadius": "50%",
            "& .MuiStepIcon-text": {
              fill: "#1C1F23",
              border: "1px solid #3D3D3D"
            }
          },
          "&.Mui-completed": {
            color: "#FDFDFD !important"
          }
        },
        text: {
          fill: "#FDFDFD"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        colorSecondary: {
          "&:hover": {
            background: "inherit !important"
          }
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
            borderBottom: "none",
            transition: "none"
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

    MuiButton: {
      styleOverrides: {
        root: {
          "textTransform": "capitalize",
          "fontWeight": 500,
          "fontSize": 18,
          "padding": "3px 14px",
          "letterSpacing": "-0.03em",
          "boxShadow": "none",

          "&:hover": {
            boxShadow: "none"
          },

          "&.Mui-disabled": {
            color: "#2F3438 !important",
            background: "#41484d !important"
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
        },
        text: {
          "color": "#81FEB7",
          "&.Mui-disabled": {
            color: "#bfc5ca !important",
            background: "inherit !important"
          }
        },
        containedSecondary: {
          backgroundColor: "#4ed092"
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: "center",
          color: "#FDFDFD"
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#FDFDFD"
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
          width: 615,
          maxWidth: "100%"
        },
        root: {
          height: "auto"
        },
        paperWidthSm: {
          maxWidth: 615,
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
          "padding": "42px 54px",
          "&:first-child": {
            paddingTop: "42px"
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          textAlign: "right",
          textTransform: "capitalize"
        },
        icon: {
          color: "#FDFDFD"
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
            color: "#81FEB7",
            border: "1px solid #1C1F23"
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
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#2F3438",
          overflow: "hidden"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          minHeight: 58,
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "#FFFFFF"
        }
      }
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          minHeight: 60,
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "##81FEB7",
          borderTop: "0.3px solid rgba(125,140,139, 0.2)"
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& > *:not(:last-child)": {
            borderBottom: "0.3px solid #575757",
            minHeight: 90
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "unset"
        },
        head: {
          fontWeight: 300
        },
        body: {
          fontWeight: 300
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "height": 70,
          "& th:first-child, & td:first-child": {
            paddingLeft: 46,
            textAlign: "inherit"
          },
          "& th:last-child, & td:last-child": {
            paddingRight: 46
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "#2A2E32"
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#383E43"
          }
        },
        head: {
          backgroundColor: "#383E43 !important",
          borderBottom: "0.3px solid #575757"
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        underlineHover: {
          "&:hover": {
            textUnderlineOffset: "4px",
            textDecorationColor: "#fdfdfd"
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          background: "rgba(125,140,139, 0.2) !important"
        },
        barColorPrimary: {
          backgroundColor: "#3866f9"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: "8px"
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "minHeight": 91,
          "& .Mui-expanded": {
            minHeight: 91,
            display: "flex",
            alignItems: "center"
          }
        }
      }
    }
  }
})

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    mobile: true
    toolbarswitch: true
  }
}

export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      mobile: 645,
      toolbarswitch: 865,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
}
