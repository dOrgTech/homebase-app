import React from "react"
import { Grid, styled } from "@material-ui/core"
import { StyledTextField } from "components/ui/StyledTextField"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"

const InputContainer = styled(Grid)({
  background: "#1c2024",
  padding: "16px",
  borderRadius: "4px",
  marginBottom: "8px"
})

export const EvmPropContractCall: React.FC = () => {
  const { daoContractCall, setDaoContractCall } = useEvmProposalOps()
  return (
    <InputContainer container spacing={2}>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.targetAddress}
          label="Target Contract Address"
          variant="outlined"
          onChange={e => setDaoContractCall("targetAddress", e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.value}
          label="Value (XTZ)"
          type="number"
          variant="outlined"
          onChange={e => setDaoContractCall("value", e.target.value)}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.functionDefinition}
          label="Function JSON Definition"
          multiline
          minRows={3}
          variant="outlined"
          onChange={e => setDaoContractCall("functionDefinition", e.target.value)}
        />
      </Grid> */}
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.callData}
          label="Call Data"
          multiline
          minRows={3}
          variant="outlined"
          onChange={e => setDaoContractCall("callData", e.target.value)}
        />
      </Grid>
    </InputContainer>
  )
}
