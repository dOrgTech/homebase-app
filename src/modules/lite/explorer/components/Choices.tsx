import React from "react"
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Radio,
  styled,
  Typography,
  useMediaQuery,
  withStyles
} from "@material-ui/core"
import { theme } from "theme"

import { AddCircleOutline, RemoveCircleOutline, DeleteTwoTone } from "@material-ui/icons"
import { FieldArray, Field } from "formik"
import { TextField as FormikTextField } from "formik-material-ui"
import { useDAOID } from "modules/explorer/pages/DAO/router"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTokenVoteWeight } from "services/contracts/token/hooks/useTokenVoteWeight"
import { useCommunity } from "../hooks/useCommunity"

const ChoicesContainer = styled(Grid)(({ theme }) => ({
  marginTop: 24,
  gap: 24
}))

const ErrorTextChoices = styled(Typography)({
  fontSize: 14,
  color: "red"
})

const RemoveCircle = styled(DeleteTwoTone)(({ theme }) => ({
  color: theme.palette.error.main,
  cursor: "pointer"
}))

const ChoiceText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  marginLeft: 12,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

const VotingContainer = styled(Grid)(({ theme }) => ({
  height: 80,
  [theme.breakpoints.down("sm")]: {
    height: 120
  }
}))

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  icon: {
    "width": 24,
    "height": 24,
    "borderRadius": "50%",
    "backgroundColor": "#2F3438",

    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)"
    }
  },
  checkedIcon: {
    "&:before": {
      borderRadius: "50%",
      display: "block",
      width: 24,
      height: 24,
      background: "radial-gradient(#81FEB7,#81FEB7 27%,#2F3438 27%)",
      content: '""'
    }
  }
})

const CustomFormikChoiceTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial",
      backgroundColor: theme.palette.primary.main,
      marginTop: "0px !important",
      padding: "10px 26px",
      borderRadius: 8
    },
    "& .MuiInputBase-input": {
      textAlign: "initial"
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important"
    }
  },
  disabled: {}
})(FormikTextField)

const MainButton = styled(Button)(({ theme }) => ({
  "&$disabled": {
    boxShadow: "none"
  }
}))

export const Choices: React.FC<any> = ({
  choices,
  submitForm,
  isLoading,
  votingStrategy,
  setFieldValue,
  id,
  touched,
  errors
}) => {
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const community = useCommunity(id)

  const { data: userTokenVoteWeight } = useTokenVoteWeight(data?.data?.token?.contract || community?.tokenAddress)
  const canCreateProposal = userTokenVoteWeight && userTokenVoteWeight.gt(0) ? true : false

  const classes = useStyles()

  return (
    <Grid container direction="column" style={{ gap: 30 }}>
      <ChoicesContainer container direction="column">
        <Grid item>
          <Typography variant={"body1"} color="textPrimary">
            Set Poll Options
          </Typography>
        </Grid>

        <VotingContainer item>
          <Grid container direction={isMobileExtraSmall ? "column" : "row"}>
            <Grid item container direction="row" xs={isMobileExtraSmall ? 12 : 3} alignItems="center">
              <Field name="votingStrategy">
                {() => (
                  <Radio
                    className={classes.root}
                    style={{ paddingLeft: 0 }}
                    checked={Number(votingStrategy) === 0}
                    value={0}
                    disableRipple
                    name="radio-buttons"
                    inputProps={{ "aria-label": "A" }}
                    checkedIcon={<span className={(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    onClick={() => setFieldValue("votingStrategy", 0)}
                  />
                )}
              </Field>
              <ChoiceText color="textPrimary">Single choice</ChoiceText>
            </Grid>

            <Grid item container direction="row" xs={isMobileExtraSmall ? 12 : 3} alignItems="center">
              <Field name="votingStrategy">
                {() => (
                  <Radio
                    style={{ paddingLeft: 0 }}
                    checked={Number(votingStrategy) === 1}
                    value={1}
                    disableRipple={true}
                    name="radio-buttons"
                    inputProps={{ "aria-label": "A" }}
                    checkedIcon={<span className={(classes.icon, classes.checkedIcon)} />}
                    icon={<span className={classes.icon} />}
                    onClick={() => setFieldValue("votingStrategy", 1)}
                  />
                )}
              </Field>
              <ChoiceText color="textPrimary">Multiple choice</ChoiceText>
            </Grid>
          </Grid>
        </VotingContainer>

        <FieldArray
          name="choices"
          render={arrayHelpers => (
            <Grid container direction="row" spacing={2}>
              {choices && choices.length > 0
                ? choices.map((choice: any, index: number) => (
                    <Grid item xs={isMobileExtraSmall ? 12 : 6} key={index}>
                      <Field
                        type="text"
                        name={`choices[${index}]`}
                        placeholder={`Option ${index + 1}`}
                        component={CustomFormikChoiceTextField}
                        InputProps={{
                          endAdornment:
                            index !== 0 && index === choices.length - 1 ? (
                              <InputAdornment position="start">
                                <RemoveCircle
                                  onClick={() => {
                                    if (index !== 0) {
                                      arrayHelpers.remove(index)
                                    }
                                  }}
                                />
                              </InputAdornment>
                            ) : null
                        }}
                      />
                    </Grid>
                  ))
                : null}

              <Grid
                container
                alignItems={"center"}
                style={{ gap: 10, cursor: "pointer" }}
                onClick={() => arrayHelpers.insert(choices.length, "")}
                item
                xs={isMobileExtraSmall ? 12 : 3}
              >
                <IconButton size="small">
                  <AddCircleOutline htmlColor={theme.palette.secondary.main} />
                </IconButton>
                <Typography style={{ fontWeight: 300 }} variant={"body1"} color={"secondary"}>
                  Add Choice
                </Typography>
              </Grid>
            </Grid>
          )}
        />
        {errors && touched ? <ErrorTextChoices>{errors}</ErrorTextChoices> : null}
      </ChoicesContainer>
      <Grid container style={{ gap: 10, marginTop: 31 }}>
        {!isLoading ? (
          <MainButton disabled={!canCreateProposal} variant="contained" color="secondary" onClick={submitForm}>
            {canCreateProposal ? "Create Proposal" : "No Voting Weight"}
          </MainButton>
        ) : (
          <CircularProgress color="secondary" />
        )}
      </Grid>
    </Grid>
  )
}
