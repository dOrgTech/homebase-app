import React from "react"
import { InputAdornment, styled, TextField, Theme, withStyles } from "@material-ui/core"
import { SearchOutlined } from "@material-ui/icons"

const StyledInput = withStyles((theme: Theme) => ({
  root: {
    "& label.MuiInputLabel-root": {
      display: "none"
    },
    "& div.MuiInputBase-root": {
      "fontSize": 18,
      "height": 54,
      "boxSizing": "border-box",
      "background": theme.palette.primary.main,
      "padding": 16,
      "width": "100%",
      "borderRadius": 8,
      "marginTop": "0px !important",
      "maxWidth": 571,
      "fontWeight": 300,
      "gap": 6,
      "& input": {
        "color": theme.palette.text.primary,
        "textAlign": "start",
        "&:placeholder": {
          opacity: 0.8
        }
      },
      "&:focus-visible": {
        outline: "none"
      }
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "transparent"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "transparent"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "transparent"
    }
  }
}))(TextField)

export const SearchInput: React.FC<{ search: any; defaultValue?: string; placeholder?: string }> = ({
  search,
  defaultValue,
  placeholder
}) => {
  return (
    <StyledInput
      id="standard-search"
      label="Search field"
      type="search"
      defaultValue={defaultValue || ""}
      placeholder={placeholder || "Search"}
      onChange={e => search(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined color="secondary" />
          </InputAdornment>
        )
      }}
    />
  )
}
