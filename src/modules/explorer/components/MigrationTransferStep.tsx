import React from "react";
import { Box, Button, Grid, styled, Typography } from "@material-ui/core";
import { theme } from "../../../theme";
import { useDAOID } from "../pages/DAO/router";
import { useDAO } from "../../../services/indexer/dao/hooks/useDAO";
import { useDAOHoldings } from "../../../services/contracts/baseDAO/hooks/useDAOHoldings";
import { useTezosBalance } from "../../../services/contracts/baseDAO/hooks/useTezosBalance";
import { useProposeToTransferAll } from "../../../services/contracts/baseDAO/hooks/useProposeToTransferAll";

const SpanStyled = styled("span")({
  color: theme.palette.secondary.main,
});

const ButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  width: "100%",
});

export const MigrationTransferStep: React.FC<{ newDaoAddress: string; onComplete: () => void; onError: () => void }> =
  ({ newDaoAddress, onComplete, onError }) => {
    const daoId = useDAOID();
    const { data: dao } = useDAO(daoId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const { nftHoldings, tokenHoldings } = useDAOHoldings(daoId);
    const { data: xtzBalance } = useTezosBalance(daoId);
    const { mutateAsync: proposeToTransferAll } = useProposeToTransferAll();
    const onClickTransfer = async () => {
      if (dao && xtzBalance) {
        try {
          await proposeToTransferAll({
            dao,
            recipient: newDaoAddress,
            holdings: [...tokenHoldings, ...nftHoldings],
            xtzBalance,
          }).then(() => {
            onComplete();
          });
        } catch (error) {
          onError();
          return;
        }
      }
    };
    return (
      <Grid container>
        <Typography>
          We&apos;re going to create a new proposal to transfer all to <SpanStyled>{newDaoAddress}</SpanStyled>
        </Typography>
        <ButtonContainer>
          <Button variant='contained' color='secondary' onClick={onClickTransfer}>
            Transfer All
          </Button>
        </ButtonContainer>
      </Grid>
    );
  };
