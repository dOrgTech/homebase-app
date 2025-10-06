import React from "react"
import { TextField, TextFieldProps } from "@material-ui/core"

type Props = Omit<TextFieldProps, "select"> & {
  native?: boolean
}

// TextField in select mode with underline disabled to sit inside FormField wrapper.
export const FormSelect: React.FC<Props> = ({ InputProps, fullWidth = true, SelectProps, native, ...rest }) => {
  const mergedInputProps = { disableUnderline: true, ...(InputProps || {}) }
  return (
    <TextField
      select
      fullWidth={fullWidth}
      InputProps={mergedInputProps}
      SelectProps={{ native, ...(SelectProps || {}) }}
      {...rest}
    />
  )
}
