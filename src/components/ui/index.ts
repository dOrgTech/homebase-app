// Centralized UI export surface for feature code
// Only files under src/components/ui/* may import from Material-UI directly.
// Feature modules must import UI exclusively from this file.

// v4 Material-UI core re-exports
export {
  AppBar,
  Avatar,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stepper,
  Switch as MuiSwitch,
  Tab,
  Tabs,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer as MuiTableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material"

// withStyles moved to @mui/styles (legacy JSS) in v5
export { default as withStyles } from "@mui/styles/withStyles"

// v4 icons re-exports
export { default as Timer } from "@mui/icons-material/Timer"
export { default as Add } from "@mui/icons-material/Add"
export { default as RemoveCircleOutline } from "@mui/icons-material/RemoveCircleOutline"
export { default as ThumbUpAlt } from "@mui/icons-material/ThumbUpAlt"
export { default as ThumbDownAlt } from "@mui/icons-material/ThumbDownAlt"
export { default as KeyboardArrowDownIcon } from "@mui/icons-material/KeyboardArrowDown"
export { default as Settings } from "@mui/icons-material/Settings"
export { default as InfoOutlined } from "@mui/icons-material/InfoOutlined"
export { default as InfoRounded } from "@mui/icons-material/InfoRounded"
export { default as FileCopyOutlined } from "@mui/icons-material/FileCopyOutlined"
export { default as AddCircleIcon } from "@mui/icons-material/AddCircle"
export { default as RemoveCircleIcon } from "@mui/icons-material/RemoveCircle"
export { default as CloseIcon } from "@mui/icons-material/Close"
export { default as EditIcon } from "@mui/icons-material/Edit"
export { default as DeleteIcon } from "@mui/icons-material/Delete"
export { default as ExpandMoreIcon } from "@mui/icons-material/ExpandMore"
export { default as ExpandLessIcon } from "@mui/icons-material/ExpandLess"

// Local UI wrappers
export * from "./Button"
export * from "./StyledTextField"
export * from "./NumberInput"
export { default as InputText } from "./InputText"
export * from "./Switch"
export * from "./LinearProgress"
export * from "./Containers"
export * from "./ContentContainer"
export { TableHeader, TableContainer, TableContainerGrid, MobileTableHeader, MobileTableRow } from "./Table"
export * from "./Toolbar"
export * from "./CopyButton"
export * from "./DaoCreator"
export * from "./HeroContainer"
export * from "./NextButton"
export * from "./StatusButton"
export * from "./StyledAvatar"
export * from "./SubtitleText"
export * from "./TitleText"
export * from "./ViewSettings"
export * from "./StyledRadio"
export { FormField } from "./FormField"
export { FormTextField, FormTextArea } from "./FormTextField"
export { FormSelect } from "./FormSelect"

// Etherlink-specific styled exports
export * as etherlinkStyled from "./etherlink/styled"
export * from "./etherlink/VotingPower"
export * from "./etherlink/ProposalDialog"
export * from "./etherlink/ProposalForms"
export * from "./etherlink/SummaryTable"
export * from "./etherlink/Stats"

// Note: prefer local wrappers in this layer to avoid API drift
