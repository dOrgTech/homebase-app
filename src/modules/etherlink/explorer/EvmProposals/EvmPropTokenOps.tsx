import { Grid, Typography, Box, styled, FormField, FormTextField } from "components/ui"
import { AddCircleIcon, RemoveCircleIcon } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { isInvalidEvmAddress } from "modules/etherlink/utils"

const OptionContainer = styled(Grid)({
  "background": "#1c2024",
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

interface TokenOperationFormProps {
  type: "mint" | "burn"
  icon: React.ReactNode
  values: {
    to?: string
    amount?: string
  }
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  onChange: (
    type: "mint" | "burn",
    values: { to: string; amount: string },
    tokenSymbol: string,
    tokenAddress: string,
    tokenDecimals: number
  ) => void
}

const TokenOperationForm: React.FC<TokenOperationFormProps> = ({
  type,
  icon,
  values,
  onChange,
  tokenSymbol,
  tokenAddress,
  tokenDecimals
}) => (
  <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
    <Grid item xs={12} style={{ marginBottom: "20px" }}>
      <Box display="flex" alignItems="center" justifyContent="center" style={{ gap: "8px", marginBottom: "16px" }}>
        {icon}
        <Typography color="textPrimary">Enter the recipient address and amount to {type}</Typography>
      </Box>
      <FormField
        label="Recipient Address"
        labelStyle={{ fontSize: 16 }}
        containerStyle={{ gap: 12 }}
        errorText={values.to && isInvalidEvmAddress(values.to) ? "Invalid Ethereum address" : ""}
      >
        <FormTextField
          value={values?.to ?? ""}
          placeholder="0x..."
          inputProps={{ style: { fontSize: 14 } }}
          onChange={e =>
            onChange(
              type,
              { to: e.target.value, amount: values?.amount ?? "" },
              tokenSymbol,
              tokenAddress,
              tokenDecimals
            )
          }
        />
      </FormField>
      <FormField
        label="Amount"
        labelStyle={{ fontSize: 16 }}
        containerStyle={{ gap: 12 }}
        errorText={values.amount && parseFloat(values.amount) <= 0 ? "Amount must be greater than 0" : ""}
      >
        <FormTextField
          type="number"
          inputProps={{ min: "0", style: { fontSize: 14 } }}
          value={values.amount}
          onChange={e =>
            onChange(type, { to: values?.to ?? "", amount: e.target.value }, tokenSymbol, tokenAddress, tokenDecimals)
          }
        />
      </FormField>
    </Grid>
  </Grid>
)

const EvmPropTokenOps = () => {
  const { daoSelected } = useContext(EtherlinkContext)
  const { currentStep, daoTokenOps, setDaoTokenOps } = useEvmProposalOps()

  if (currentStep === 3 && daoTokenOps?.type === "mint") {
    return (
      <TokenOperationForm
        type="mint"
        tokenSymbol={daoSelected?.symbol}
        tokenAddress={daoSelected?.token}
        icon={<AddCircleIcon fontSize="large" />}
        values={daoTokenOps.mint}
        onChange={setDaoTokenOps}
        tokenDecimals={daoSelected?.decimals}
      />
    )
  }

  if (currentStep === 3 && daoTokenOps?.type === "burn") {
    return (
      <TokenOperationForm
        type="burn"
        tokenSymbol={daoSelected?.symbol}
        tokenAddress={daoSelected?.token}
        tokenDecimals={daoSelected?.decimals}
        icon={<RemoveCircleIcon fontSize="large" />}
        values={daoTokenOps.burn}
        onChange={setDaoTokenOps}
      />
    )
  }
  return (
    <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
      <ConfigOption
        icon={<AddCircleIcon fontSize="large" />}
        title="Mint"
        description="Mint tokens to a specified address"
        onClick={() =>
          setDaoTokenOps("mint", undefined, daoSelected?.symbol, daoSelected?.token, daoSelected?.decimals)
        }
      />
      <ConfigOption
        icon={<RemoveCircleIcon fontSize="large" />}
        title="Burn"
        description="Burn tokens from a specified address"
        onClick={() =>
          setDaoTokenOps("burn", undefined, daoSelected?.symbol, daoSelected?.token, daoSelected?.decimals)
        }
      />
    </Grid>
  )
}

export default EvmPropTokenOps
