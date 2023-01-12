import {
  Grid,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
  withTheme,
  Box,
  Tooltip,
  InputAdornment
} from "@material-ui/core"
import { TextField } from "formik-material-ui"
import React, { useContext, useEffect, useState } from "react"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import { useHistory } from "react-router"
import { useRouteMatch } from "react-router-dom"

import { CreatorContext, ActionTypes, VotingSettings } from "modules/creator/state"
import { InfoOutlined, InfoRounded } from "@material-ui/icons"
import { getNetworkStats } from "services/bakingBad/stats"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EstimatedTime } from "modules/explorer/components/EstimatedTime"
import { theme } from "../../../theme"
import dayjs from "dayjs"
import { TitleBlock } from "modules/common/TitleBlock"

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

const InfoIconDanger = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.error.main,
  height: 16,
  width: 16
}))

const InfoIconCorrect = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.main,
  height: 16,
  width: 16
}))

const ErrorText = styled(Typography)({
  display: "block",
  fontSize: 14,
  color: "red"
})

const SecondContainer = styled(Grid)({
  marginTop: 10
})

const SpacingContainer = styled(Grid)({
  marginTop: 25
})

const StakeContainer = styled(Grid)({
  display: "block"
})

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  border: "none",
  height: 54,
  marginTop: 14,
  background: "#2F3438",
  borderRadius: 8
}))

const AdditionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 14,
  border: "none",
  height: 54,
  background: "#2F3438",
  borderRadius: 8,
  marginRight: 15,
  ["@media (max-width:1167px)"]: {
    marginRight: 0
  }
}))

const GridItemCenter = styled(Grid)({
  textAlign: "center",
  alignItems: "center",
  display: "flex",
  justifyContent: "flex-end"
})

const ItemContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: "12px 25px"
}))

const GridItemContainer = styled(Grid)(() => ({
  display: "flex",
  alignItems: "center"
}))

const ValueText = styled(Typography)({
  fontSize: 14
})

const StyledSlider = withStyles({
  root: {
    textAlign: "center",
    width: "100%"
  },
  valueLabel: {
    textAlign: "center"
  },
  thumb: {
    height: 20,
    width: 20,
    top: "36.5%",
    backgroundColor: "#fff",
    border: "3px solid #fff"
  },
  track: {
    backgroundColor: "#4BCF93",
    borderRadius: "4px",
    height: 2
  }
})(Slider)

const CustomSliderValue = styled(withTheme(Paper))(props => ({
  boxShadow: "none",
  height: 54,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#2F3438",
  borderRadius: 8,
  width: 97
}))

const Value = styled(Typography)({
  textAlign: "center",
  padding: "15%"
})

const styles = {
  voting: {
    marginTop: 6
  }
}

const InputContainer = styled(Grid)({
  paddingRight: 15,
  ["@media (max-width:1167px)"]: {
    paddingRight: 0
  }
})

const GridNoPadding = styled(Grid)({
  paddingLeft: "8px !important"
})

const InfoBox = styled(Paper)({
  boxShadow: "none",
  border: "none",
  background: "inherit",
  marginTop: 20
})

const validateForm = (values: VotingSettings) => {
  const errors: FormikErrors<VotingSettings> = {}

  Object.keys(values).forEach(key => {
    if ((values[key as keyof VotingSettings] as number | string) === "") {
      errors[key as keyof VotingSettings] = "Required"
    }

    if (Number(values[key as keyof VotingSettings]) < 0) {
      errors[key as keyof VotingSettings] = "Cannot be negative"
    }
  })

  if (!values.votingBlocks || Number(values.votingBlocks) <= 0) {
    errors.votingBlocks = "Must be greater than 0"
  }

  if (!values.proposalFlushBlocks || Number(values.proposalFlushBlocks) <= 0) {
    errors.proposalFlushBlocks = "Must be greater than 0"
  }

  if (
    values.proposalFlushBlocks &&
    values.votingBlocks &&
    Number(values.votingBlocks) * 2 >= Number(values.proposalFlushBlocks)
  ) {
    errors.proposalFlushBlocks = "Must be greater than more than twice the voting cycle duration"
  }

  if (
    values.proposalExpiryBlocks &&
    values.proposalFlushBlocks &&
    Number(values.proposalExpiryBlocks) <= Number(values.proposalFlushBlocks)
  ) {
    errors.proposalExpiryBlocks = "Must be greater than Proposal Execution Delay"
  }

  if (!values.proposalExpiryBlocks || Number(values.proposalExpiryBlocks) <= 0) {
    errors.proposalExpiryBlocks = "Must be greater than 0"
  }

  if (values.proposeStakeRequired <= 0) {
    errors.proposeStakeRequired = "Must be greater than 0"
  }

  if (values.maxXtzAmount <= 0) {
    errors.maxXtzAmount = "Must be greater than 0"
  }

  if (values.minXtzAmount && String(values.maxXtzAmount).length > 255) {
    errors.maxXtzAmount = "Too big, number must be smaller"
  }

  if (values.minXtzAmount && String(values.minXtzAmount).length > 255) {
    errors.minXtzAmount = "Too big, number must be smaller"
  }

  if (values.minXtzAmount > values.maxXtzAmount) {
    errors.maxXtzAmount = "Must be greater than Min. XTZ amount"
  }

  return errors
}

const secondsToTime = (seconds: number) => ({
  days: Math.floor(seconds / (3600 * 24)),
  hours: Math.floor((seconds % (3600 * 24)) / 3600),
  minutes: Math.floor((seconds % 3600) / 60)
})

const useEstimatedBlockTimes = ({
  votingBlocks,
  proposalFlushBlocks,
  proposalExpiryBlocks,
  blockTimeAverage
}: {
  votingBlocks: number
  proposalFlushBlocks: number
  proposalExpiryBlocks: number
  blockTimeAverage: number
}) => {
  const now = dayjs()

  const periodSeconds = votingBlocks * blockTimeAverage
  const flushDelaySeconds = proposalFlushBlocks * blockTimeAverage
  const expiryDelaySeconds = proposalExpiryBlocks * blockTimeAverage

  const creationMoment = now.add(periodSeconds, "s")
  const activeMoment = creationMoment.add(periodSeconds, "s")
  const closeMoment = activeMoment.add(periodSeconds, "s")
  const flushMoment = closeMoment.add(flushDelaySeconds, "s")
  const expiryMoment = flushMoment.add(expiryDelaySeconds, "s")

  return {
    creationMoment,
    activeMoment,
    closeMoment,
    flushMoment,
    expiryMoment,
    votingTime: secondsToTime(periodSeconds),
    flushDelayTime: secondsToTime(flushDelaySeconds),
    expiryDelayTime: secondsToTime(expiryDelaySeconds),
    periodSeconds
  }
}

const GovernanceForm = ({ submitForm, values, setFieldValue, errors, touched, setFieldTouched }: any) => {
  const { network } = useTezos()
  const {
    dispatch,
    state: {
      data: { orgSettings }
    }
  } = useContext(CreatorContext)
  const match = useRouteMatch()
  const history = useHistory()
  const [blockTimeAverage, setBlockTimeAverage] = useState<number>(0)
  const { votingBlocks, proposalFlushBlocks, proposalExpiryBlocks } = values
  const {
    creationMoment,
    closeMoment,
    flushMoment,
    expiryMoment,
    votingTime,
    flushDelayTime,
    activeMoment,
    expiryDelayTime,
    periodSeconds
  } = useEstimatedBlockTimes({
    votingBlocks,
    proposalFlushBlocks,
    proposalExpiryBlocks,
    blockTimeAverage
  })

  useEffect(() => {
    ;(async () => {
      const blockchainInfo = await getNetworkStats(network)
      if (blockchainInfo) {
        setBlockTimeAverage(blockchainInfo.constants.timeBetweenBlocks)
      }
    })()
  }, [network])

  const formatDate = (timeInfo: any) => {
    const values = []
    for (const property in timeInfo) {
      if (timeInfo[property] !== 0) {
        values.push(`${timeInfo[property]} ${property}`)
      }
    }
    if (values.length > 0) {
      return values.toString().replace(",", " and ")
    }
    return "0 minutes"
  }

  const controlMaxFieldLimit = (field: string, value: any) => {
    const itemValue = value.target.value.split(".")
    if ((itemValue[0] && itemValue[0].length > 18) || (itemValue[1] && itemValue[1].length > 8)) {
      return value.preventDefault()
    }
    setFieldValue(field, value.target.value)
  }

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          text: "Continue",
          handler: () => {
            submitForm(values)
          }
        },
        back: {
          text: "Back",
          handler: () => history.push(`dao`)
        }
      })
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values])

  return (
    <>
      <Grid container direction="row">
        <InputContainer item sm={4} xs={12}>
          <SecondContainer container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Voting Cycle Duration
            </Typography>
          </SecondContainer>

          <GridItemContainer>
            <CustomInputContainer item xs={12}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={6}>
                  <Field
                    name="votingBlocks"
                    type="number"
                    placeholder="00"
                    component={TextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "votingBlocks") === 0) {
                        setFieldValue("votingBlocks", "")
                      }
                    }}
                    onChange={(newValue: any) => {
                      setFieldValue("votingBlocks", newValue.target.value)
                    }}
                  />
                </GridItemCenter>
                <GridItemCenter item xs={6}>
                  <Typography color="textSecondary">blocks</Typography>
                </GridItemCenter>
              </ItemContainer>
            </CustomInputContainer>
          </GridItemContainer>

          <Grid item>
            {errors.votingBlocks && touched.votingBlocks ? <ErrorText>{errors.votingBlocks}</ErrorText> : null}
          </Grid>

          <Grid item style={{ margin: "14px 15px", height: 62 }}>
            <EstimatedTime {...votingTime} />
          </Grid>
        </InputContainer>
        <InputContainer item sm={4} xs={12}>
          <SecondContainer container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Proposal Execution Delay
            </Typography>
          </SecondContainer>

          <GridItemContainer>
            <CustomInputContainer item xs={12}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={6}>
                  <Field
                    name="proposalFlushBlocks"
                    type="number"
                    placeholder="00"
                    component={TextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "proposalFlushBlocks") === 0) {
                        setFieldValue("proposalFlushBlocks", "")
                      }
                    }}
                    onChange={(newValue: any) => {
                      setFieldValue("proposalFlushBlocks", newValue.target.value)
                    }}
                  />
                </GridItemCenter>
                <GridItemCenter item xs={6} container direction="row" alignItems="center">
                  <Typography color="textSecondary">blocks</Typography>
                  <CustomTooltip
                    placement="bottom"
                    title="This should always be more than double the duration of a cycle, to ensure the proposal will not become executable in the cycle it was created, nor in the one it was voted on"
                  >
                    {errors.proposalFlushBlocks ? <InfoIconDanger /> : <InfoIconCorrect />}
                  </CustomTooltip>
                </GridItemCenter>
              </ItemContainer>
            </CustomInputContainer>
          </GridItemContainer>

          <Grid item>
            {errors.proposalFlushBlocks && touched.proposalFlushBlocks ? (
              <ErrorText>{errors.proposalFlushBlocks}</ErrorText>
            ) : null}
          </Grid>

          <Grid item style={{ marginLeft: 15, height: 62, marginTop: 14 }}>
            <EstimatedTime {...flushDelayTime} />
          </Grid>
        </InputContainer>

        <InputContainer item sm={4} xs={12}>
          <SecondContainer container direction="row">
            <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
              Proposal Expiry Threshold
            </Typography>
          </SecondContainer>

          <GridItemContainer>
            <CustomInputContainer item xs={12}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={6}>
                  <Field
                    name="proposalExpiryBlocks"
                    type="number"
                    placeholder="00"
                    component={TextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "proposalExpiryBlocks") === 0) {
                        setFieldValue("proposalExpiryBlocks", "")
                      }
                    }}
                    onChange={(newValue: any) => {
                      setFieldValue("proposalExpiryBlocks", newValue.target.value)
                    }}
                  />
                </GridItemCenter>
                <GridItemCenter item xs={6} container direction="row" alignItems="center">
                  <Typography color="textSecondary">blocks</Typography>
                  <CustomTooltip
                    placement="bottom"
                    title="This value must be larger than the proposal execution delay, because if it’s not, then your proposals would never be executable, because they would expire before they could be executed"
                  >
                    {errors.proposalExpiryBlocks ? <InfoIconDanger /> : <InfoIconCorrect />}
                  </CustomTooltip>
                </GridItemCenter>
              </ItemContainer>
            </CustomInputContainer>
          </GridItemContainer>

          <Grid item>
            {errors.proposalExpiryBlocks && touched.proposalExpiryBlocks ? (
              <ErrorText>{errors.proposalExpiryBlocks}</ErrorText>
            ) : null}
          </Grid>

          <Grid item style={{ marginLeft: 15, height: 62, marginTop: 14 }}>
            <EstimatedTime {...expiryDelayTime} />
          </Grid>
        </InputContainer>
      </Grid>

      <InfoBox>
        <TitleBlock
          description={
            <>
              <Typography color={"textSecondary"}>
                You will need to wait for a full cycle before making your first proposal.
              </Typography>
              <Typography color={"textSecondary"} style={{ marginTop: 10 }}>
                {`A proposal will accept votes for ${formatDate(votingTime)} after it is created. Once the voting cycle
                ends, if the proposal is accepted, it will become executable after another ${formatDate(
                  flushDelayTime
                )}.`}
              </Typography>
              <Typography color={"textSecondary"} style={{ marginTop: 10 }}>
                If not executed within {formatDate(expiryDelayTime)} after voting ends, the proposal will expire and
                won&apos;t be available for execution anymore.
              </Typography>
            </>
          }
        ></TitleBlock>
      </InfoBox>

      <Grid item style={{ marginTop: 12 }}>
        <SecondContainer container direction="row">
          <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
            Required Stake to Propose
          </Typography>
        </SecondContainer>

        <StakeContainer container direction="row" alignItems="center">
          <AdditionContainer item xs={12} sm={4}>
            <ItemContainer container direction="row" alignItems="center" justifyContent="center">
              <GridItemCenter item xs={5}>
                <Field
                  name="proposeStakeRequired"
                  type="number"
                  placeholder="00"
                  InputProps={{
                    inputProps: { min: 0, defaultValue: 0, step: 0.01 }
                  }}
                  component={TextField}
                  onClick={() => setFieldTouched("proposeStakeRequired")}
                  onChange={(e: any) => controlMaxFieldLimit("proposeStakeRequired", e)}
                />
              </GridItemCenter>
              <GridItemCenter item xs={7} container direction="row" justifyContent="space-around">
                <Typography color="textSecondary">{orgSettings.governanceToken.tokenMetadata?.symbol || ""}</Typography>
                <Tooltip
                  placement="bottom"
                  title={`Amount of ${
                    orgSettings.governanceToken.tokenMetadata?.symbol || ""
                  } required to make a proposal. Total supply: ${orgSettings.governanceToken.tokenMetadata?.supply}`}
                >
                  <InfoIconInput />
                </Tooltip>
              </GridItemCenter>
            </ItemContainer>
          </AdditionContainer>
          {errors.proposeStakeRequired || errors.proposeStakePercentage ? (
            <ErrorText>{errors.proposeStakeRequired || errors.proposeStakePercentage}</ErrorText>
          ) : null}
        </StakeContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography style={styles.voting} variant="subtitle1" color="textSecondary">
          Returned Stake After Proposal Rejection
        </Typography>

        <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
          <GridNoPadding item xs={8} sm={10}>
            <Field name="returnedTokenPercentage">
              {() => (
                <StyledSlider
                  value={getIn(values, "returnedTokenPercentage")}
                  onChange={(value: any, newValue: any) => setFieldValue("returnedTokenPercentage", newValue || 0)}
                />
              )}
            </Field>
          </GridNoPadding>
          <GridNoPadding item xs={4} sm={2} container direction="row" justifyContent="flex-end">
            <CustomSliderValue>
              <Value variant="subtitle1" color="textSecondary">
                {getIn(values, "returnedTokenPercentage")}%
              </Value>
            </CustomSliderValue>
          </GridNoPadding>
        </Grid>
      </SecondContainer>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Min & Max Transfer Amounts
        </Typography>
      </SpacingContainer>
      <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer container direction="row" alignItems="center" justifyContent="center">
            <GridItemCenter item xs={5}>
              <Field
                name="minXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
                onClick={() => setFieldTouched("minXtzAmount")}
                onChange={(e: any) => controlMaxFieldLimit("minXtzAmount", e)}
              />
            </GridItemCenter>
            <GridItemCenter item xs={7} container direction="row" justifyContent="space-around">
              <ValueText color="textSecondary">Min. XTZ</ValueText>
              <Tooltip placement="bottom" title="Minimum amount of XTZ that can be transferred">
                <InfoIconInput />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.minXtzAmount && touched.minXtzAmount ? <ErrorText>{errors.minXtzAmount}</ErrorText> : null}
        </AdditionContainer>
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer container direction="row" alignItems="center" justifyContent="center">
            <GridItemCenter item xs={5}>
              <Field
                name="maxXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
                onClick={() => setFieldTouched("maxXtzAmount")}
                onChange={(e: any) => controlMaxFieldLimit("maxXtzAmount", e)}
              />
            </GridItemCenter>
            <GridItemCenter item xs={7} container direction="row" justifyContent="space-around">
              <ValueText color="textSecondary">Max. XTZ </ValueText>
              <Tooltip placement="bottom" title="Maximum amount of XTZ that can be transferred">
                <InfoIconInput />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxXtzAmount && touched.maxXtzAmount ? <ErrorText>{errors.maxXtzAmount}</ErrorText> : null}
        </AdditionContainer>
      </Grid>
    </>
  )
}

//TODO: Remove any from this component
export const Governance: React.FC = () => {
  const { dispatch, state, updateCache } = useContext(CreatorContext)
  const { votingSettings } = state.data
  const history = useHistory()

  const saveStepInfo = (values: VotingSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    values.proposalExpiryBlocks = Number(values.proposalExpiryBlocks)
    values.proposalFlushBlocks = Number(values.proposalFlushBlocks)
    values.votingBlocks = Number(values.votingBlocks)
    const newState = {
      ...state.data,
      votingSettings: values
    }
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_VOTING_SETTINGS, voting: values })
    history.push(`quorum`)
  }

  return (
    <Box>
      <TitleBlock
        title={"Proposals & Voting"}
        tooltip={true}
        description={"These settings will define the duration, support and approval required for proposals."}
      ></TitleBlock>

      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={false}
        validate={validateForm}
        onSubmit={saveStepInfo}
        initialValues={votingSettings}
      >
        {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
          return (
            <Form style={{ width: "100%" }}>
              <GovernanceForm
                submitForm={submitForm}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                values={values}
                setFieldTouched={setFieldTouched}
              />
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
