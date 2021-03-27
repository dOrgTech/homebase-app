import {
  Grid,
  styled,
  IconButton,
  useMediaQuery,
  useTheme,
  Theme,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

import { ReactComponent as HouseIcon } from "assets/logos/home.svg";
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg";
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg";
import { ReactComponent as RegistryIcon } from "assets/logos/list.svg";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import debounce from "lodash/debounce";

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

const StyledBottomBar = styled(Grid)(
  ({ theme, visible }: { theme: Theme; visible: boolean }) => ({
    position: "fixed",
    height: 55,
    bottom: visible ? 0 : -55,
    backgroundColor: theme.palette.primary.main,
    borderTop: `2px solid ${theme.palette.primary.light}`,
    zIndex: 10000,
    width: "100%",
    transition: "bottom 0.5s",
  })
);

const BottomNavBar: React.FC = ({ children }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

      setPrevScrollPos(currentScrollPos);
    }, 100);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <StyledBottomBar
      container
      direction={"row"}
      justify={"space-evenly"}
      visible={visible}
    >
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
