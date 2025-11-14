import React from "react"
import { Grid, FormField, FormTextField } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
// Use FormField wrappers to match Tezos input styling

export const EvmPropEditRegistry: React.FC = () => {
  const { daoRegistry, setDaoRegistry } = useEvmProposalOps()

  return (
    <Grid container direction="column" style={{ gap: 18 }}>
      <Grid item xs={12}>
        <FormField label="Registry Key" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
          <FormTextField
            defaultValue={daoRegistry.key}
            onChange={e => {
              setDaoRegistry("key", e.target.value)
            }}
            inputProps={{ style: { fontSize: 14 } }}
          />
        </FormField>
      </Grid>
      <Grid item xs={12}>
        <FormField label="Registry Value" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
          <FormTextField
            defaultValue={daoRegistry.value}
            onChange={e => {
              setDaoRegistry("value", e.target.value)
            }}
            inputProps={{ style: { fontSize: 14 } }}
          />
        </FormField>
      </Grid>
    </Grid>
  )
}
