import React from "react"
import { Button, Grid, Theme, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import { ContentContainer } from "components/ui/Table"
import { TitleText } from "components/ui/TitleText"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { ReactComponent as LinkActive } from "assets/img/link_active.svg"
import { ReactComponent as LinkInactive } from "assets/img/link_inactive.svg"
import { ReactComponent as UnlinkActive } from "assets/img/unlink_active.svg"
import { ReactComponent as UnlinkInactive } from "assets/img/unlink_inactive.svg"

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

const TabsBox = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "40px 56px",
  minHeight: 300,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "30px 36px"
  }
}))

const FiltersContainer = styled(Grid)({
  marginTop: 45,
  gap: 8,
  cursor: "pointer"
})

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
  title?: string
  subtitle?: string
  selectedTab: number
  onChangeTab: (index: number) => void
  onOpenFilters: () => void
  rightActions?: React.ReactNode
  children?: React.ReactNode
}

export const ProposalsShell: React.FC<Props> = ({
  title = "Proposals",
  subtitle = "Create, view, and vote on On-Chain and Off-Chain proposals",
  selectedTab,
  onChangeTab,
  onOpenFilters,
  rightActions,
  children
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const ShellHeroContainer = styled(ContentContainer)({
    background: "inherit !important",
    paddingTop: 0,
    padding: "0px",
    display: "inline-flex",
    alignItems: "center"
  })

  return (
    <Grid container direction="column" style={{ gap: 42 }}>
      <ShellHeroContainer item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item container direction="row">
            <Grid
              container
              style={{ gap: 20 }}
              alignItems={isMobileSmall ? "baseline" : "center"}
              direction={isMobileSmall ? "column" : "row"}
            >
              <Grid item xs={isMobileSmall ? undefined : 4}>
                <TitleText color="textPrimary">{title}</TitleText>
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
              <Grid container direction="row">
                <Typography variant="body1" style={{ color: theme.palette.primary.light }}>
                  {subtitle}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ShellHeroContainer>

      <TabsBox item>
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
          </TabsContainer>
        </Grid>

        <FiltersContainer onClick={onOpenFilters} xs={12} md={2} item container direction="row" alignItems="center">
          <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
          <Typography color="secondary">Filter & Sort</Typography>
        </FiltersContainer>

        {children}
      </TabsBox>
    </Grid>
  )
}

export default ProposalsShell
