import {
  Grid,
  styled,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ReactComponent as HouseIcon } from "assets/logos/home.svg";
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg";
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg";
import { ReactComponent as RegistryIcon } from "assets/logos/list.svg";
import { ReactComponent as UserIcon } from "assets/logos/user.svg";
import { ReactComponent as NFTIcon } from "assets/logos/nft.svg";
import React, { useEffect, useState } from "react";
import { useDAOID } from "../pages/DAO/router";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { debounce } from "../utils/debounce";

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  background: theme.palette.primary.main,
  position: "sticky",
  top: "0px",
}));

const InnerContainer = styled(Grid)(({ theme }) => ({
  width: "1000px",
  margin: "auto",
  justifyContent: "space-between",

  ["@media (max-width:1167px)"]: { 
    width: "86vw",

  },
}));

const PageItem = styled(Grid)(({theme, isSelected}: {theme: Theme; isSelected: boolean}) => ({
  height: "60px",
  borderTop: "2px solid transparent",
  borderBottom: isSelected 
  ? "2px solid" + theme.palette.secondary.main
  : "2px solid transparent",

  "& > a > *": {
    height: "100%",
  },



}),
);

const IconContainer = styled("span")(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
    "& > svg > *": {
      fill: isSelected
      ? theme.palette.secondary.main
      : theme.palette.text.primary,
    },

  

    // "&:hover > svg:hover > *": {
    //   fill: isSelected
    //   ? theme.palette.secondary.main
    //   : theme.palette.secondary.main,
    // }
  }),

);

const NavText = styled(Typography)(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
    color: isSelected
    ? theme.palette.secondary.main
    : theme.palette.text.primary,
    
    // "&:hover": {
    //   color: isSelected
    //   ? theme.palette.secondary.main
    //   : theme.palette.secondary.main,
    // }

    
  }),

);

interface Page {
  pathId: string;
  name: string;
  icon: any;
  href: string;
}

const getPages = (daoId: string): Page[] => [
  {
    pathId: "overview",
    name: "Home",
    icon: HouseIcon,
    href: `/explorer/dao/${daoId}`,
  },
  {
    pathId: "proposals",
    name: "Proposals",
    icon: VotingIcon,
    href: `/explorer/dao/${daoId}/proposals`,
  },
  {
    pathId: "treasury",
    name: "Treasury",
    icon: TreasuryIcon,
    href: `/explorer/dao/${daoId}/treasury`,
  },
  {
    pathId: "registry",
    name: "Registry",
    icon: RegistryIcon,
    href: `/explorer/dao/${daoId}/registry`,
  },
  {
    pathId: "nfts",
    name: "NFT",
    icon: NFTIcon,
    href: `/explorer/dao/${daoId}/nfts`,
  },
  {
    pathId: "user",
    name: "User",
    icon: UserIcon,
    href: `/explorer/dao/${daoId}/user`,
  },
];

const StyledBottomBar = styled(Grid)(
  ({ theme, visible }: { theme: Theme; visible: boolean }) => ({
    position: "fixed",
    height: 55,
    bottom: visible ? 0 : -55,
    backgroundColor: theme.palette.primary.main,
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

export const NavigationMenu: React.FC<{ disableMobileMenu?: boolean }> = ({
  disableMobileMenu,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const { account } = useTezos();
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const path = useLocation();
  const pathId = path.pathname.split("/").slice(-1)[0];
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (dao) {
      const disabledPages: string[] = [];

      if (dao.data.type === "treasury") {
        disabledPages.push("Registry");
      }

      if (!account) {
        disabledPages.push("User");
      }

      setPages(
        getPages(daoId).filter((page) => !disabledPages.includes(page.name))
      );
    }
  }, [account, dao, daoId]);

  return !isMobileSmall || disableMobileMenu ? (
    <Container container>
      <InnerContainer container>
      {pages.map((page, i) => (
        <PageItem key={`page-${i}`} isSelected={pathId === page.pathId} item alignItems="center">
          <Link to={page.href}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ gap: 15 }}
            >
              <Grid item>
                <IconContainer isSelected={pathId === page.pathId}>
                  <page.icon />
                </IconContainer>
              </Grid>
              <Grid item>
                <NavText
                  isSelected={pathId === page.pathId}
                >
                  {page.name}
                </NavText>
              </Grid>
            </Grid>
          </Link>
        </PageItem>
      ))}
      </InnerContainer>
    </Container>
  ) : (
    <BottomNavBar>
      {pages.map((page, i) => (
        <PageItem key={`page-${i}`} isSelected={pathId === page.pathId} item alignItems="center">
          <Link to={page.href}>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <IconContainer isSelected={pathId === page.pathId}>
                  <page.icon />
                </IconContainer>
              </Grid>
            </Grid>
          </Link>
        </PageItem>
      ))}
    </BottomNavBar>
  );
};
