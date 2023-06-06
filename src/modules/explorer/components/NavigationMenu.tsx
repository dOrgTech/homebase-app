import { Grid, styled, Theme, Typography, useMediaQuery, useTheme, alpha } from "@material-ui/core"
import { ReactComponent as HouseIcon } from "assets/logos/home.svg"
import { ReactComponent as VotingIcon } from "assets/logos/voting.svg"
import { ReactComponent as TreasuryIcon } from "assets/logos/treasury.svg"
import { ReactComponent as RegistryIcon } from "assets/logos/list.svg"
import { ReactComponent as UserIcon } from "assets/logos/user.svg"
import React, { useEffect, useState } from "react"
import { useDAOID } from "../pages/DAO/router"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import { debounce } from "../utils/debounce"

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  background: theme.palette.primary.main,
  position: "sticky",
  top: "0px"
}))

const InnerContainer = styled(Grid)(({ theme }) => ({
  width: "1000px",
  margin: "auto",
  justifyContent: "space-between",

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  }
}))

const PageItem = styled(Grid)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "height": "60px",
  "display": "flex",
  "alignItems": "center",
  "padding": "0 8px",
  "borderTop": "2px solid transparent",
  "borderBottom": isSelected ? "2px solid" + theme.palette.secondary.main : "2px solid transparent",
  "transition": isSelected ? "0s ease-in" : ".1s ease-out",

  "& > a > *": {
    height: "100%"
  },

  "&:hover": {
    "& > a > * > * > * > * > *": {
      fill: isSelected ? theme.palette.secondary.main : theme.palette.secondary.main,
      stroke: isSelected ? theme.palette.secondary.main : theme.palette.secondary.main,
      transition: isSelected ? "none" : ".15s ease-in"
    }
  },

  "& > a > * > * > * > * > *": {
    transition: ".15s ease-out"
  },

  "& > a > * > * > *": {
    transition: ".15s ease-out"
  },
  [theme.breakpoints.down("sm")]: {
    width: "45px"
  }
}))

const PageItemBg = styled(Grid)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  alignItems: "center",
  justifyContent: "center",
  gap: 15
}))

const IconContainer = styled("span")(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "height": "25px",
  "display": "flex",
  "justifyContent": "center",

  "& > svg > *": {
    fill: isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
    stroke: isSelected ? theme.palette.secondary.main : theme.palette.text.primary
  }
}))

const NavText = styled(Typography)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "display": "flex",
  "justifyContent": "center",
  "color": isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
  "&:hover": {
    color: `${theme.palette.secondary.main} !important`
  }
}))

interface Page {
  pathId: string
  name: string
  icon: any
  href: string
}

const getPages = (daoId: string): Page[] => [
  {
    pathId: "overview",
    name: "Home",
    icon: HouseIcon,
    href: `/explorer/dao/${daoId}`
  },
  {
    pathId: "proposals",
    name: "Proposals",
    icon: VotingIcon,
    href: `/explorer/dao/${daoId}/proposals`
  },
  {
    pathId: "treasury",
    name: "Treasury",
    icon: TreasuryIcon,
    href: `/explorer/dao/${daoId}/treasury`
  },
  {
    pathId: "registry",
    name: "Registry",
    icon: RegistryIcon,
    href: `/explorer/dao/${daoId}/registry`
  },
  {
    pathId: "user",
    name: "User",
    icon: UserIcon,
    href: `/explorer/dao/${daoId}/user`
  }
]

const StyledBottomBar = styled(Grid)(({ theme }: { theme: Theme }) => ({
  position: "fixed",
  height: 55,
  width: "100%",
  bottom: /*visible ? 0 : -55*/ 0,
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0px -4px 7px -4px rgba(0,0,0,0.2)",
  zIndex: 10000,
  transition: "bottom 0.5s"
}))

const BottomBarItems = styled(Grid)({
  width: "86vw",
  margin: "0 auto",
  justifyContent: "space-between"
})

const BottomNavBar: React.FC = ({ children }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)

      setPrevScrollPos(currentScrollPos)
    }, 100)

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos, visible])

  return (
    <StyledBottomBar container direction={"row"}>
      <BottomBarItems container>{children}</BottomBarItems>
    </StyledBottomBar>
  )
}

export const NavigationMenu: React.FC<{ disableMobileMenu?: boolean }> = ({ disableMobileMenu }) => {
  const [pages, setPages] = useState<Page[]>([])
  const { account } = useTezos()
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const path = useLocation()
  const pathId = path.pathname.split("/").slice(-1)[0]
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down(960))

  useEffect(() => {
    if (dao) {
      const disabledPages: string[] = []

      if (!account) {
        disabledPages.push("User")
      }

      setPages(getPages(daoId).filter(page => !disabledPages.includes(page.name)))
    }
  }, [account, dao, daoId])

  return !isMobileSmall || disableMobileMenu ? (
    <Container container>
      <InnerContainer container>
        {pages.map((page, i) => (
          <PageItem key={`page-${i}`} isSelected={pathId === page.pathId} item>
            <Link to={page.href}>
              <PageItemBg isSelected={pathId === page.pathId} container>
                <Grid item>
                  <IconContainer isSelected={pathId === page.pathId}>
                    <page.icon />
                  </IconContainer>
                </Grid>
                <Grid item>
                  <NavText isSelected={pathId === page.pathId}>{page.name}</NavText>
                </Grid>
              </PageItemBg>
            </Link>
          </PageItem>
        ))}
      </InnerContainer>
    </Container>
  ) : (
    <BottomNavBar>
      {pages.map((page, i) => (
        <PageItem key={`page-${i}`} isSelected={pathId === page.pathId} container item alignItems="center">
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
  )
}
