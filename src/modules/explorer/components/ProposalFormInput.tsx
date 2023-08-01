import React from "react"
import Editor from "react-simple-code-editor"
import { Grid, styled, Typography } from "@material-ui/core"

const StyledBody = styled(Grid)(({ theme }) => ({
  "borderRadius": 8,
  "background": theme.palette.primary.main,
  "padding": "0 20px",
  "minHeight": 54,
  "& input": {
    minHeight: 54,
    padding: 0,
    textAlign: "start"
  },

  "& .MuiInputBase-input": {
    fontWeight: 300
  }
}))

export const ProposalFormInput: React.FC<{ label?: string }> = ({ label, children }) => {
  return (
    <Grid container direction="column" style={{ gap: 18 }}>
      {label ? (
        <Grid item>
          <Typography style={{ fontWeight: 400 }} color="textPrimary">
            {label}
          </Typography>
        </Grid>
      ) : null}
      <StyledBody>{children}</StyledBody>
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
