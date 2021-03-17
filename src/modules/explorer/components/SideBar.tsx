import {
  Grid,
  styled,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useMemo } from "react";

import { ReactComponent as HouseIcon } from "assets/logos/house.svg";
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg";
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg";
import { ReactComponent as RegistryIcon } from "assets/logos/list.svg";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

const Bar = styled(Grid)(({ theme }) => ({
  minWidth: 102,
  borderRight: `2px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("xs")]: {
    width: "100%",
    borderBottom: `2px solid ${theme.palette.primary.light}`,
    borderRight: `unset`,
  },
}));

const SidebarButton = styled(IconButton)(({ theme }) => ({
  paddingTop: 32,
  width: "100%",
  [theme.breakpoints.down("xs")]: {
    paddingTop: 12,
  },
}));

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

const StyledBottomBar = styled(Grid)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  backgroundColor: theme.palette.primary.main,
  borderTop: `2px solid ${theme.palette.primary.light}`,
  zIndex: 10000,
}));

const BottomNavBar: React.FC = ({ children }) => {
  return (
    <StyledBottomBar container direction={"row"} justify={"space-evenly"}>
      {children}
    </StyledBottomBar>
  );
};

const SideNavBar: React.FC = ({ children }) => {
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Bar item>
      <Grid
        container
        direction={isMobileExtraSmall ? "row" : "column"}
        justify={isMobileExtraSmall ? "space-evenly" : "flex-start"}
      >
        {children}
      </Grid>
    </Bar>
  );
};

export const SideBar: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { id: daoId } = useParams<{ id: string }>();
  const { data: dao } = useDAO(daoId);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const SIDE_BAR_ICONS = useMemo(() => {
    if (!dao) {
      return [];
    }

    const commonButons = [
      {
        Icon: HouseIcon,
        handler: () => history.push("/explorer/dao/" + daoId),
        name: "overview",
      },
      {
        Icon: VotingIcon,
        handler: () => history.push(`/explorer/dao/${daoId}/proposals`),
        name: "proposals",
      },
    ];

    switch (dao.metadata.template) {
      case "treasury":
        return [
          ...commonButons,
          {
            Icon: TreasuryIcon,
            handler: () => history.push(`/explorer/dao/${daoId}/treasury`),
            name: "treasury",
          },
        ];
      case "registry":
        return [
          ...commonButons,
          {
            Icon: RegistryIcon,
            handler: () => history.push(`/explorer/dao/${daoId}/registry`),
            name: "registry",
          },
        ];
    }
  }, [dao, daoId, history]);

  return !isMobileExtraSmall ? (
    <SideNavBar>
      {SIDE_BAR_ICONS.map(({ Icon, handler, name }) => (
        <Grid item key={name}>
          <ButtonIcon
            Icon={Icon}
            handler={handler}
            isSelected={pathname.includes(name)}
          />
        </Grid>
      ))}
    </SideNavBar>
  ) : (
    <BottomNavBar>
      {SIDE_BAR_ICONS.map(({ Icon, handler, name }) => (
        <Grid item key={name}>
          <ButtonIcon
            Icon={Icon}
            handler={handler}
            isSelected={pathname.includes(name)}
          />
        </Grid>
      ))}
    </BottomNavBar>
  );
};
