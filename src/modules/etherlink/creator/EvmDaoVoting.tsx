import { Grid, Tooltip, Typography } from "components/ui"
import { InfoRounded } from "components/ui"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import { StyledTextField } from "components/ui"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

import { InputContainer } from "components/ui"

const styles = {
  voting: {
    marginTop: 6,
    marginBottom: 16,
    fontWeight: 400,
    fontSize: 18,
    width: "75%"
  }
}

const initialFormValues = {
  votingBlocksDay: 0,
  votingBlocksHours: 0,
  votingBlocksMinutes: 0,
  proposalFlushBlocksDay: 0,
  proposalFlushBlocksHours: 0,
  proposalFlushBlocksMinutes: 0,
  proposalExpiryBlocksDay: 0,
  proposalExpiryBlocksHours: 0,
  proposalExpiryBlocksMinutes: 0
}
type IEvmVotingFormValues = typeof initialFormValues

interface EvmDaoVotingProps {
  onSubmit?: (values: IEvmVotingFormValues) => void
  initialValues?: IEvmVotingFormValues
}

export const EvmDaoVoting: React.FC<EvmDaoVotingProps> = ({ onSubmit: _onSubmit }) => {
  const { data: daoData, setFieldValue } = useEvmDaoCreateStore()
  // const handleSubmit = (values: IEvmVotingFormValues) => {
  //   if (onSubmit) {
  //     onSubmit(values)
  //   }
  // }

  return (
    <div className="evm-dao-voting">
      <TitleBlock
        title="Proposals & Voting"
        description={
          <DescriptionText variant="subtitle1">
            These settings will define the voting configuration for your DAO.
          </DescriptionText>
        }
      />

      <Grid container direction="row">
        <InputContainer item sm={4} xs={12}>
          <Grid container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Voting Delay
              <Tooltip
                placement="bottom"
                title="How much time between submitting a proposal and the start of the voting period"
              >
                <InfoRounded style={{ cursor: "default", height: 16, width: 16, marginLeft: 8 }} />
              </Tooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksDay}
                  onChange={e => setFieldValue("voting.votingBlocksDay", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                days
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksHours}
                  onChange={e => setFieldValue("voting.votingBlocksHours", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                hours
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksMinutes}
                  onChange={e => setFieldValue("voting.votingBlocksMinutes", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                minutes
              </Typography>
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer item sm={4} xs={12}>
          <Grid container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Voting Duration
              <Tooltip placement="bottom" title="How long a proposal will be open for voting">
                <InfoRounded style={{ cursor: "default", height: 16, width: 16, marginLeft: 8 }} />
              </Tooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksDay}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksDay", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                days
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksHours}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksHours", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                hours
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksMinutes}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksMinutes", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                minutes
              </Typography>
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer item sm={4} xs={12}>
          <Grid container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Execution Delay
              <Tooltip placement="bottom" title="After the proposal passes and before it can be executed.">
                <InfoRounded style={{ cursor: "default", height: 16, width: 16, marginLeft: 8 }} />
              </Tooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksDay}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksDay", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                days
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksHours}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksHours", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                hours
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid
                item
                style={{
                  background: "#2F3438",
                  borderRadius: 8,
                  width: 72,
                  minHeight: 59,
                  marginBottom: 16,
                  display: "grid"
                }}
              >
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksMinutes}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksMinutes", parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Typography color="textSecondary" style={{ marginTop: -20, marginLeft: 16, fontWeight: 300 }}>
                minutes
              </Typography>
            </Grid>
          </Grid>
        </InputContainer>
      </Grid>
    </div>
  )
}
