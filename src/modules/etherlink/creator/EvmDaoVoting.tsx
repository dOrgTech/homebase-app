import { Grid, Tooltip, Typography } from "components/ui"
import { InfoRounded } from "components/ui"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import { StyledTextField } from "components/ui"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

import { InputContainer } from "components/ui"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getVotingDefaults } from "./votingDefaults"

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
  const { network } = useTezos()
  const defaultsAppliedRef = React.useRef(false)

  React.useEffect(() => {
    const isEtherlinkTestnet = network === "etherlink_testnet"
    const isEtherlinkMainnet = network === "etherlink_mainnet"

    if (!(isEtherlinkTestnet || isEtherlinkMainnet)) return
    if (defaultsAppliedRef.current) return

    const delayDays = Number(daoData.voting.votingBlocksDay) || 0
    const delayHours = Number(daoData.voting.votingBlocksHours) || 0
    const delayMinutes = Number(daoData.voting.votingBlocksMinutes) || 0
    const delayUnset = delayDays === 0 && delayHours === 0 && delayMinutes === 0
    const votingDefaults = getVotingDefaults(network)

    if (delayUnset) {
      setFieldValue("voting.votingBlocksDay", votingDefaults?.voting.votingBlocksDay || 0)
      setFieldValue("voting.votingBlocksHours", votingDefaults?.voting.votingBlocksHours || 0)
      setFieldValue("voting.votingBlocksMinutes", votingDefaults?.voting.votingBlocksMinutes || 0)
    }

    const durDays = Number(daoData.voting.proposalFlushBlocksDay) || 0
    const durHours = Number(daoData.voting.proposalFlushBlocksHours) || 0
    const durMinutes = Number(daoData.voting.proposalFlushBlocksMinutes) || 0
    const durationUnset = durDays === 0 && durHours === 0 && durMinutes === 0

    if (durationUnset) {
      setFieldValue("voting.proposalFlushBlocksDay", votingDefaults?.voting.proposalFlushBlocksDay || 0)
      setFieldValue("voting.proposalFlushBlocksHours", votingDefaults?.voting.proposalFlushBlocksHours || 0)
      setFieldValue("voting.proposalFlushBlocksMinutes", votingDefaults?.voting.proposalFlushBlocksMinutes || 0)
    }

    const execDays = Number(daoData.voting.proposalExpiryBlocksDay) || 0
    const execHours = Number(daoData.voting.proposalExpiryBlocksHours) || 0
    const execMinutes = Number(daoData.voting.proposalExpiryBlocksMinutes) || 0
    const execUnset = execDays === 0 && execHours === 0 && execMinutes === 0

    if (execUnset) {
      setFieldValue("voting.proposalExpiryBlocksDay", votingDefaults?.voting.proposalExpiryBlocksDay || 0)
      setFieldValue("voting.proposalExpiryBlocksHours", votingDefaults?.voting.proposalExpiryBlocksHours || 0)
      setFieldValue("voting.proposalExpiryBlocksMinutes", votingDefaults?.voting.proposalExpiryBlocksMinutes || 0)
    }

    defaultsAppliedRef.current = true
  }, [network, daoData.voting, setFieldValue])

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
                title="How much time between submitting a proposal and the start of the voting period. Use 0 for immediate start."
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
              <Tooltip placement="bottom" title="How long a proposal will be open for voting. Must be greater than 0.">
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
              <Tooltip
                placement="bottom"
                title="After the proposal passes and before it can be executed. Must be greater than 0."
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
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
