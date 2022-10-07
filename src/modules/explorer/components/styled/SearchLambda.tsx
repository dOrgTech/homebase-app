import React from "react"
import { Box, Grid, InputAdornment, makeStyles, Popper, styled, TextField, Theme, withStyles } from "@material-ui/core"
import { SearchOutlined } from "@material-ui/icons"
import { Autocomplete } from "@material-ui/lab"
import { Lambda } from "services/bakingBad/lambdas/types"

type LambdaValues = {
  label: string
  code: string
}

const StyledType = styled(Grid)({
  opacity: 0.65
})

const StyledInput = withStyles((theme: Theme) => ({
  popperDisablePortal: {
    width: "418px !important",
    left: 46,
    marginTop: -2
  },
  popper: {
    "& div.MuiPaper-root": {
      "borderTopRightRadius": 0,
      "borderTopLeftRadius": 0,
      "marginTop": -1,
      "background": "#24282b",
      "& div.MuiAutocomplete-paper": {
        "& ul": {
          "background": "inherit",

          "& li": {
            borderBottom: "1px solid gray",
            paddingBbottom: 12
          }
        }
      }
    }
  },
  root: {
    "& div.MuiFormControl-root": {
      "& div.MuiInputBase-root": {
        "padding": 0,
        "marginTop": 0,
        "& div.MuiAutocomplete-endAdornment": {
          "& button.MuiButtonBase-root": {
            color: theme.palette.text.primary
          }
        }
      },
      "& label.MuiFormLabel-root": {
        marginLeft: 36,
        marginTop: -3,
        color: theme.palette.text.primary,
        opacity: 0.65
      }
    }
  }
}))(Autocomplete)

const SearchIcon = styled(SearchOutlined)({
  marginRight: 5
})

const useStyles = makeStyles({
  "@global": {
    ".MuiAutocomplete-option:not(:last-child)": {
      borderBottom: "0.3px solid #7d8c8b",
      paddingTop: 12
    },
    ".MuiAutocomplete-option": {
      paddingBottom: 12,
      paddingTop: 12
    },
    ".MuiAutocomplete-listbox": {
      padding: 0,
      maxHeight: 442
    }
  }
})

export const SearchLambda: React.FC<{
  lambdas: Array<Lambda> | undefined
  handleChange?: any
}> = ({ lambdas, handleChange }) => {
  useStyles()

  return (
    <>
      {lambdas ? (
        <StyledInput
          disablePortal
          id="combo-box-demo"
          options={lambdas}
          getOptionLabel={(option: any) => option.key}
          renderOption={(option: any, state: any) => (
            <Grid container direction="row" justifyContent="space-between" {...state}>
              <Grid>{option.key}</Grid>
              <StyledType>{option.type}</StyledType>
            </Grid>
          )}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Search"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="secondary" />
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
            />
          )}
          onChange={(e: any, data: any) => handleChange(data)}
        />
      ) : null}
    </>
  )
}
