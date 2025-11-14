import { Paper, Select, withStyles } from "@material-ui/core"

export const StyledPaper = withStyles(theme => ({
  root: {
    minWidth: 520,
    height: 30,
    backgroundColor: theme.palette.grey[200],
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}))(Paper)

export const StyledSelect = withStyles(theme => ({
  select: {
    paddingRight: theme.spacing(4),
    fontWeight: 600,
    backgroundColor: "transparent"
  },
  root: {
    "&:before, &:after": {
      display: "none"
    }
  }
}))(Select as any)
