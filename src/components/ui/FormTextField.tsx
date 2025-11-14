import React from "react"
import { TextField, TextFieldProps } from "@material-ui/core"

type Props = TextFieldProps & {
  // Reserved for future variants if needed
}

// Thin preset around MUI TextField to match Tezos ProposalFormInput usage
// - No underline
// - Full width by default
// - No internal label (labels come from the FormField wrapper)
export const FormTextField: React.FC<Props> = ({ InputProps, fullWidth = true, ...rest }) => {
  const mergedInputProps = { disableUnderline: true, ...(InputProps || {}) }
  return <TextField fullWidth={fullWidth} InputProps={mergedInputProps} {...rest} />
}

export const FormTextArea: React.FC<Props> = props => {
  return <FormTextField multiline minRows={5} {...props} />
}
