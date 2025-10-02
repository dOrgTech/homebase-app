import { IconButton, Typography } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { Add, RemoveCircleOutline } from "@material-ui/icons"
import { Box } from "@material-ui/core"
import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"
import { StyledTextField } from "components/ui/StyledTextField"
import { isInvalidEvmAddress } from "../utils"

interface Member {
  address: string
  amountOfTokens: number
  error?: string
}

export const EvmDaoMembership = () => {
  const { data, setFieldValue } = useEvmDaoCreateStore()
  const members = data.members as Member[]
  const isWrappedToken = data.tokenDeploymentMechanism === "wrapped"

  // If wrapped token is selected, show a message instead
  if (isWrappedToken) {
    return (
      <Box>
        <TitleBlock
          title="Initial Members"
          description={
            <DescriptionText variant="subtitle1">
              When using wrapped tokens, initial members cannot be specified during DAO creation.
            </DescriptionText>
          }
        />
        <Box
          style={{
            width: "100%",
            margin: "40px 0px",
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <Typography variant="h6" style={{ color: "white", marginBottom: "16px" }}>
            Wrapped Token Distribution
          </Typography>
          <Typography variant="body1" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "12px" }}>
            Since you're wrapping an existing ERC20 token:
          </Typography>
          <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "8px" }}>
            • The wrapped token will start with 0 initial supply
          </Typography>
          <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "8px" }}>
            • Token holders must wrap their existing tokens after DAO deployment
          </Typography>
          <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "8px" }}>
            • Voting power will be delegated automatically when tokens are wrapped
          </Typography>
          <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            • Users can unwrap tokens at any time to retrieve their original tokens
          </Typography>
        </Box>
      </Box>
    )
  }

  const handleMemberChange = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members]
    if (field === "amountOfTokens" && Number(value) < 0) {
      newMembers[index].error = "Token amount must be non-negative"
      setFieldValue("members", newMembers)
      return
    }
    newMembers[index] = {
      ...newMembers[index],
      [field]: value,
      error: ""
    }
    if (field === "address") {
      const trimmedValue = value.trim()
      const isDuplicateAddress = members.some((member: Member) => member.address === trimmedValue)

      if (isDuplicateAddress) {
        newMembers[index].error = "Address already exists"
      } else if (isInvalidEvmAddress(trimmedValue)) {
        newMembers[index].error = "Enter a valid etherlink address"
      } else {
        newMembers[index].error = ""
      }
    }
    setFieldValue("members", newMembers)
  }

  const handleAddMember = () => {
    setFieldValue("members", [...members, { address: "", amountOfTokens: 0, error: "" }])
  }

  const handleRemoveMember = (index: number) => {
    setFieldValue(
      "members",
      members.filter((_, i) => i !== index)
    )
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
          {members
            .filter(member => member.amountOfTokens > 0)
            .reduce((acc, member) => parseFloat(acc.toString()) + parseFloat(member.amountOfTokens.toString()), 0)}
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
                error={!!member.error}
                helperText={member.error}
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
