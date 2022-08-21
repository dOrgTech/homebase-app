import {
  Button,
  Grid, Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {CopyAddress} from "modules/common/CopyAddress";
import {ProposalFormContainer} from "modules/explorer/components/ProposalForm";

import React, {useMemo, useState} from "react";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {Hero} from "../../components/Hero";
import {HeroTitle} from "../../components/HeroTitle";
import {useDAOID} from "../DAO/router";
import {BalancesTable} from "./components/BalancesTable";
import {TransfersTable} from "./components/TransfersTable";
import {useTransfers} from "../../../../services/contracts/baseDAO/hooks/useTransfers";
import {InfoIcon} from "../../components/styled/InfoIcon";
import {useIsProposalButtonDisabled} from "../../../../services/contracts/baseDAO/hooks/useCycleInfo";
import { styled, Typography } from "@material-ui/core";
import { SmallButton } from '../../../common/SmallButton';
import { MainButton } from '../../../common/MainButton';
import { DelegationChangeProposalForm } from "modules/explorer/components/DelegationChangeProposalForm";
import { useDelegate } from "services/contracts/baseDAO/hooks/useDelegate";


const DelegateTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: 3
}))

export const Treasury: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const daoId = useDAOID();
  const {data: dao} = useDAO(daoId);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openDelegationChange, setOpenDelegationChange] = useState(false);

  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }
  const {data: transfers} = useTransfers(daoId);
  const {data: delegate} = useDelegate(daoId);

  const inboundTransfers = useMemo(() => {
    if (!transfers) {
      return [];
    }

    return transfers.filter(
      (t) => t.recipient.toLowerCase() === daoId.toLowerCase()
    );
  }, [transfers, daoId]);

  const outboundTransfers = useMemo(() => {
    if (!transfers) {
      return [];
    }

    return transfers.filter(
      (t) => t.recipient.toLowerCase() !== daoId.toLowerCase()
    );
  }, [transfers, daoId]);

  const shouldDisable = useIsProposalButtonDisabled(daoId);

  return (
    <>
      <Grid container direction="column" style={{gap: 42}}>
        <Hero>
          <Grid container style={{display: "flex", justifyContent: "space-between", }}>
          <Grid item>
            <HeroTitle>Treasury</HeroTitle>
            {dao && (
              <CopyAddress
                address={dao.data.address}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2",
                }}
              />
            )}
          </Grid>
          <Grid item style={{display: "flex", alignItems: "center", }}>
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
                  <Tooltip
                    placement="bottom"
                    title="Not on proposal creation period"
                  >
                    <InfoIcon color="secondary" />
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
          </Grid>
          
          <Grid container style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
          <Grid item>
            <DelegateTitle>Current Delegate</DelegateTitle>
            {delegate ? (
              <CopyAddress
                address={delegate.address}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2",
                }}
              />
            ): (
              dao &&
              <CopyAddress
                address={dao.data.address}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2",
                }}
              />
            )}
            </Grid>
            <Grid item style={{display: "flex", alignItems: "center"}}>
            <Grid container>
              <Grid item>
                <SmallButton
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenDelegationChange(true)}
                  disabled={shouldDisable}
                >
                  Change Delegate
                </SmallButton>
                {shouldDisable && (
                  <Tooltip
                    placement="bottom"
                    title="Not on proposal creation period"
                  >
                    <InfoIcon color="secondary" />
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
          </Grid>

        </Hero>
        <Grid item>
          <BalancesTable/>
        </Grid>
        <Grid item>
          <TransfersTable isInbound={true} transfers={inboundTransfers}/>
        </Grid>
        <Grid item>
          <TransfersTable isInbound={false} transfers={outboundTransfers}/>
        </Grid>
      </Grid>
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultTab={1}
      />
      <DelegationChangeProposalForm
        open={openDelegationChange}
        handleClose={()=>setOpenDelegationChange(false)}
      />
    </>
  );
};
