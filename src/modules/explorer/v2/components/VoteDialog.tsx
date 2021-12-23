import React, {useCallback} from "react";
import {Grid, Typography, TextField, Button, useTheme} from "@material-ui/core";
import {useParams} from "react-router-dom";
import {useVote} from "services/contracts/baseDAO/hooks/useVote";
import BigNumber from "bignumber.js";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {useDAOID} from "../pages/DAO/router";
import {ResponsiveDialog} from "./ResponsiveDialog";
import {useAgoraTopic} from "../../../../services/agora/hooks/useTopic";
import {useProposal} from "../../../../services/indexer/dao/hooks/useProposal";
import {toShortAddress} from "../../../../services/contracts/utils";
import {ProposalFormInput} from "../../components/ProposalFormInput";

export const VoteDialog: React.FC<{ support: boolean; open: boolean; onClose: () => void }> = ({
                                                                                                 support,
                                                                                                 onClose,
                                                                                                 open
                                                                                               }) => {
  const [amount, setAmount] = React.useState<string>("0");
  const {proposalId} = useParams<{
    proposalId: string;
  }>();
  const daoId = useDAOID();
  const {data: dao} = useDAO(daoId);
  const {data: proposal} = useProposal(daoId, proposalId)
  const {data: agoraPost} = useAgoraTopic(Number(proposal?.metadata.agoraPostId));

  const {mutate} = useVote();
  const theme = useTheme();

  const onSubmit = useCallback(async () => {
    if (dao) {
      mutate({
        proposalKey: proposalId,
        dao,
        amount: new BigNumber(amount),
        support,
      });

      onClose();
    }
  }, [amount, dao, mutate, onClose, proposalId, support]);

  return (
    <>
      <ResponsiveDialog
        open={open}
        onClose={onClose}
        title={support ? "Support" : "Oppose"}
        customTitleColor={support ? theme.palette.secondary.main : "#FF5555"}
      >
        <Grid container direction={"column"} style={{gap: 36}}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Confirm your vote to {support ? "support" : "oppose"} Proposal #{toShortAddress(proposalId)}
            </Typography>
          </Grid>

          {
            agoraPost && <Grid item>
              <Typography color="textPrimary" variant="body2">
                {agoraPost.title}
              </Typography>
            </Grid>
          }

          <Grid item container direction="row">
            <Grid item xs>
              <ProposalFormInput label={"Amount"}>
                <TextField
                  type="number"
                  value={amount}
                  placeholder="Type an Amount"
                  InputProps={{disableUnderline: true}}
                  onChange={(newValue) => setAmount(newValue.target.value)}
                />
              </ProposalFormInput>
            </Grid>
          </Grid>

          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Button
              variant="contained"
              color={"secondary"}
              disabled={!amount}
              onClick={onSubmit}
            >
              SUBMIT
            </Button>
          </Grid>

        </Grid>
      </ResponsiveDialog>
    </>
  );
};