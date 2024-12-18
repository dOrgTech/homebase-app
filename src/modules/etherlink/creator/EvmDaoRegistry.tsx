import { useState } from "react"
import { TextField } from "@mui/material"
import { IconButton, styled } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { Add, RemoveCircleOutline } from "@material-ui/icons"
import { Box } from "@material-ui/core"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

interface RegistryEntry {
  key: string
  value: string
}

const StyledTextField = styled(TextField)({
  "& .MuiInput-root": {
    color: "#fff",
    paddingBottom: "4px"
  },
  "& label": {
    color: "#fff"
  },
  "& label.Mui-focused": {
    color: "#fff"
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#ccc"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#fff"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff"
    },
    "&:hover fieldset": {
      borderColor: "#fff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff"
    }
  }
})

export const EvmDaoRegistry = () => {
  const { data, setFieldValue } = useEvmDaoCreateStore()
  const [entries, setEntries] = useState<RegistryEntry[]>(
    Object.keys(data?.registry).length !== 0
      ? Object.entries(data.registry).map(([key, value]) => ({ key, value: value as string }))
      : [{ key: "", value: "" }]
  )

  const handleEntryChange = (index: number, field: keyof RegistryEntry, value: string) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)

    // Update the registry object in the store
    const registryObject = newEntries.reduce((acc, entry) => {
      if (entry.key) {
        acc[entry.key] = entry.value
      }
      return acc
    }, {} as Record<string, string>)

    setFieldValue("registry", registryObject)
  }

  const handleAddEntry = () => {
    setEntries([...entries, { key: "", value: "" }])
  }

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index)
    setEntries(newEntries)

    // Update the registry object in the store
    const registryObject = newEntries.reduce((acc, entry) => {
      if (entry.key) {
        acc[entry.key] = entry.value
      }
      return acc
    }, {} as Record<string, string>)

    setFieldValue("registry", registryObject)
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
      <Box sx={{ width: "100%" }}>
        {entries.map((entry, index) => (
          <Box
            key={index}
            gridGap={2}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4
            }}
          >
            <Box sx={{ width: "45%" }}>
              <StyledTextField
                fullWidth
                variant="standard"
                value={entry.key}
                label="Key"
                onChange={e => handleEntryChange(index, "key", e.target.value)}
              />
            </Box>
            <Box sx={{ width: "45%", marginLeft: "10px" }}>
              <StyledTextField
                fullWidth
                variant="standard"
                value={entry.value}
                label="Value"
                onChange={e => handleEntryChange(index, "value", e.target.value)}
              />
            </Box>
            {index >= 1 && (
              <IconButton onClick={() => handleRemoveEntry(index)} size="small">
                <RemoveCircleOutline style={{ color: "white" }} />
              </IconButton>
            )}
            {index === 0 && <Box sx={{ width: 40, height: 40 }} />}
          </Box>
        ))}

        <Button variant="outlined" startIcon={<Add />} onClick={handleAddEntry}>
          Add Registry Entry
        </Button>
      </Box>
    </Box>
  )
}
