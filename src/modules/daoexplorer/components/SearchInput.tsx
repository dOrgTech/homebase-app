import React from "react";
import {
  InputAdornment,
  styled,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";

const StyledInput = withStyles((theme: Theme) => ({
  root: {
    "& label.MuiInputLabel-root": {
      display: "none",
    },
    "& div.MuiInputBase-root": {
      height: 69,
      border: "1px solid rgba(255, 255, 255, 0.28)",
      boxSizing: "border-box",
      padding: 25,
      width: "100%",
      marginTop: "0px !important",
      maxWidth: 536,
      "& input": {
        color: theme.palette.primary.light,
        textAlign: "start",
        "&:placeholder": {
          opacity: 0.8,
        },
      },
    },
  },
}))(TextField);

const SearchIcon = styled(SearchOutlined)({
  marginRight: 16,
});

export const SearchInput: React.FC<{ search: any }> = ({ search }) => {
  return (
    <StyledInput
      id="standard-search"
      label="Search field"
      type="search"
      placeholder="Search"
      onChange={(e) => search(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="secondary" />
          </InputAdornment>
        ),
      }}
    />
  );
};
