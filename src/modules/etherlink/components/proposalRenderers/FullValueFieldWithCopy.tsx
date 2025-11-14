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

interface FullValueFieldWithCopyProps {
  value: string
  label?: string
}

export const FullValueFieldWithCopy: React.FC<FullValueFieldWithCopyProps> = ({ value, label }) => {
  const openNotification = useNotification()
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <ValueContainer
      container
      direction="column"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledTextField
        value={value}
        InputProps={{
          readOnly: true,
          disableUnderline: true
        }}
        variant="standard"
        fullWidth
        onClick={handleFieldClick}
      />
      {isHovered && (
        <CopyButtonStyled onClick={handleCopy} size="small">
          <ContentCopyIcon style={{ fontSize: 16 }} />
        </CopyButtonStyled>
      )}
    </ValueContainer>
  )
}
