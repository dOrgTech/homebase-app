import { useState } from "react"
import { IconButton, Button, Add, RemoveCircleOutline, Box, StyledTextField, Grid, Typography } from "components/ui"
import { DescriptionText, CustomInputContainer } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

interface RegistryEntry {
  key: string
  value: string
}

// Use StyledTextField from src/components/ui

const updateRegistryStore = (entries: RegistryEntry[], setFieldValue: (field: string, value: any) => void) => {
  const registryObject = entries.reduce((acc, entry) => {
    if (entry.key) {
      acc[entry.key] = entry.value
    }
    return acc
  }, {} as Record<string, string>)
  setFieldValue("registry", registryObject)
}

export const EvmDaoRegistry = () => {
  const { data, setFieldValue } = useEvmDaoCreateStore()
  const [entries, setEntries] = useState<RegistryEntry[]>(
    Object.keys(data?.registry).length !== 0
      ? Object.entries(data.registry).map(([key, value]) => ({ key, value: value as string }))
      : [{ key: "", value: "" }]
  )

  const handleEntryChange = (index: number, field: keyof RegistryEntry, value: string) => {
    const newEntries = [...entries]

    if (field === "key" && value) {
      const isDuplicateKey = entries.some((entry, i) => i !== index && entry.key === value)
      if (isDuplicateKey) {
        console.error("Duplicate key found in Registry")
        return
      }
    }

    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)
    updateRegistryStore(newEntries, setFieldValue)
  }

  const handleAddEntry = () => {
    setEntries([...entries, { key: "", value: "" }])
  }

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index)
    setEntries(newEntries)
    updateRegistryStore(newEntries, setFieldValue)
  }

  return (
    <Box>
      <TitleBlock
        title="DAO Registry"
        description={
          <DescriptionText variant="subtitle1">
            Add key-value pairs to your DAO's registry. This can include information like roles, mission statements, or
            any other metadata.
          </DescriptionText>
        }
      />
      <Box style={{ width: "100%" }}>
        {entries.map((entry, index) => (
          <Grid key={index} container spacing={2} style={{ marginBottom: 32 }} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <Typography variant="subtitle1" color="textSecondary">
                Key
              </Typography>
              <CustomInputContainer>
                <StyledTextField
                  value={entry.key}
                  placeholder="Enter key"
                  onChange={e => handleEntryChange(index, "key", e.target.value)}
                />
              </CustomInputContainer>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Typography variant="subtitle1" color="textSecondary">
                Value
              </Typography>
              <CustomInputContainer>
                <StyledTextField
                  value={entry.value}
                  placeholder="Enter value"
                  onChange={e => handleEntryChange(index, "value", e.target.value)}
                />
              </CustomInputContainer>
            </Grid>
            <Grid item xs={12} sm={2} style={{ textAlign: "center" }}>
              {index >= 1 && (
                <IconButton onClick={() => handleRemoveEntry(index)} size="small">
                  <RemoveCircleOutline style={{ color: "white" }} />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Button variant="outlined" startIcon={<Add />} onClick={handleAddEntry}>
          Add Registry Entry
        </Button>
      </Box>
    </Box>
  )
}
