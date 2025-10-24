import React from "react"
import { TextField, TextFieldProps } from "@material-ui/core"

type Props = Omit<TextFieldProps, "select"> & {
  native?: boolean
}

// TextField in select mode with underline disabled to sit inside FormField wrapper.
export const FormSelect: React.FC<Props> = ({ InputProps, fullWidth = true, SelectProps, native, ...rest }) => {
  const mergedInputProps = { disableUnderline: true, ...(InputProps || {}) }
  const mergedSelectProps = {
    native,
    MenuProps: {
      style: { zIndex: 1000002, pointerEvents: "auto" as const },
      PaperProps: {
        style: {
          maxHeight: 300,
          pointerEvents: "auto" as const
        }
      },
      anchorOrigin: {
        vertical: "bottom" as const,
        horizontal: "left" as const
      },
      transformOrigin: {
        vertical: "top" as const,
        horizontal: "left" as const
      },
      getContentAnchorEl: null,
      disablePortal: false
    },
    ...(SelectProps || {})
  }
  return (
    <TextField select fullWidth={fullWidth} InputProps={mergedInputProps} SelectProps={mergedSelectProps} {...rest} />
  )
}
