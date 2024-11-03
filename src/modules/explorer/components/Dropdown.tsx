import React, { useEffect, useState } from "react"
import { Select, SelectProps, MenuItem, makeStyles, Theme } from "@material-ui/core"
interface DropdownProps extends SelectProps {
  options: { name: string; value: string | undefined }[]
  value?: string | undefined
  onSelected?: (item: string | undefined) => void
  isFirst?: boolean
  isFilter?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    left: 0
  },
  iconOpen: {
    transform: "none"
  },
  selectSelect: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    },
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 24
  },
  option: {
    "padding": 12,
    "fontFamily": "Roboto Flex",
    "cursor": "pointer",
    "text-transform": "capitalize",
    "&:hover": {
      background: "rgba(129, 254, 183, .4)"
    }
  },
  selectFilter: {
    "backgroundColor": "#2F3438",
    "padding": 12,
    "borderRadius": 8,
    "paddingRight": "36px !important",
    "&:focus": {
      backgroundColor: "#2F3438",
      padding: 12,
      borderRadius: 8,
      paddingRight: 36
    }
  }
}))

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onSelected, isFilter = false }) => {
  const classes = useStyles()
  const [selected, setSelected] = useState<string | undefined>(value)

  useEffect(() => {
    setSelected(value)
  }, [value])

  const handleSelected = (event: any) => {
    setSelected(event.target.value)
    if (onSelected) onSelected(event.target.value)
  }

  return (
    <Select
      disableUnderline={true}
      value={selected}
      onChange={handleSelected}
      classes={{
        select: isFilter ? classes.selectFilter : classes.selectSelect
      }}
    >
      {options.map(({ name, value }, index) => (
        <option value={value} key={`${name}-${index}`} className={classes.option}>
          {name}
        </option>
      ))}
    </Select>
  )
}
