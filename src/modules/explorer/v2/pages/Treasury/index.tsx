import {
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { CopyAddress } from "modules/common/CopyAddress";
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm";

import React, { useState } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { Hero } from "../../components/Hero";
import { HeroTitle } from "../../components/HeroTitle";
import { useDAOID } from "../DAO/router";
import { BalancesTable } from "./components/BalancesTable";
import { TransfersTable } from "./components/TransfersTable";

export const Treasury: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const [openTransfer, setOpenTransfer] = useState(false);
  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Hero>
          <Grid item>
            <HeroTitle>Treasury</HeroTitle>
            {dao && (
              <CopyAddress
                address={dao.data.address}
                justify={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2",
                }}
              />
            )}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenTransfer(true)}
            >
              New Transfer
            </Button>
          </Grid>
        </Hero>
        <Grid item>
          <BalancesTable/>
        </Grid>
        <Grid item>
          <TransfersTable />
        </Grid>
      </Grid>
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultTab={1}
      />
    </>
  );
};
