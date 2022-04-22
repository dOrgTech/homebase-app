import { createMuiTheme } from "@material-ui/core/styles";
const defaultTheme = createMuiTheme()
const { breakpoints } = defaultTheme

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2F3438",
      dark: "#1C1F23",
      light: "#424242",
    },
    secondary: {
      main: "#81FEB7",
      dark: "#273833",
      contrastText: "#1C1F23"
    },
    text: {
      primary: "#FFFFFF",
    },
    error: {
      main: "#ED254E",
    },
    info: {
      main: "#3866F9",
    },
    warning: {
      main: "#FFC839",
    },
  },
  typography: {
    fontFamily: "Roboto Mono",
    h1: {
      fontSize: 30,
      [breakpoints.down("xs")]: {
        fontSize: 22
      }
    },
    subtitle1: {
      fontSize: 32,
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
      fontSize: 24,
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
        fontSize: 14
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
        padding: "10px 15px",
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
        textTransform: "capitalize",
        fontWeight: 500,
        fontSize: 18,
      },
      outlined: {
        "&$disabled": {
          border: "2px solid #3d3d3d",
        },
        borderWidth: "2px !important",
        borderRadius: "4px",
        padding: "1px 8px",
        fontSize: "1rem",
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
        width: 615,
        maxWidth: "100%",
      },
      root: {
        height: "auto",
      },
      paperWidthSm: {
        maxWidth: 615,
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
        padding: "42px 54px",
        "&:first-child": {
          paddingTop: "42px"
        }
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
    MuiTable: {
      root: {
        borderRadius: "8px",
        backgroundColor: "#2F3438"
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
        borderTop: "0.3px solid #3D3D3D"
      }
    },
    MuiTableBody: {
      "root": {
        "& > *": {
          borderTop: "0.3px solid #3D3D3D",
          minHeight: 90,
        }
      }
    },
    MuiTableCell: {
      "root": {
        borderBottom: "unset"
      }
    },
    MuiTableRow: {
      root: {
          '& th:first-child, & td:first-child': {
            paddingLeft: 46,
          },
          '& th:last-child, & td:last-child': {
            paddingRight: 46,
          },
      }
    },
    MuiAccordion: {
      root: {
        background: "#2F3438",
      },
    },
    MuiAccordionDetails: {
      root: {
        background: "#24282B",
      },
    },
    MuiSvgIcon: {
      root: {
        background: "transparent",
        color: "#fff",
      },
    },
  },
});
