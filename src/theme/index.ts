import { createTheme } from "@material-ui/core/styles"
import { ThemeOptions } from "@material-ui/core/styles/createTheme"
const defaultTheme = createTheme()
const { breakpoints } = defaultTheme

export const theme = createTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  palette: {
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
  overrides: {
    MuiSvgIcon: {
      root: {
        color: "#fff"
      },
      colorSecondary: {
        color: "#81FEB7 !important"
      }
    },
    MuiTypography: {
      root: {
        letterSpacing: "-0.03em !important"
      }
    },
    MuiMenu: {
      paper: {
        backgroundColor: "#2f3438"
      }
    },
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
        backgroundColor: "#62eda5",
        fontSize: 14,
        padding: "10px 15px",
        color: "#1C1F23"
      }
    },
    MuiStepLabel: {
      label: {
        "cursor": "pointer",
        "color": "#FDFDFD",
        "opacity": 0.5,
        "marginLeft": 15,
        "lineHeight": "40px",
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
        color: "#FDFDFD !important",
        opacity: 1
      },
      completed: {
        color: "#FDFDFD !important",
        opacity: 0.5,
        fontWeight: 300
      }
    },
    MuiStepConnector: {
      lineVertical: {
        display: "none"
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
        color: "#FDFDFD !important"
      },
      root: {
        "height": 32,
        "width": 32,
        "color": "#1C1F23",
        "border": "1px solid #3D3D3D",
        "borderRadius": "50%",
        "&$active": {
          "fill": "#FDFDFD",
          "border": "1px solid #3D3D3D",
          "borderRadius": "50%",
          "& $text": {
            fill: "#1C1F23",
            border: "1px solid #3D3D3D"
          }
        }
      },
      text: {
        fill: "#FDFDFD"
      }
    },
    MuiIconButton: {
      colorSecondary: {
        "&:hover": {
          background: "inherit !important"
        }
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
      }
    },

    MuiButton: {
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

        "&$disabled": {
          color: "#2F3438 !important",
          background: "#41484d !important"
        }
      },
      outlined: {
        "&$disabled": {
          border: "2px solid #3d3d3d"
        },
        "borderWidth": "2px !important",
        "borderRadius": "4px",
        "padding": "1px 8px",
        "fontSize": "1rem"
      },
      disabled: {},
      text: {
        "color": "#81FEB7",
        "&$disabled": {
          color: "#bfc5ca !important",
          background: "inherit !important"
        }
      },
      containedSecondary: {
        backgroundColor: "#4ed092"
      }
    },
    MuiInputBase: {
      input: {
        textAlign: "center",
        color: "#FDFDFD"
      }
    },
    MuiRadio: {
      root: {
        color: "#FDFDFD"
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
    },
    MuiFormControl: {
      root: {
        width: "100%"
      }
    },
    MuiDialogContent: {
      root: {
        "padding": "42px 54px",
        "&:first-child": {
          paddingTop: "42px"
        }
      }
    },
    MuiSelect: {
      selectMenu: {
        textAlign: "right",
        textTransform: "capitalize"
      },
      icon: {
        color: "#FDFDFD"
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
        "border": "1px solid #FDFDFD",
        "opacity": 0.5,
        "$checked$checked + &": {
          opacity: 1,
          backgroundColor: "#1C1F23",
          color: "#81FEB7",
          border: "1px solid #1C1F23"
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
        "color": "#FDFDFD",
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
    MuiTable: {
      root: {
        borderRadius: "8px",
        backgroundColor: "#2F3438",
        overflow: "hidden"
      }
    },
    MuiTableHead: {
      root: {
        minHeight: 58,
        fontSize: 16,
        fontWeight: 400,
        letterSpacing: "-0.01em",
        color: "#FFFFFF"
      }
    },
    MuiTableFooter: {
      root: {
        minHeight: 60,
        fontSize: 16,
        fontWeight: 400,
        letterSpacing: "-0.01em",
        color: "##81FEB7",
        borderTop: "0.3px solid rgba(125,140,139, 0.2)"
      }
    },
    MuiTableBody: {
      root: {
        "& > *:not(:last-child)": {
          borderBottom: "0.3px solid #575757",
          minHeight: 90
        }
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: "unset"
      },
      head: {
        fontWeight: 300
      },
      body: {
        fontWeight: 300
      }
    },
    MuiTableRow: {
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
    },
    MuiGrid: {
      "align-items-xs-center": {
        alignItems: "center"
      }
    },
    MuiLink: {
      underlineHover: {
        "&:hover": {
          textUnderlineOffset: "4px",
          textDecorationColor: "#fdfdfd"
        }
      }
    },
    MuiLinearProgress: {
      root: {
        borderRadius: 50,
        background: "rgba(125,140,139, 0.2) !important"
      },
      barColorPrimary: {
        backgroundColor: "#3866f9"
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: "8px"
      }
    },
    MuiAccordionSummary: {
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
})

declare module "@material-ui/core/styles/createBreakpoints" {
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
