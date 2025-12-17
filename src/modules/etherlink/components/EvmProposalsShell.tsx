import React from "react"
import { Button, Grid, Theme, styled, useMediaQuery, useTheme } from "@material-ui/core"
import { ContentContainer } from "components/ui/Table"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import { ReactComponent as LinkActive } from "assets/img/link_active.svg"
import { ReactComponent as LinkInactive } from "assets/img/link_inactive.svg"
import { ReactComponent as UnlinkActive } from "assets/img/unlink_active.svg"
import { ReactComponent as UnlinkInactive } from "assets/img/unlink_inactive.svg"
import { Typography } from "components/ui"
import { SearchInput } from "modules/explorer/pages/DAOList/components/Searchbar"

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

const ShellHeroContainer = styled(ContentContainer)({
  background: "inherit !important",
  paddingTop: 0,
  padding: "0px",
  display: "inline-flex",
  alignItems: "center"
})

const TabsBox = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "24px 56px 36px",
  minHeight: 300,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 32px 28px"
  }
}))

const FiltersContainer = styled(({ active, ...other }: any) => <Grid {...other} />)(({ theme, active }: any) => ({
  marginTop: 16,
  gap: 8,
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: 20,
  transition: "background .15s ease, border-color .15s ease",
  background: active ? "rgba(129, 254, 183, .12)" : "transparent",
  border: active ? `1px solid ${theme.palette.secondary.main}` : "1px solid transparent"
}))

const StyledTab = styled(({ isSelected, ...other }: any) => <Button {...other} />)(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
    "fontSize": 18,
    "height": 40,
    "fontWeight": 400,
    "paddingLeft": 20,
    "paddingRight": 20,
    "paddingTop": 0,
    "paddingBottom": 0,
    "borderRadius": 8,
    "backgroundColor": isSelected ? "#2B3036" : "inherit",
    "color": isSelected ? theme.palette.secondary.main : "#fff",
    "&:hover": {
      backgroundColor: isSelected ? "#24282D" : theme.palette.secondary.dark,
      borderRadius: 8,
      borderTopLeftRadius: "8px !important",
      borderTopRightRadius: "8px !important",
      borderBottomLeftRadius: "8px !important",
      borderBottomRightRadius: "8px !important"
    }
  })
)

type Props = {
  selectedTab: number
  onChangeTab: (index: number) => void
  onOpenFilters: () => void
  onSearch: (searchText: string) => void
  rightActions?: React.ReactNode
  children?: React.ReactNode
  isFiltered?: boolean
  showOffchainTab?: boolean
  proposalCount?: number
}

export const EvmProposalsShell: React.FC<Props> = ({
  selectedTab,
  onChangeTab,
  onOpenFilters,
  onSearch,
  rightActions,
  children,
  isFiltered = false,
  showOffchainTab = true,
  proposalCount
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <Grid container direction="column" style={{ gap: 16 }}>
      <ShellHeroContainer item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item container direction="row">
            <Grid
              container
              style={{ gap: 20 }}
              alignItems={isMobileSmall ? "baseline" : "center"}
              direction={isMobileSmall ? "column" : "row"}
            >
              <Grid item xs={isMobileSmall ? undefined : 6}>
                <SearchInput search={onSearch} defaultValue="" placeholder="Search proposals by title..." />
              </Grid>
              <Grid
                item
                container
                justifyContent="flex-end"
                style={{ gap: 15 }}
                direction={isMobileSmall ? "column" : "row"}
                xs={isMobileSmall ? undefined : true}
              >
                {rightActions}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ShellHeroContainer>

      <TabsBox item>
        {showOffchainTab ? (
          <Grid item>
            <TabsContainer container>
              <Grid item>
                <StyledTab
                  startIcon={selectedTab === 0 ? <LinkActive /> : <LinkInactive />}
                  variant="contained"
                  disableElevation={true}
                  onClick={() => onChangeTab(0)}
                  isSelected={selectedTab === 0}
                >
                  On-Chain
                </StyledTab>
              </Grid>

              <Grid item>
                <StyledTab
                  startIcon={selectedTab === 1 ? <UnlinkActive /> : <UnlinkInactive />}
                  disableElevation={true}
                  variant="contained"
                  onClick={() => onChangeTab(1)}
                  isSelected={selectedTab === 1}
                >
                  Off-Chain
                </StyledTab>
              </Grid>

              <Grid item>
                <StyledTab
                  startIcon={
                    <HowToVoteIcon
                      style={{ color: selectedTab === 2 ? theme.palette.secondary.main : "#fff" }}
                      fontSize="small"
                    />
                  }
                  disableElevation={true}
                  variant="contained"
                  onClick={() => onChangeTab(2)}
                  isSelected={selectedTab === 2}
                >
                  Active
                </StyledTab>
              </Grid>
            </TabsContainer>
          </Grid>
        ) : null}
        <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 16 }}>
          <FiltersContainer
            active={isFiltered}
            onClick={onOpenFilters}
            xs={12}
            md={2}
            item
            container
            direction="row"
            alignItems="center"
          >
            <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
            <Typography color="secondary">Filter & Sort</Typography>
          </FiltersContainer>
          {proposalCount !== undefined && (
            <Grid item>
              <Typography color="textPrimary" variant="body2">
                {proposalCount} Proposals
              </Typography>
            </Grid>
          )}
        </Grid>

        {children}
      </TabsBox>
    </Grid>
  )
}

export default EvmProposalsShell
