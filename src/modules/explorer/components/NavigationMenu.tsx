import {
  Grid,
  styled,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  withStyles,
  makeStyles
} from "@material-ui/core"
import HouseIcon from "assets/logos/home.svg?react"
import VotingIcon from "assets/logos/voting.svg?react"
import TreasuryIcon from "assets/logos/treasury.svg?react"
import RegistryIcon from "assets/logos/list.svg?react"
import UserIcon from "assets/logos/user.svg?react"
import MembersIcon from "assets/logos/members.svg?react"
import React, { useContext, useEffect, useState } from "react"
import { useDAOID } from "../pages/DAO/router"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import { debounce } from "../utils/debounce"
import { EtherlinkContext } from "services/wagmi/context"
import { useEtherlinkDAOID } from "modules/etherlink/explorer/router"

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  background: theme.palette.primary.dark,
  position: "sticky",
  top: "0px"
}))

const InnerContainer = styled(Grid)(({ theme }: { theme: Theme }) => ({
  width: "1000px",
  paddingLeft: 0,
  paddingRight: 0,
  margin: "auto",
  borderRadius: 8,
  padding: 16,
  alignItems: "center",
  justifyContent: "space-between",

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  }
}))

const PageItemMobile = styled(Grid)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "display": "flex",
  "alignItems": "center",
  "borderTop": "2px solid transparent",
  "backgroundColor": isSelected ? "#24282D" : "inherit",
  "height": "auto",
  "padding": "20px 20px",
  "borderRadius": 8,
  "transition": isSelected ? "0s ease-in" : ".1s ease-out",
  "width": 180,
  "justifyContent": "center",

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

const PageItem = styled(Grid)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "display": "flex",
  "alignItems": "center",
  "borderTop": "2px solid transparent",
  "backgroundColor": isSelected ? "#24282D" : "inherit",
  "height": 50,
  "padding": "20px 16px",
  "borderRadius": 8,
  "transition": isSelected ? "0s ease-in" : ".1s ease-out",
  "justifyContent": "center",

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

const getPages = (daoId: string, etherlinkDaoSelected: boolean): Page[] => {
  const defaultPages = [
    {
      pathId: "overview",
      name: "Home",
      icon: HouseIcon,
      href: etherlinkDaoSelected ? `/explorer/etherlink/dao/${daoId}` : `/explorer/dao/${daoId}`
    },
    {
      pathId: "proposals",
      name: "Proposals",
      icon: VotingIcon,
      href: etherlinkDaoSelected ? `/explorer/etherlink/dao/${daoId}/proposals` : `/explorer/dao/${daoId}/proposals`
    },
    {
      pathId: "treasury",
      name: "Treasury",
      icon: TreasuryIcon,
      href: etherlinkDaoSelected ? `/explorer/etherlink/dao/${daoId}/treasury` : `/explorer/dao/${daoId}/treasury`
    },
    {
      pathId: "registry",
      name: "Registry",
      icon: RegistryIcon,
      href: etherlinkDaoSelected ? `/explorer/etherlink/dao/${daoId}/registry` : `/explorer/dao/${daoId}/registry`
    },
    {
      pathId: "user",
      name: etherlinkDaoSelected ? "Account" : "User",
      icon: UserIcon,
      href: etherlinkDaoSelected ? `/explorer/etherlink/dao/${daoId}/user` : `/explorer/dao/${daoId}/user`
    }
  ]

  if (etherlinkDaoSelected) {
    defaultPages.splice(defaultPages.length - 1, 0, {
      pathId: "members",
      name: "Members",
      icon: MembersIcon,
      href: `/explorer/etherlink/dao/${daoId}/members`
    })
  }

  return defaultPages
}

const styles = makeStyles(theme => ({
  explorer: {
    backgroundColor: theme.palette.primary.dark
  },
  lite: {
    display: "none"
  },
  home: {}
}))

const StyledBottomBar = styled(Grid)(({ theme }: { theme: Theme }) => ({
  position: "fixed",
  height: 55,
  width: "100%",
  bottom: /*visible ? 0 : -55*/ 0,
  boxShadow: "0px -4px 7px -4px rgba(0,0,0,0.2)",
  zIndex: 10000,
  transition: "bottom 0.5s",
  background: theme.palette.secondary.light
}))

const BottomBarItems = styled(Grid)({
  width: "86vw",
  margin: "0 auto",
  justifyContent: "space-between"
})

const BottomNavBar: React.FC = ({ children }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  const classes = styles()

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
  const { account, etherlink } = useTezos()
  const daoId = useDAOID()
  const etherlinkDaoId = useEtherlinkDAOID()
  const { data: dao } = useDAO(daoId)
  const path = useLocation()
  const pathId = path.pathname.split("/").slice(-1)[0]
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down(960))
  const classes = styles()
  const location = useLocation()
  const { daoSelected: etherlinkDaoSelected } = useContext(EtherlinkContext)

  useEffect(() => {
    if (dao) {
      const disabledPages: string[] = []
      const isEtherlink = !!etherlinkDaoSelected?.id

      if (!account && !etherlink.isConnected) {
        disabledPages.push("User")
      }

      if (isEtherlink) {
        disabledPages.push("Treasury")
      }

      setPages(getPages(daoId || etherlinkDaoId, isEtherlink).filter(page => !disabledPages.includes(page.name)))
    }
  }, [account, dao, daoId, etherlink.isConnected, etherlinkDaoId, etherlinkDaoSelected])

  if (location.pathname === "/explorer/daos" || location.pathname === "/explorer/daos/") return null

  return !isMobileSmall || disableMobileMenu ? (
    <Container container>
      <InnerContainer
        container
        className={
          location.pathname.match("/explorer/daos")
            ? classes.explorer
            : location.pathname.match("/explorer/lite")
            ? classes.lite
            : classes.home
        }
      >
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
        <PageItemMobile key={`page-${i}`} isSelected={pathId === page.pathId} container item alignItems="center">
          <Link to={page.href}>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <IconContainer isSelected={pathId === page.pathId}>
                  <page.icon />
                </IconContainer>
              </Grid>
            </Grid>
          </Link>
        </PageItemMobile>
      ))}
    </BottomNavBar>
  )
}
