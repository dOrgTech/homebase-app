import { Grid, Box, Typography, Button, Link, styled, TextField, Theme } from "@material-ui/core";
import React, {useEffect, useState} from "react";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import {CREATOR_LOCAL_STORAGE_KEY, INITIAL_STATE, MigrationParams} from "../../creator/state";
import {useDAO} from "../../../services/indexer/dao/hooks/useDAO";
import {useDAOID} from "../pages/DAO/router";
import {mutezToXtz} from "../../../services/contracts/utils";
import {BigNumber} from "bignumber.js";
import {useDAOHoldings} from "../../../services/contracts/baseDAO/hooks/useDAOHoldings";
import {useProposeToTransferAll} from "../../../services/contracts/baseDAO/hooks/useProposeToTransferAll";
import {useTezosBalance} from "../../../services/contracts/baseDAO/hooks/useTezosBalance";

const StyledInput = styled(TextField)(({ theme }: { theme: Theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 8,
    background: theme.palette.primary.main,
    height: 54,
    padding: "7px 20px",
    textAlign: "initial",
  },
}));

const ButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  width: "100%",
});

export const MigrationCreateStep: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [daoAddress, setDaoAddress] = useState<string>("");
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateCache] = useLocalStorage<MigrationParams>(
    CREATOR_LOCAL_STORAGE_KEY,
    INITIAL_STATE.data
  );

  const { nftHoldings, tokenHoldings } = useDAOHoldings(daoId)
  const { data: xtzBalance } = useTezosBalance(daoId)
  const { mutate: proposeToTransferAll } = useProposeToTransferAll()

  // useEffect(() => {
  //   if(dao) {
  //     updateCache({
  //       template: dao.data.type,
  //       orgSettings: {
  //         name: dao.data.name,
  //         description: dao.data.description,
  //         governanceToken: {
  //           address: dao.data.token.contract,
  //           tokenId: dao.data.token.token_id.toString(),
  //         },
  //         administrator: dao.data.admin,
  //         guardian: dao.data.guardian,
  //       },
  //       votingSettings: {
  //         votingBlocks: Number(dao.data.period),
  //         proposeStakeRequired: Number(dao.data.extra.frozen_extra_value),
  //         frozenScaleValue: Number(dao.data.extra.slash_scale_value),
  //         minXtzAmount: mutezToXtz(new BigNumber(dao.data.extra.min_xtz_amount)).toNumber(),
  //         maxXtzAmount: mutezToXtz(new BigNumber(dao.data.extra.max_xtz_amount)).toNumber(),
  //         proposalFlushBlocks: Number(dao.data.proposal_flush_level),
  //         proposalExpiryBlocks: Number(dao.data.proposal_expired_level),
  //       },
  //       quorumSettings: {
  //         quorumThreshold: Number(dao.data.quorum_threshold),
  //         minQuorumAmount: Number(dao.data.min_quorum_threshold) / 10000,
  //         maxQuorumAmount: Number(dao.data.max_quorum_threshold) / 10000,
  //         quorumChange: Number(dao.data.quorum_change) / 10000,
  //         quorumMaxChange: Number(dao.data.max_quorum_change) / 10000,
  //       },
  //     })
  //   }
  // }, [dao, updateCache])

  const onClickTransfer = () => {
    if(dao && xtzBalance) {
      proposeToTransferAll({
        dao,
        recipient: "tz1ZQnHjvi25qQzoo9AFThPukMmieP6e4sk2",
        holdings: [...tokenHoldings, ...nftHoldings],
        xtzBalance
      })
    }
  }

  return (
    <Grid container>
      <Box>
        <Typography variant='subtitle2' color='textPrimary'>
          Go to the{" "}
          <Link target='_blank' href='/creator/dao' color='secondary'>
            DAO creator
          </Link>{" "}
          and create a new DAO. Fields will be auto-populated with the current DAO&apos;s config.
        </Typography>
      </Box>
      <Box marginTop={2}>
        <Typography variant='subtitle2' color='textPrimary'>
          When you&apos;re finished, please paste your DAO&apos;s address here:
        </Typography>
      </Box>
      <Box marginTop={2} style={{ width: "100%" }}>
        <StyledInput
          type='text'
          placeholder='KT1...'
          value={daoAddress}
          InputProps={{ disableUnderline: true }}
          onChange={(newValue) => setDaoAddress(newValue.target.value)}
        />
      </Box>
      <ButtonContainer>
        <Button variant='contained' color='secondary' onClick={onClick}>
          Continue
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        <Button variant='contained' color='secondary' onClick={onClickTransfer}>
          Transfer All
        </Button>
      </ButtonContainer>
    </Grid>
  );
};
