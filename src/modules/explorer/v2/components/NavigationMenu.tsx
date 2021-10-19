import { Grid, styled, Theme, Typography } from "@material-ui/core";
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

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  position: "sticky",
  background: theme.palette.primary.main,
}));

const IconContainer = styled("span")(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
    "& > svg > *": {
      fill: isSelected
        ? theme.palette.secondary.main
        : theme.palette.text.primary,
    },
  })
);

const PageItem = styled(Grid)({
  height: 65,

  "& > a > *": {
    height: "100%",
  },
});

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

export const NavigationMenu: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const { account } = useTezos();
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const path = useLocation();
  const pathId = path.pathname.split("/").slice(-1)[0];
  console.log(pathId);

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

  return (
    <Container container justifyContent="center" style={{ gap: 92 }}>
      {pages.map((page, i) => (
        <PageItem key={`page-${i}`} item alignItems="center">
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
                <Typography
                  color={pathId === page.pathId ? "secondary" : "textPrimary"}
                >
                  {page.name}
                </Typography>
              </Grid>
            </Grid>
          </Link>
        </PageItem>
      ))}
    </Container>
  );
};