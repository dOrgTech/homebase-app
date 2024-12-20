import { Grid, Typography, Box, Container, styled } from "@material-ui/core"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledTextField } from "components/ui/StyledTextField"

const OptionContainer = styled(Grid)({
  "background": "#2F3438",
  "padding": "20px",
  "borderRadius": "8px",
  "cursor": "pointer",
  "height": "100%",
  "&:hover": {
    background: "#3F444A"
  }
})

const IconContainer = styled(Box)({
  marginBottom: "16px"
})

const ConfigOption = ({
  icon,
  title,
  description,
  onClick
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) => (
  <Grid item xs={12} sm={6} style={{ gap: 4, padding: "10px", marginTop: "40px" }}>
    <OptionContainer onClick={onClick}>
      <IconContainer>{icon}</IconContainer>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        {title}
      </Typography>
      <Typography color="textSecondary">{description}</Typography>
    </OptionContainer>
  </Grid>
)

const EvmPropTokenOps = () => {
  const { currentStep, daoTokenOps, setDaoTokenOps } = useEvmProposalOps()

  if (currentStep === 3 && daoTokenOps.type === "mint") {
    return (
      <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
        <Grid item xs={12} style={{ marginBottom: "20px" }}>
          <Box display="flex" alignItems="center" justifyContent="center" style={{ gap: "8px" }}>
            <AddCircleIcon fontSize="large" />
            <Typography color="textPrimary">Enter the recipient address and amount to mint</Typography>
          </Box>
          <StyledTextField
            fullWidth
            label="Recipient Address"
            variant="standard"
            value={daoTokenOps.mint.to}
            onChange={e =>
              setDaoTokenOps("mint", {
                to: e.target.value,
                amount: daoTokenOps.mint.amount
              })
            }
            style={{ marginBottom: "16px" }}
          />
          <StyledTextField
            fullWidth
            label="Amount"
            type="number"
            variant="standard"
            value={daoTokenOps.mint.amount}
            onChange={e =>
              setDaoTokenOps("mint", {
                to: daoTokenOps.mint.to,
                amount: e.target.value
              })
            }
          />
        </Grid>
      </Grid>
    )
  }

  if (currentStep === 3 && daoTokenOps.type === "burn") {
    return (
      <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
        <Grid item xs={12} style={{ marginBottom: "20px" }}>
          <Box display="flex" alignItems="center" justifyContent="center" style={{ gap: "8px" }}>
            <RemoveCircleIcon fontSize="large" />
            <Typography color="textPrimary">Enter the recipient address and amount to burn</Typography>
          </Box>
          <StyledTextField
            fullWidth
            label="Recipient Address"
            variant="standard"
            value={daoTokenOps.mint.to}
            onChange={e =>
              setDaoTokenOps("burn", {
                to: e.target.value,
                amount: daoTokenOps.burn.amount
              })
            }
            style={{ marginBottom: "16px" }}
          />
          <StyledTextField
            fullWidth
            label="Amount"
            type="number"
            variant="standard"
            value={daoTokenOps.mint.amount}
            onChange={e =>
              setDaoTokenOps("burn", {
                to: daoTokenOps.mint.to,
                amount: e.target.value
              })
            }
          />
        </Grid>
      </Grid>
    )
  }
  return (
    <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
      <ConfigOption
        icon={<AddCircleIcon fontSize="large" />}
        title="Mint"
        description="Mint tokens to a specified address"
        onClick={() => setDaoTokenOps("mint")}
      />
      <ConfigOption
        icon={<RemoveCircleIcon fontSize="large" />}
        title="Burn"
        description="Burn tokens from a specified address"
        onClick={() => setDaoTokenOps("burn")}
      />
    </Grid>
  )
}

export default EvmPropTokenOps
