import {
  Box,
  DialogContent,
  Grid,
  Link,
  Popover,
  styled,
  TableCell,
  TableRow,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core"

import { FileCopyOutlined } from "@material-ui/icons"
import { GridContainer } from "modules/common/GridContainer"

import { ContentContainer } from "components/ui/ContentContainer"

export const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

export const OverflowItem = styled(Grid)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

export const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

export const Container = styled(Grid)({
  gap: 16,
  padding: 16
})

export const ContainerVoteDetail = styled(Grid)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.primary.contrastText,
  borderRadius: 8
}))

export const Header = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontWeight: 300
}))

export const CustomContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  display: "grid",
  marginTop: 24,
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    display: "inline",
    paddingTop: "0px !important"
  }
}))

export const VotesRow = styled(Typography)(({ theme }) => ({
  cursor: "default",
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: ".5rem 1rem",
  width: 400,
  [theme.breakpoints.down("sm")]: {
    width: 200,
    textAlign: "center"
  }
}))

export const StyledTableCell = styled(TableCell)({
  "fontWeight": 300,
  "& p": {
    fontWeight: 300
  }
})

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}))

export const ProgressText = styled(Typography)(({ textcolor }: { textcolor: string }) => ({
  color: textcolor,
  display: "flex",
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  fontSize: 16,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Flex",
  justifyContent: "center",
  top: 0
}))

export const TitleContainer = styled(Grid)(({ theme }) => ({
  paddingTop: 18,
  paddingLeft: 46,
  paddingRight: 46,
  paddingBottom: 18,
  borderBottom: `0.3px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

export const LinearContainer = styled(GridContainer)({
  paddingBottom: 0,
  minHeight: 110
})

export const LinearContainerOffchain = styled(GridContainer)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

export const LegendContainer = styled(GridContainer)({
  minHeight: 30,
  paddingBottom: 0
})

export const GraphicsContainer = styled(Grid)({
  paddingBottom: 25
})

export const HistoryItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  marginTop: 8,
  paddingBottom: 4,
  display: "flex",
  height: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "unset"
  }
}))

export const HistoryKey = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  textTransform: "capitalize"
})

export const HistoryValue = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 300,
  color: theme.palette.primary.light
}))

export const AssetLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 14,
  fontWeight: 500
}))

export const LogoItem = styled("img")(({ theme }) => ({
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: 10
  }
}))

export const TextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

export const EndTextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

export const EndText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

export const Divider = styled(Typography)(({ theme }) => ({
  marginLeft: 8,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  fontFamily: "Roboto Flex",
  fontWeight: 300,
  fontSize: 16,
  marginLeft: 8,
  [theme.breakpoints.down("sm")]: {
    fontWeight: 100,
    fontSize: 10
  }
}))

export const CustomPopover = withStyles(theme => ({
  paper: {
    "marginTop": 10,
    "padding": 8,
    "cursor": "pointer",
    "background": `${theme.palette.primary.dark} !important`,
    "&:hover": {
      background: `${theme.palette.secondary.dark} !important`
    }
  }
}))(Popover)

export const DelegationBox = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark,
  borderRadius: 12,
  padding: "32px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "16px",
  border: `1px solid ${theme.palette.primary.light}`,
  boxShadow: theme.shadows[8]
}))

export const AddressDisplay = styled(Typography)({
  color: "#fff",
  fontSize: "14px",
  fontFamily: "monospace",
  marginBottom: "20px"
})

export const DelegationTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  color: theme.palette.common.white,
  marginBottom: "16px",
  textTransform: "uppercase",
  letterSpacing: 1
}))

export const DelegationDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "16px",
  marginBottom: "24px"
}))

export { ContentContainer }
