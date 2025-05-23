import { Grid, styled, Tooltip, Typography, withStyles } from "@material-ui/core"
import { InfoRounded } from "@material-ui/icons"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import { TextField } from "@material-ui/core"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

const TimeBox = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  borderRadius: 8,
  width: 72,
  minHeight: 59,
  marginBottom: 16,
  display: "grid",
  [theme.breakpoints.down("sm")]: {
    width: 160
  }
}))

const TimeText = styled(Typography)({
  marginTop: -20,
  marginLeft: 16,
  fontWeight: 300
})

const CustomTooltip = styled(Tooltip)({
  marginLeft: 8
})

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16,
  marginLeft: 8
}))

const InputContainer = styled(Grid)({
  paddingRight: 15,
  ["@media (max-width:1167px)"]: {
    paddingRight: 0
  }
})

const StyledTextField = withStyles({
  root: {
    "& input": {
      textAlign: "center",
      color: "#fff"
    }
  }
})(TextField)

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

export const EvmDaoVoting: React.FC<EvmDaoVotingProps> = ({ onSubmit, initialValues = initialFormValues }) => {
  const { data: daoData, touched, errors, setFieldValue } = useEvmDaoCreateStore()
  const handleSubmit = (values: IEvmVotingFormValues) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <div className="evm-dao-voting">
      <TitleBlock
        title="Durations"
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
              <CustomTooltip
                placement="bottom"
                title="How much time between submitting a proposal and the start of the voting period"
              >
                <InfoIconInput />
              </CustomTooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksDay}
                  onChange={e => setFieldValue("voting.votingBlocksDay", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">days</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksHours}
                  onChange={e => setFieldValue("voting.votingBlocksHours", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">hours</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.votingBlocksMinutes}
                  onChange={e => setFieldValue("voting.votingBlocksMinutes", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">minutes</TimeText>
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer item sm={4} xs={12}>
          <Grid container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Voting Duration
              <CustomTooltip placement="bottom" title="How long a proposal will be open for voting">
                <InfoIconInput />
              </CustomTooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksDay}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksDay", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">days</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksHours}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksHours", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">hours</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalFlushBlocksMinutes}
                  onChange={e => setFieldValue("voting.proposalFlushBlocksMinutes", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">minutes</TimeText>
            </Grid>
          </Grid>
        </InputContainer>

        <InputContainer item sm={4} xs={12}>
          <Grid container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Execution Delay
              <CustomTooltip placement="bottom" title="After the proposal passes and before it can be executed.">
                <InfoIconInput />
              </CustomTooltip>
            </Typography>
          </Grid>

          <Grid container direction="column">
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksDay}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksDay", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">days</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksHours}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksHours", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">hours</TimeText>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <TimeBox item>
                <StyledTextField
                  style={{ margin: "auto" }}
                  variant="standard"
                  type="number"
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  value={daoData.voting.proposalExpiryBlocksMinutes}
                  onChange={e => setFieldValue("voting.proposalExpiryBlocksMinutes", e.target.value)}
                />
              </TimeBox>
              <TimeText color="textSecondary">minutes</TimeText>
            </Grid>
          </Grid>
        </InputContainer>
      </Grid>
    </div>
  )
}
