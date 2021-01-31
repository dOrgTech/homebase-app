import { Grid, styled, IconButton } from "@material-ui/core";
import React from "react";
import HouseIcon from "../../../assets/logos/house.svg";
import VotingIcon from "../../../assets/logos/voting.svg";

const Bar = styled(Grid)({
  width: 102,
  borderRight: "2px solid #3D3D3D",
});

const SidebarButton = styled(IconButton)({
  paddingTop: 32,
  width: "100%",
});

export const SideBar: React.FC = () => {
  return (
    <Bar item>
      <SidebarButton>
        <img src={HouseIcon} />
      </SidebarButton>
      <SidebarButton>
        <img src={VotingIcon} />
      </SidebarButton>
    </Bar>
  );
};
