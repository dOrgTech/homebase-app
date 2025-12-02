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
  withStyles,
  useMediaQuery,
  useTheme
} from "@material-ui/core"

// v4 icons re-exports
export { default as Timer } from "@material-ui/icons/Timer"
export { default as Add } from "@material-ui/icons/Add"
export { default as RemoveCircleOutline } from "@material-ui/icons/RemoveCircleOutline"
export { default as ThumbUpAlt } from "@material-ui/icons/ThumbUpAlt"
export { default as ThumbDownAlt } from "@material-ui/icons/ThumbDownAlt"
export { default as KeyboardArrowDownIcon } from "@material-ui/icons/KeyboardArrowDown"
export { default as Settings } from "@material-ui/icons/Settings"
export { default as InfoOutlined } from "@material-ui/icons/InfoOutlined"
export { default as InfoRounded } from "@material-ui/icons/InfoRounded"
export { default as FileCopyOutlined } from "@material-ui/icons/FileCopyOutlined"
export { default as AddCircleIcon } from "@material-ui/icons/AddCircle"
export { default as RemoveCircleIcon } from "@material-ui/icons/RemoveCircle"
export { default as CloseIcon } from "@material-ui/icons/Close"
export { default as EditIcon } from "@material-ui/icons/Edit"
export { default as DeleteIcon } from "@material-ui/icons/Delete"
export { default as ExpandMoreIcon } from "@material-ui/icons/ExpandMore"
export { default as ExpandLessIcon } from "@material-ui/icons/ExpandLess"

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
