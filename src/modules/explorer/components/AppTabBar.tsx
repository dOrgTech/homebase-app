import React from "react"
import { AppBar, styled, Tab, Tabs, useMediaQuery, useTheme } from "@material-ui/core"

const CustomTab = styled(Tab)({
  flex: 1
})

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  paddingTop: "20px",
  boxShadow: "unset",
  borderBottom: `2px solid ${theme.palette.primary.light}`
}))

export const AppTabBar: React.FC<{
  value: number
  setValue: any
  labels: string[]
  class1?: any
  centered?: boolean
}> = ({ value, setValue, labels, class1, centered }) => {
  const a11yProps = (index: any) => {
    return {
      "id": `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    }
  }

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue)
  }

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <StyledAppBar
      position="static"
      style={centered && !isMobileSmall ? { display: "grid", justifyContent: "center" } : undefined}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        style={centered && !isMobileSmall ? { display: "flex", justifyContent: "center", marginLeft: 12 } : undefined}
      >
        {labels.map((label, i) => (
          <CustomTab label={label} {...a11yProps(i)} key={i} classes={!isMobileSmall ? class1 : undefined} />
        ))}
      </Tabs>
    </StyledAppBar>
  )
}
