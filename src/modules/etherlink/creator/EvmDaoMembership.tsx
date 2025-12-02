import { IconButton, Typography, Button, Add, RemoveCircleOutline, Box, StyledTextField, Grid } from "components/ui"
import { DescriptionText, CustomInputContainer, ErrorText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"
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

  const wrappedTokenPoints = [
    "The wrapped token will start with 0 initial supply",
    "Token holders must wrap their existing tokens after DAO deployment",
    "Voting power will be delegated automatically when tokens are wrapped",
    "Users can unwrap tokens at any time to retrieve their original tokens"
  ]

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
          <Box component="ul" style={{ margin: 0, paddingLeft: "20px" }}>
            {wrappedTokenPoints.map(point => (
              <Typography
                key={point}
                variant="body2"
                component="li"
                style={{ color: "rgba(255, 255, 255, 0.7)", margin: "0 0 4px", lineHeight: 1.4 }}
              >
                {point}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
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
      <Box style={{ width: "100%", margin: "20px 0px" }}>
        <Typography variant="h6" style={{ color: "white" }}>
          Total Tokens:{" "}
          {members
            .filter(member => member.amountOfTokens > 0)
            .reduce((acc, member) => parseFloat(acc.toString()) + parseFloat(member.amountOfTokens.toString()), 0)}
        </Typography>
      </Box>
      <Box style={{ width: "100%" }}>
        {members.map((member, index) => (
          <Grid key={index} container spacing={2} style={{ marginBottom: 32 }} alignItems="flex-end">
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle1" color="textSecondary">
                Member Address
              </Typography>
              <CustomInputContainer>
                <StyledTextField
                  value={member.address}
                  placeholder="0x..."
                  onChange={e => handleMemberChange(index, "address", e.target.value)}
                />
              </CustomInputContainer>
              {member.error && <ErrorText>{member.error}</ErrorText>}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle1" color="textSecondary">
                Amount of Tokens
              </Typography>
              <CustomInputContainer>
                <StyledTextField
                  type="number"
                  placeholder="0"
                  value={member.amountOfTokens}
                  inputProps={{ min: 0, step: 1 }}
                  onChange={e => handleMemberChange(index, "amountOfTokens", e.target.value)}
                />
              </CustomInputContainer>
            </Grid>
            <Grid item xs={12} sm={2} style={{ textAlign: "center" }}>
              {index >= 1 && (
                <IconButton onClick={() => handleRemoveMember(index)} size="small">
                  <RemoveCircleOutline style={{ color: "white" }} />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Button variant="outlined" startIcon={<Add />} onClick={handleAddMember}>
          Add Another Member
        </Button>
      </Box>
    </Box>
  )
}
