import React, { useState } from "react"
import { Grid, TextField, styled, IconButton } from "@material-ui/core"
import { useNotification } from "modules/common/hooks/useNotification"
import ContentCopyIcon from "@material-ui/icons/FileCopy"

const ValueContainer = styled(Grid)({
  position: "relative",
  width: "100%"
})

const StyledTextField = styled(TextField)(({ theme }) => ({
  "width": "100%",
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    padding: "10px 12px",
    fontSize: 14,
    paddingRight: "48px" // Make room for the copy button
  },
  "& .MuiInputBase-input": {
    padding: 0,
    cursor: "pointer"
  },
  "& .MuiInput-underline:before": {
    borderBottom: "none"
  },
  "& .MuiInput-underline:after": {
    borderBottom: "none"
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none"
  }
}))

const CopyButtonStyled = styled(IconButton)(({ theme }) => ({
  "position": "absolute",
  "right": "8px",
  "top": "50%",
  "transform": "translateY(-50%)",
  "padding": "4px",
  "color": theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  }
}))

interface ShortenedValueFieldProps {
  value: string
  label?: string
}

export const ShortenedValueField: React.FC<ShortenedValueFieldProps> = ({ value, label }) => {
  const openNotification = useNotification()
  const [isHovered, setIsHovered] = useState(false)

  // Function to shorten the value: first 7 characters + ... + last 4 characters
  const shortenValue = (val: string): string => {
    if (!val || val.length <= 15) {
      return val
    }
    // For long values, show first 7 and last 4 characters
    return `${val.slice(0, 7)}...${val.slice(-4)}`
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    openNotification({
      message: `${label || "Value"} copied to clipboard!`,
      autoHideDuration: 2000,
      variant: "success"
    })
  }

  const handleFieldClick = () => {
    navigator.clipboard.writeText(value)
    openNotification({
      message: `${label || "Value"} copied to clipboard!`,
      autoHideDuration: 2000,
      variant: "success"
    })
  }

  const displayValue = shortenValue(value)

  return (
    <ValueContainer
      container
      direction="column"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledTextField
        value={displayValue}
        InputProps={{
          readOnly: true,
          disableUnderline: true
        }}
        variant="standard"
        fullWidth
        onClick={handleFieldClick}
        title={value} // Show full value on hover
      />
      {isHovered && (
        <CopyButtonStyled onClick={handleCopy} size="small">
          <ContentCopyIcon style={{ fontSize: 16 }} />
        </CopyButtonStyled>
      )}
    </ValueContainer>
  )
}
