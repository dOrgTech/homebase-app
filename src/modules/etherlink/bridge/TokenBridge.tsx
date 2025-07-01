import React, { useState } from "react"
import { Box, styled, Typography, Tabs, Tab } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"

const WrapContainer = styled(Box)({
  background: "#1c2024",
  borderRadius: "8px",
  padding: "32px",
  marginBottom: "40px"
})

const StyledTabs = styled(Tabs)({
  "marginBottom": "24px",
  "& .MuiTab-root": {
    "color": "#9E9E9E",
    "&.Mui-selected": {
      color: "#fff"
    }
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#fff"
  }
})

interface TokenBridgeProps {
  baseTokenAddress: string
  wrappedTokenAddress: string
}

export const TokenBridge = ({ baseTokenAddress, wrappedTokenAddress }: TokenBridgeProps) => {
  const [wrapTabValue, setWrapTabValue] = useState(0)
  const [wrapAmount, setWrapAmount] = useState("")

  return (
    <Box>
      <Typography variant="h5" style={{ marginBottom: "8px", marginTop: "40px", color: "#fff" }}>
        Token Bridge
      </Typography>
      <Typography style={{ marginBottom: "24px", color: "#9E9E9E" }}>
        Use this bridge to wrap your underlying tokens into governance tokens, or unwrap them back.
      </Typography>

      <WrapContainer>
        <StyledTabs value={wrapTabValue} onChange={(e, newValue) => setWrapTabValue(newValue)}>
          <Tab label="Wrap" />
          <Tab label="Unwrap" />
        </StyledTabs>

        <Box>
          <StyledTextField
            fullWidth
            type="number"
            label="Amount"
            placeholder={wrapTabValue === 0 ? "Amount to Wrap" : "Amount to Unwrap"}
            value={wrapAmount}
            onChange={e => setWrapAmount(e.target.value)}
            style={{ marginBottom: "24px" }}
          />

          <Button
            variant="contained"
            disabled={!wrapAmount || parseFloat(wrapAmount) <= 0}
            onClick={() => {
              console.log(`${wrapTabValue === 0 ? "Wrap" : "Unwrap"} ${wrapAmount} tokens`)
            }}
          >
            {wrapTabValue === 0 ? "Wrap Tokens" : "Unwrap Tokens"}
          </Button>
        </Box>
      </WrapContainer>
    </Box>
  )
}
