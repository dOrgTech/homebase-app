import { Grid, styled, IconButton } from "@material-ui/core";
import React from "react";

import { ReactComponent as HouseIcon } from "assets/logos/house.svg";
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg";
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg";
import { useHistory, useLocation } from "react-router-dom";

const Bar = styled(Grid)({
  width: 102,
  borderRight: "2px solid #3D3D3D",
});

const SidebarButton = styled(IconButton)({
  paddingTop: 32,
  width: "100%",
});

interface SideBarParams {
  dao: string;
  proposal?: string;
}

const ButtonIcon = ({
  Icon,
  isSelected,
  handler,
}: {
  Icon: React.FC<{ stroke?: string }>;
  isSelected: boolean;
  handler: () => void;
}): JSX.Element => {
  return (
    <SidebarButton onClick={handler}>
      <Icon stroke={isSelected ? "#4BCF93" : "white"} />
    </SidebarButton>
  );
};

export const SideBar: React.FC<SideBarParams> = ({
  dao,
  proposal,
}: SideBarParams) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const SIDE_BAR_ICONS = [
    {
      Icon: HouseIcon,
      handler: () => history.push("/explorer/dao/" + dao),
      name: "dao",
    },
    {
      Icon: VotingIcon,
      handler: () => history.push("/explorer/proposals/" + dao),
      name: "proposals",
    },
    {
      Icon: TreasuryIcon,
      handler: () => history.push("/explorer/treasury/" + dao),
      name: "treasury",
    },
  ];

  // const goToProposal = () => {};

  return (
    <Bar item>
      {SIDE_BAR_ICONS.map(({ Icon, handler, name }) => (
        <ButtonIcon
          key={name}
          Icon={Icon}
          handler={handler}
          isSelected={pathname.includes(name)}
        />
      ))}
    </Bar>
  );
};
