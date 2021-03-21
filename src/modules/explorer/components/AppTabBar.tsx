import React from "react";
import { AppBar, styled, Tab, Tabs } from "@material-ui/core";

const CustomTab = styled(Tab)({
  flexBasis: "50%",
  maxWidth: "50%",
  flexGrow: 0,
});

export const AppTabBar: React.FC<{
  value: number;
  setValue: any;
  label1: string;
  label2: string;
}> = ({ value, setValue, label1, label2 }) => {
  const a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <CustomTab label={label1} {...a11yProps(0)} />
        <CustomTab label={label2} {...a11yProps(1)} />
      </Tabs>
    </AppBar>
  );
};
