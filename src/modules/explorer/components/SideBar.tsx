import { Grid, styled, IconButton } from "@material-ui/core";
import React, { useMemo } from "react";

import { ReactComponent as HouseIcon } from "assets/logos/house.svg";
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg";
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg";
import { ReactComponent as RegistryIcon } from "assets/logos/list.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

const Bar = styled(Grid)(({ theme }) => ({
  width: 102,
  borderRight: `2px solid ${theme.palette.primary.light}`,
}));

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
  dao: daoId,
}: SideBarParams) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { data: dao } = useDAO(daoId);

  const SIDE_BAR_ICONS = useMemo(() => {
    if (!dao) {
      return [];
    }

    const commonButons = [
      {
        Icon: HouseIcon,
        handler: () => history.push("/explorer/dao/" + daoId),
        name: "dao",
      },
      {
        Icon: VotingIcon,
        handler: () => history.push("/explorer/proposals/" + daoId),
        name: "proposals",
      },
    ];

    switch (dao.metadata.template) {
      case "treasury":
        return [
          ...commonButons,
          {
            Icon: TreasuryIcon,
            handler: () => history.push("/explorer/treasury/" + daoId),
            name: "treasury",
          },
        ];
      case "registry":
        return [
          ...commonButons,
          {
            Icon: RegistryIcon,
            handler: () => history.push("/explorer/registry/" + daoId),
            name: "registry",
          },
        ];
    }
  }, [dao, daoId, history]);

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
