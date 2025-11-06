import React, { useState, useEffect } from "react"
import { StyledTextField } from "./StyledTextField"
import { TextFieldProps } from "@material-ui/core"

interface NumberInputProps extends Omit<TextFieldProps, "onChange" | "value" | "type"> {
  value: number
  onChange: (value: number) => void
  min?: number
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min = 0, ...props }) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString())

  useEffect(() => {
    setDisplayValue(value === 0 ? "" : value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === "" || inputValue === "-") {
      setDisplayValue(inputValue)
      return
    }

    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue)) {
      setDisplayValue(inputValue)
      onChange(numValue)
    }
  }

  const handleBlur = () => {
    if (displayValue === "" || displayValue === "-") {
      setDisplayValue("")
      onChange(0)
    } else {
      const numValue = parseInt(displayValue, 10)
      if (!isNaN(numValue)) {
        onChange(numValue)
      } else {
        setDisplayValue("")
        onChange(0)
      }
    }
  }

  return (
    <StyledTextField
      {...props}
      type="number"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ min, ...props.inputProps }}
    />
  )
}
