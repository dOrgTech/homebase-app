import { Button, Grid, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { CopyAddress } from "modules/common/CopyAddress"
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm"

import React, { useMemo, useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { Hero } from "../../components/Hero"
import { HeroTitle } from "../../components/HeroTitle"
import { useDAOID } from "../DAO/router"
import { BalancesTable } from "./components/BalancesTable"
import { TransfersTable } from "./components/TransfersTable"
import { useTransfers } from "../../../../services/contracts/baseDAO/hooks/useTransfers"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { styled } from "@material-ui/core"
import { MainButton } from "../../../common/MainButton"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { NFTs } from "../NFTs"
import TollIcon from "@mui/icons-material/Toll"
import PaletteIcon from "@mui/icons-material/Palette"
import ReceiptIcon from "@mui/icons-material/Receipt"
import { SmallButton } from "modules/common/SmallButton"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { CopyButton } from "modules/common/CopyButton"

const ItemGrid = styled(Grid)({
  width: "inherit"
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

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

const TitleText = styled(Typography)({
  fontSize: 36,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 26
  }
})

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
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
}))

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  background: "inherit !important",
  paddingTop: 0,
  padding: "0px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    maxHeight: "fit-content"
  }
}))

export const Treasury: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const [openTransfer, setOpenTransfer] = useState(false)
  const [selectedTab, setSelectedTab] = React.useState(0)

  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }
  const { data: transfers } = useTransfers(daoId)

  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container direction="row">
              <Grid
                container
                style={{ gap: 20 }}
                alignItems={isMobileSmall ? "baseline" : "center"}
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  item
                  xs={isMobileSmall ? undefined : 7}
                >
                  <Grid item xs={isMobileSmall ? 12 : 2}>
                    <TitleText color="textPrimary">Treasury</TitleText>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                  style={{ gap: 15 }}
                  direction={isMobileSmall ? "column" : "row"}
                  xs={isMobileSmall ? undefined : true}
                >
                  {dao && (
                    <Grid
                      item
                      xs
                      container
                      justifyContent="flex-end"
                      direction="row"
                      style={isMobileSmall ? {} : { marginLeft: 30 }}
                    >
                      <CopyButton style={{ marginRight: 4 }} text={dao?.data.address} displayedText="Copy Address" />
                    </Grid>
                  )}
                  <SmallButton
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenTransfer(true)}
                    disabled={shouldDisable}
                  >
                    New Proposal
                  </SmallButton>
                  {shouldDisable && (
                    <Tooltip placement="bottom" title="Not on proposal creation period">
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  )}
                </Grid>
                <Grid container direction="row">
                  <Typography variant="body1" style={{ color: theme.palette.primary.light }}>
                    Transfer tokens and NFTs, and view balances and transaction history{" "}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        <TabsBox item>
          <Grid item style={{ marginBottom: 32 }}>
            <TabsContainer container>
              <Grid item>
                <StyledTab
                  startIcon={<TollIcon />}
                  variant="contained"
                  disableElevation={true}
                  onClick={() => handleChangeTab(0)}
                  isSelected={selectedTab === 0}
                >
                  Tokens
                </StyledTab>
              </Grid>
              <Grid item>
                <StyledTab
                  startIcon={<PaletteIcon />}
                  disableElevation={true}
                  variant="contained"
                  onClick={() => handleChangeTab(1)}
                  isSelected={selectedTab === 1}
                >
                  NFTs
                </StyledTab>
              </Grid>
              <Grid item>
                <StyledTab
                  startIcon={<ReceiptIcon />}
                  disableElevation={true}
                  variant="contained"
                  onClick={() => handleChangeTab(2)}
                  isSelected={selectedTab === 2}
                >
                  History
                </StyledTab>
              </Grid>
            </TabsContainer>
          </Grid>

          <ItemGrid item>
            <TabPanel value={selectedTab} index={0}>
              <BalancesTable />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <NFTs />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <TransfersTable transfers={transfers || []} />
            </TabPanel>
          </ItemGrid>
        </TabsBox>
      </Grid>
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultTab={selectedTab}
        handleChangeTab={handleChangeTab}
      />
    </>
  )
}
