import React, { useState, useContext } from "react"
import { ethers } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"

import HbWrapperWAbi from "assets/abis/hb_wrapper_w.json"
import { Box, styled, Typography, Tabs, Tab } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"
import { useTezos } from "services/beacon/hooks/useTezos"

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
]

const wrapperContractAbiJson = [
  {
    constant: false,
    inputs: [
      { name: "account", type: "address" },
      { name: "value", type: "uint256" }
    ],
    name: "depositFor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "account", type: "address" },
      { name: "value", type: "uint256" }
    ],
    name: "withdrawTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
]

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

export const TokenBridge = () => {
  const [wrapTabValue, setWrapTabValue] = useState(0)
  const [wrapAmount, setWrapAmount] = useState("")
  const [transactionState, setTransactionState] = useState("")
  const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null)
  const [executionTxHash, setExecutionTxHash] = useState<string | null>(null)
  const { etherlink } = useTezos()
  const { daoSelected } = useContext(EtherlinkContext)

  const wrapTokens = async () => {
    setTransactionState("waitingApproval")
    // Approval logic
    const erc20Contract = new ethers.Contract(daoSelected.token, ERC20_ABI, etherlink.signer)
    const tx1 = await erc20Contract.approve(daoSelected.token, wrapAmount)
    setApprovalTxHash(tx1.hash)
    setTransactionState("approving")
    await tx1.wait()

    // Wrap logic
    setTransactionState("waitingExecution")
    const wrapperContract = new ethers.Contract(daoSelected.token, wrapperContractAbiJson, etherlink.signer)
    const tx2 = await wrapperContract.depositFor(etherlink.signer.address, wrapAmount)
    setExecutionTxHash(tx2.hash)
    setTransactionState("executing")
    await tx2.wait()
    setTransactionState("success")
  }

  const unwrapTokens = async () => {
    setTransactionState("waitingExecution")
    const wrapperContract = new ethers.Contract(daoSelected.token, wrapperContractAbiJson, etherlink.signer)
    const tx = await wrapperContract.withdrawTo(etherlink.signer.address, wrapAmount)
    setExecutionTxHash(tx.hash)
    setTransactionState("executing")
    await tx.wait()
    setTransactionState("success")
  }

  return (
    <Box>
      <Typography variant="h5" style={{ marginBottom: "8px", marginTop: "40px", color: "#fff" }}>
        Token Bridge
      </Typography>
      <Typography style={{ marginBottom: "24px", color: "#9E9E9E" }}>
        Use this bridge to wrap your underlying tokens into governance tokens, or unwrap them back.
      </Typography>

      <WrapContainer>
        <StyledTabs
          value={wrapTabValue}
          onChange={(e, newValue) => {
            setWrapTabValue(newValue)
            setTransactionState("")
          }}
        >
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
            disabled={
              !wrapAmount ||
              parseFloat(wrapAmount) <= 0 ||
              transactionState === "waitingApproval" ||
              transactionState === "approving" ||
              transactionState === "waitingExecution" ||
              transactionState === "executing"
            }
            onClick={() => {
              if (wrapTabValue === 0) {
                wrapTokens()
              } else {
                unwrapTokens()
              }
            }}
          >
            {transactionState === "waitingApproval" && "Waiting for Approval..."}
            {transactionState === "approving" && "Approving..."}
            {transactionState === "waitingExecution" && "Waiting for Execution..."}
            {transactionState === "executing" && "Executing..."}
            {transactionState === "success" && "Success!"}
            {!transactionState && (wrapTabValue === 0 ? "Wrap Tokens" : "Unwrap Tokens")}
          </Button>
        </Box>
      </WrapContainer>
    </Box>
  )
}
