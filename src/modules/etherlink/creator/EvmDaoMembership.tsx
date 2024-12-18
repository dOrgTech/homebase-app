import { useState } from "react"
import { TextField } from "@mui/material"
import { IconButton, styled, Typography } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { Add, RemoveCircleOutline } from "@material-ui/icons"
import { Box } from "@material-ui/core"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

interface Member {
  address: string
  amountOfTokens: number
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

export const EvmDaoMembership = () => {
  const { data, setFieldValue } = useEvmDaoCreateStore()
  const members = data.members as Member[]
  const setMembers = (members: Member[]) => {
    setFieldValue("members", members)
  }

  const handleMemberChange = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  const handleAddMember = () => {
    setMembers([...members, { address: "", amountOfTokens: 0 }])
  }

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <TitleBlock
        title="Initial Members"
        description={
          <DescriptionText variant="subtitle1">
            Specify the address and their voting power of your associated. Voting power is represented by their amount
            of tokens
          </DescriptionText>
        }
      />
      <Box sx={{ width: "100%", margin: "20px 0px" }}>
        <Typography variant="h6" style={{ color: "white" }}>
          Total Tokens:{" "}
          {members.reduce(
            (acc, member) => parseFloat(acc.toString()) + parseFloat(member.amountOfTokens.toString()),
            0
          )}
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        {members.map((member, index) => (
          <Box
            key={index}
            gridGap={2}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4
            }}
          >
            <Box sx={{ width: "70%" }}>
              <StyledTextField
                fullWidth
                variant="standard"
                value={member.address}
                label="Member Address"
                onChange={e => handleMemberChange(index, "address", e.target.value)}
              />
            </Box>
            <Box sx={{ width: "30%", marginLeft: "10px" }}>
              <StyledTextField
                fullWidth
                variant="standard"
                type="number"
                label="Amount of tokens"
                value={member.amountOfTokens}
                onChange={e => handleMemberChange(index, "amountOfTokens", e.target.value)}
              />
            </Box>
            {index >= 1 && (
              <IconButton onClick={() => handleRemoveMember(index)} size="small">
                <RemoveCircleOutline style={{ color: "white" }} />
              </IconButton>
            )}
            {index === 0 && <Box sx={{ width: 40, height: 40 }} />}
          </Box>
        ))}

        <Button variant="outlined" startIcon={<Add />} onClick={handleAddMember}>
          Add Another Member
        </Button>
      </Box>
    </Box>
  )
}
