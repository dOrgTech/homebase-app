import React, { useEffect } from "react";
import { Box, Button, Grid, styled, Typography } from "@material-ui/core";
import { theme } from "../../../theme";
import { useDAOID } from "../pages/DAO/router";
import { useDAO } from "../../../services/indexer/dao/hooks/useDAO";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import { CREATOR_LOCAL_STORAGE_KEY, INITIAL_STATE, MigrationParams } from "../../creator/state";
import { useDAOHoldings } from "../../../services/contracts/baseDAO/hooks/useDAOHoldings";
import { useTezosBalance } from "../../../services/contracts/baseDAO/hooks/useTezosBalance";
import { useProposeToTransferAll } from "../../../services/contracts/baseDAO/hooks/useProposeToTransferAll";
import { mutezToXtz } from "../../../services/contracts/utils";
import BigNumber from "bignumber.js";

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
    const [_, updateCache] = useLocalStorage<MigrationParams>(CREATOR_LOCAL_STORAGE_KEY, INITIAL_STATE.data);

    const { nftHoldings, tokenHoldings } = useDAOHoldings(daoId);
    const { data: xtzBalance } = useTezosBalance(daoId);
    const { mutate: proposeToTransferAll } = useProposeToTransferAll();

    useEffect(() => {
      if (dao) {
        updateCache({
          template: dao.data.type,
          orgSettings: {
            name: dao.data.name,
            description: dao.data.description,
            governanceToken: {
              address: dao.data.token.contract,
              tokenId: dao.data.token.token_id.toString(),
            },
            administrator: dao.data.admin,
            guardian: dao.data.guardian,
          },
          votingSettings: {
            votingBlocks: Number(dao.data.period),
            proposeStakeRequired: Number(dao.data.extra.frozen_extra_value),
            returnedTokenPercentage: Number(dao.data.extra.returnedPercentage),
            minXtzAmount: mutezToXtz(new BigNumber(dao.data.extra.min_xtz_amount)).toNumber(),
            maxXtzAmount: mutezToXtz(new BigNumber(dao.data.extra.max_xtz_amount)).toNumber(),
            proposalFlushBlocks: Number(dao.data.proposal_flush_level),
            proposalExpiryBlocks: Number(dao.data.proposal_expired_level),
          },
          quorumSettings: {
            quorumThreshold: Number(dao.data.quorum_threshold),
            minQuorumAmount: Number(dao.data.min_quorum_threshold) / 10000,
            maxQuorumAmount: Number(dao.data.max_quorum_threshold) / 10000,
            quorumChange: Number(dao.data.quorum_change) / 10000,
            quorumMaxChange: Number(dao.data.max_quorum_change) / 10000,
          },
        });
      }
    }, [dao, onComplete, updateCache]);

    const onClickTransfer = () => {
      if (dao && xtzBalance) {
        try {
          new Promise(() => {
            proposeToTransferAll({
              dao,
              recipient: newDaoAddress,
              holdings: [...tokenHoldings, ...nftHoldings],
              xtzBalance,
            });
          }).then(() => onComplete());
        } catch (error) {
          onError();
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
