import React from "react"
import Editor from "react-simple-code-editor"
import { Grid, styled, Typography } from "@material-ui/core"

const StyledBody = styled(Grid)(({ theme }) => ({
  "borderRadius": 8,
  "background": theme.palette.primary.main,
  "padding": "0 20px",
  "minHeight": 54,
  // Normalize InputBase/Select to blend with wrapper background
  "& .MuiInputBase-root:not(.MuiInputBase-multiline)": {
    background: "transparent",
    minHeight: 54,
    height: 54,
    display: "flex",
    alignItems: "center"
  },
  "& input": {
    minHeight: 54,
    padding: 0,
    textAlign: "start"
  },
  // Ensure multiline textarea content and placeholder align left
  "& textarea": {
    textAlign: "start"
  },
  // Normalize selects inside ProposalFormInput wrappers
  "& .MuiSelect-select, & .MuiSelect-selectMenu": {
    textAlign: "start",
    background: "transparent !important",
    minHeight: 54,
    height: 54,
    display: "flex",
    alignItems: "center",
    padding: 0,
    paddingRight: 28
  },
  "& .MuiSelect-icon": {
    color: theme.palette.text.primary
  },

  "& .MuiInputBase-input": {
    fontWeight: 300,
    color: theme.palette.text.primary
  },
  "& .MuiInputBase-inputMultiline": {
    textAlign: "start"
  }
}))

export const ProposalFormInput: React.FC<{
  label?: string
  labelStyle?: React.CSSProperties
  containerStyle?: React.CSSProperties
  id?: string
  required?: boolean
  helpText?: string
  errorText?: string
}> = ({ label, labelStyle, containerStyle, id, required, helpText, errorText, children }) => {
  const baseId = React.useMemo(() => id || `ff-${Math.random().toString(36).slice(2)}`, [id])
  const labelId = `${baseId}-label`
  const helpId = `${baseId}-help`

  const enhancedChild = React.isValidElement(children)
    ? React.cloneElement(children as any, {
        "id": baseId,
        "aria-labelledby": label ? labelId : undefined,
        "aria-describedby": errorText || helpText ? helpId : undefined,
        "required": required || undefined
      })
    : children

  return (
    <Grid container direction="column" style={{ gap: 18, ...(containerStyle || {}) }}>
      {label ? (
        <Grid item>
          <Typography id={labelId} style={{ fontWeight: 400, ...(labelStyle || {}) }} color="textPrimary">
            {label}
          </Typography>
        </Grid>
      ) : null}
      <StyledBody>{enhancedChild}</StyledBody>
      {(errorText || helpText) && (
        <Grid item>
          <Typography id={helpId} style={{ fontSize: 12 }} color={errorText ? "error" : "textSecondary"}>
            {errorText || helpText}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

type EditorProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
  onValueChange: (value: string) => void
  highlight: (value: string) => string | React.ReactNode
  tabSize: number
  insertSpaces: boolean
  ignoreTabKey: boolean
  padding: number | string
  style?: React.CSSProperties
  textareaId?: string
  textareaClassName?: string
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  maxLength?: number
  minLength?: number
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  preClassName?: string
}
export type CustomEditorProps = { label?: string; containerstyle?: Record<string, string> } & EditorProps

const StyledEditorWrapper = styled(Grid)(() => ({
  "borderRadius": 4,
  "background": "#121416",
  "maxHeight": 500,
  "overflow": "scroll",
  "& input": {
    maxHeight: 500,
    padding: 0,
    textAlign: "start",
    overflow: "scroll"
  },

  "& .MuiInputBase-input": {
    fontWeight: 300
  }
}))

const StyledEditor = styled(Editor)({
  "& textarea": {
    outline: "none !important"
  },
  "& textarea:focus-visited": {
    outline: "none !important"
  }
})

export const ProposalCodeEditorInput: React.FC<CustomEditorProps> = props => {
  const { label, containerstyle } = props
  return (
    <Grid container direction="column" style={{ gap: 18, ...containerstyle }}>
      {label ? (
        <Grid item>
          <Typography style={{ fontWeight: 400 }} color="textPrimary">
            {label}
          </Typography>
        </Grid>
      ) : null}
      <StyledEditorWrapper>
        <StyledEditor {...props} />
      </StyledEditorWrapper>
    </Grid>
  )
}
