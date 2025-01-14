import React from "react"
import { Grid, styled } from "@material-ui/core"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledTextField } from "components/ui/StyledTextField"

const InputContainer = styled(Grid)({
  background: "#1c2024",
  padding: "16px",
  borderRadius: "4px",
  marginBottom: "8px"
})

export const EvmPropEditRegistry: React.FC = () => {
  const { daoRegistry, setDaoRegistry } = useEvmProposalOps()

  const handleKeyChange = (value: string) => {
    setDaoRegistry("key", value)
  }

  const handleValueChange = (value: string) => {
    setDaoRegistry("value", value)
  }

  return (
    <InputContainer container spacing={2}>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoRegistry.key}
          label="Registry Key"
          variant="outlined"
          onChange={e => handleKeyChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoRegistry.value}
          label="Registry Value"
          variant="outlined"
          onChange={e => handleValueChange(e.target.value)}
        />
      </Grid>
    </InputContainer>
  )
}