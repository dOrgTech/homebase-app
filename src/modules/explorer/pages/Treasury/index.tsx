import { Button, Grid, Link, Tooltip, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { CopyAddress } from "modules/common/CopyAddress"
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm"

import React, { useMemo, useState } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { Hero } from "../../components/Hero"
import { HeroTitle } from "../../components/HeroTitle"
import { useDAOID } from "../DAO/router"
import { BalancesTable } from "./components/BalancesTable"
import { TransfersTable } from "./components/TransfersTable"
import { useTransfers } from "../../../../services/contracts/baseDAO/hooks/useTransfers"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { useDelegate } from "services/contracts/baseDAO/hooks/useDelegate"
import { DelegationChangeProposalForm } from "modules/explorer/components/DelegationChangeProposalForm"

export const Treasury: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const [openTransfer, setOpenTransfer] = useState(false)
  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }
  const [openDelegationChange, setOpenDelegationChange] = useState(false)
  const onCloseDelegationChange = () => {
    setOpenDelegationChange(false)
  }
  const { data: transfers } = useTransfers(daoId)
  const { data: delegate } = useDelegate(daoId)

  const inboundTransfers = useMemo(() => {
    if (!transfers) {
      return []
    }

    return transfers.filter(t => t.recipient.toLowerCase() === daoId.toLowerCase())
  }, [transfers, daoId])

  const outboundTransfers = useMemo(() => {
    if (!transfers) {
      return []
    }

    return transfers.filter(t => t.recipient.toLowerCase() !== daoId.toLowerCase())
  }, [transfers, daoId])

  const shouldDisable = useIsProposalButtonDisabled(daoId)

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Hero>
          <Grid container item direction="column" style={{ gap: 42 }}>
            <Grid container item justifyContent="space-between" alignItems="center">
              <Grid item>
                <HeroTitle>Treasury</HeroTitle>
                {dao && (
                  <CopyAddress
                    address={dao.data.address}
                    justify={isMobileSmall ? "center" : "flex-start"}
                    typographyProps={{
                      variant: "subtitle2"
                    }}
                  />
                )}
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setOpenTransfer(true)}
                      disabled={shouldDisable}
                    >
                      New Transfer
                    </Button>
                    {shouldDisable && (
                      <Tooltip placement="bottom" title="Not on proposal creation period">
                        <InfoIcon color="secondary" />
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {delegate ? (
              <Grid container item justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="body1" color="textPrimary" style={{ fontWeight: "bold", paddingBottom: "3px" }}>
                    Current delegate
                  </Typography>
                  <Link href={`https://baking-bad.org/${daoId}`} target={"_blank"}>
                    <Grid container alignItems="center" style={{ gap: 12 }}>
                      {delegate.alias ? (
                        <Grid item>
                          <Typography variant="subtitle2" color="secondary">
                            {delegate.alias} -
                          </Typography>
                        </Grid>
                      ) : null}
                      <Grid item>
                        <CopyAddress
                          address={delegate.address}
                          justify={isMobileSmall ? "center" : "flex-start"}
                          typographyProps={{
                            variant: "subtitle2",
                            color: "secondary"
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Link>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenDelegationChange(true)}
                        disabled={shouldDisable}
                      >
                        Change delegate
                      </Button>
                      {shouldDisable && (
                        <Tooltip placement="bottom" title="Not on proposal creation period">
                          <InfoIcon color="secondary" />
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Hero>
        <Grid item>
          <BalancesTable />
        </Grid>
        <Grid item>
          <TransfersTable isInbound={true} transfers={inboundTransfers} />
        </Grid>
        <Grid item>
          <TransfersTable isInbound={false} transfers={outboundTransfers} />
        </Grid>
      </Grid>
      <ProposalFormContainer open={openTransfer} handleClose={onCloseTransfer} defaultTab={1} />
      <DelegationChangeProposalForm open={openDelegationChange} handleClose={onCloseDelegationChange} />
    </>
  )
}
