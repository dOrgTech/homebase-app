import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { DescriptionText } from "components/ui/DaoCreator"
import InputText from "components/ui/InputText"
import { StyledSliderWithValue } from "components/ui/StyledSlider"

import { TitleBlock } from "modules/common/TitleBlock"
import React, { useRef } from "react"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

export const EvmDaoQuorum: React.FC = () => {
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
        onChange={(newValue: number) => {
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
          <InputText
            type="number"
            placeholder="0"
            inputProps={{
              min: "0",
              step: "1"
            }}
            name="quorum.proposalThreshold"
            defaultValue={getIn("quorum.proposalThreshold")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue("quorum.proposalThreshold", Number(e.target.value))
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}
