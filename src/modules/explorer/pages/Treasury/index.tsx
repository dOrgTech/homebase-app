import { Button, Grid, Theme, Tooltip, useMediaQuery, useTheme } from "@material-ui/core"
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

const ItemGrid = styled(Grid)({
  width: "inherit"
})

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 16,
  "fontWeight": 400,
  "color": isSelected ? theme.palette.primary.dark : "#fff",

  "backgroundColor": isSelected ? theme.palette.secondary.main : theme.palette.primary.main,

  "&:hover": {
    backgroundColor: isSelected ? theme.palette.secondary.main : theme.palette.secondary.dark
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
        <Hero>
          <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item>
              <HeroTitle>Treasury</HeroTitle>
              {dao && (
                <CopyAddress
                  address={dao.data.address}
                  justifyContent={isMobileSmall ? "center" : "flex-start"}
                  typographyProps={{
                    variant: "subtitle2"
                  }}
                />
              )}
            </Grid>
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <Grid container>
                <Grid item>
                  <MainButton
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenTransfer(true)}
                    disabled={shouldDisable}
                  >
                    New Transfer
                  </MainButton>
                  {shouldDisable && (
                    <Tooltip placement="bottom" title="Not on proposal creation period">
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Hero>

        <Grid item>
          <Grid container>
            <Grid item>
              <Grid container>
                <Grid item>
                  <StyledTab
                    variant="contained"
                    style={
                      selectedTab !== 0
                        ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, zIndex: 0 }
                        : { borderRadius: 4, zIndex: 1 }
                    }
                    disableElevation={true}
                    onClick={() => handleChangeTab(0)}
                    isSelected={selectedTab === 0}
                  >
                    Tokens
                  </StyledTab>
                </Grid>
                <Grid item>
                  <StyledTab
                    disableElevation={true}
                    variant="contained"
                    style={
                      selectedTab !== 1
                        ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1, zIndex: 0 }
                        : { borderRadius: 4, marginLeft: -1, zIndex: 1 }
                    }
                    onClick={() => handleChangeTab(1)}
                    isSelected={selectedTab === 1}
                  >
                    NFTs
                  </StyledTab>
                </Grid>

                <Grid item>
                  <StyledTab
                    disableElevation={true}
                    variant="contained"
                    style={
                      selectedTab !== 1
                        ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1, zIndex: 0 }
                        : { borderRadius: 4, marginLeft: -1, zIndex: 1 }
                    }
                    onClick={() => handleChangeTab(2)}
                    isSelected={selectedTab === 2}
                  >
                    History
                  </StyledTab>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
