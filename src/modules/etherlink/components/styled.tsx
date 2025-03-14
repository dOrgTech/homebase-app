import {
  Button,
  DialogContent,
  Grid,
  Link,
  Popover,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles
} from "@material-ui/core"

import { FileCopyOutlined } from "@material-ui/icons"
import { GridContainer } from "modules/common/GridContainer"

import { ContentContainer } from "modules/explorer/components/ContentContainer"

const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})

const OverflowItem = styled(Grid)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const CopyIcon = styled(FileCopyOutlined)({
  marginLeft: 8,
  cursor: "pointer"
})

const Container = styled(Grid)({
  gap: 16,
  padding: 16
})

const ContainerVoteDetail = styled(Grid)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8
}))

const Header = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontWeight: 300
}))

const CustomContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  display: "grid",
  marginTop: 24,
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    display: "inline",
    paddingTop: "0px !important"
  }
}))

const VotesRow = styled(Typography)(({ theme }) => ({
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

const StyledTableCell = styled(TableCell)({
  "fontWeight": 300,
  "& p": {
    fontWeight: 300
  }
})
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}))

const ProgressText = styled(Typography)(({ textcolor }: { textcolor: string }) => ({
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

const TitleContainer = styled(Grid)(({ theme }) => ({
  paddingTop: 18,
  paddingLeft: 46,
  paddingRight: 46,
  paddingBottom: 18,
  borderBottom: `0.3px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

const LinearContainer = styled(GridContainer)({
  paddingBottom: 0,
  minHeight: 110
})

const LinearContainerOffchain = styled(GridContainer)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

const LegendContainer = styled(GridContainer)({
  minHeight: 30,
  paddingBottom: 0
})

const GraphicsContainer = styled(Grid)({
  paddingBottom: 25
})

const HistoryItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  marginTop: 8,
  paddingBottom: 4,
  display: "flex",
  height: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "unset"
  }
}))

const HistoryKey = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  textTransform: "capitalize"
})

const HistoryValue = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  color: "#BFC5CA"
})

const LogoItem = styled("img")(({ theme }) => ({
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: 10
  }
}))

const TextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndTextContainer = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const EndText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const Divider = styled(Typography)(({ theme }) => ({
  marginLeft: 8,
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    marginTop: 20
  }
}))

const StyledLink = styled(Link)(({ theme }) => ({
  fontFamily: "Roboto Flex",
  fontWeight: 300,
  fontSize: 16,
  marginLeft: 8,
  [theme.breakpoints.down("sm")]: {
    fontWeight: 100,
    fontSize: 10
  }
}))

const CustomPopover = withStyles({
  paper: {
    "marginTop": 10,
    "padding": 8,
    "cursor": "pointer",
    "background": "#1c1f23 !important",
    "&:hover": {
      background: "#81feb76b !important"
    }
  }
})(Popover)

export {
  OverflowCell,
  MobileTableHeader,
  MobileTableRow,
  OverflowItem,
  TableContainer,
  CopyIcon,
  Container,
  ContainerVoteDetail,
  Header,
  CustomContent,
  VotesRow,
  StyledTableCell,
  StyledTableRow,
  ProgressText,
  TitleContainer,
  LinearContainer,
  LinearContainerOffchain,
  LegendContainer,
  GraphicsContainer,
  HistoryItem,
  HistoryKey,
  HistoryValue,
  CustomPopover,
  TextContainer,
  EndTextContainer,
  EndText,
  Divider,
  StyledLink,
  LogoItem
}
