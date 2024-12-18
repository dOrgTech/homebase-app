import { Grid, Typography, useMediaQuery, useTheme, Tooltip, InputAdornment } from "@material-ui/core"
import { CustomFormikTextField, CustomInputContainer, DescriptionText, InfoIconInput } from "components/ui/DaoCreator"
import InputText from "components/ui/InputText"
import { StyledSliderWithValue } from "components/ui/StyledSlider"
import { Field } from "formik"
import { TitleBlock } from "modules/common/TitleBlock"
import React, { useRef } from "react"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

interface EvmDaoQuorumProps {
  // Add props as needed
}

export const EvmDaoQuorum: React.FC<EvmDaoQuorumProps> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { data, getIn, setFieldValue } = useEvmDaoCreateStore()
  return (
    <div className="evm-dao-quorum">
      <TitleBlock
        title="Quorum Settings"
        description={
          <DescriptionText variant="subtitle1">
            These settings will define the quorum settings for your DAO.
          </DescriptionText>
        }
      />
      <StyledSliderWithValue
        defaultValue={getIn("quorum.returnedTokenPercentage")}
        onChange={(newValue: any) => {
          setFieldValue("quorum.returnedTokenPercentage", newValue || 0)
        }}
      />
      <Grid
        container
        item
        xs={isMobile ? 12 : 12}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ marginTop: 16 }}
      >
        <Grid direction="row" item style={{ maxWidth: "60%" }}>
          <Typography variant="subtitle1" color="textSecondary">
            Proposal Threshold ({data?.governanceToken?.symbol} Amount)
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Minimum voting power to submit a proposal
          </Typography>
        </Grid>
        <Grid item>
          <InputText type="number" placeholder="0" name="quorum.proposalThreshold" />
        </Grid>
      </Grid>
    </div>
  )
}

{
  /* <CustomInputContainer>
          <Field
            id="outlined-basic"
            placeholder="0"
            name="quorum.returnedTokenPercentage"
            component={CustomFormikTextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    placement="bottom"
                    title="The percentage of the total token supply that must be held by the DAO members for a proposal to be considered passed."
                  >
                    <InfoIconInput />
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </CustomInputContainer> */
}
