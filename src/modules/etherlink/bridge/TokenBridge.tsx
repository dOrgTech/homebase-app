import React, { useState, useContext } from "react"
import { ethers, parseUnits } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { Box, styled, Typography, Tabs, Tab } from "components/ui"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"
import { useTezos } from "services/beacon/hooks/useTezos"
import { TxStatus } from "./components/TxStatus"
import ERC20_ABI from "assets/abis/erc20.json"
import wrapperContractAbiJson from "assets/abis/wrapper.json"

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

const WrapContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "40px"
}))

const StyledAmountInput = styled(StyledTextField)({
  "maxWidth": "200px",
  "& .MuiOutlinedInput-root": {
    "border": "1px solid rgba(255, 255, 255, 0.3)",
    "backgroundColor": "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.5)"
    }
  }
})

// Status UI moved into components/TxStatus.tsx

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "marginBottom": "24px",
  "& .MuiTab-root": {
    "color": theme.palette.text.secondary,
    "&.Mui-selected": {
      color: "#fff"
    }
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#fff"
  }
}))

export const TokenBridge = () => {
  const [wrapTabValue, setWrapTabValue] = useState(0)
  const [wrapAmount, setWrapAmount] = useState("")
  const [transactionState, setTransactionState] = useState("")
  const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null)
  const [executionTxHash, setExecutionTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { etherlink } = useTezos()
  const { daoSelected } = useContext(EtherlinkContext)

  const isValidAddress = (value: unknown): value is string => typeof value === "string" && ethers.isAddress(value)
  const underlyingToken = daoSelected?.underlyingToken
  const wrapperToken = daoSelected?.token

  if (!isValidAddress(underlyingToken) || !isValidAddress(wrapperToken)) {
    return null
  }

  const wrapTokens = async () => {
    try {
      setTransactionState("waitingApproval")
      setErrorMessage(null)

      // Get decimals from DAO data
      const decimals = daoSelected?.decimals ?? 18
      const parsedAmount = parseUnits(wrapAmount, decimals)

      // Approval logic
      const erc20Contract = new ethers.Contract(underlyingToken, ERC20_ABI, etherlink.signer)
      const tx1 = await erc20Contract.approve(wrapperToken, parsedAmount)
      setApprovalTxHash(tx1.hash)
      setTransactionState("approving")
      await tx1.wait()

      await sleep(1000)

      setTransactionState("waitingExecution")
      const wrapperContract = new ethers.Contract(wrapperToken, wrapperContractAbiJson, etherlink.signer)
      const tx2 = await wrapperContract.depositFor(etherlink.signer.address, parsedAmount)
      setExecutionTxHash(tx2.hash)
      setTransactionState("executing")
      await tx2.wait()
      setTransactionState("success")
    } catch (error: any) {
      console.error("Error in wrapTokens:", error)
      setTransactionState("error")

      // Parse error message1
      if (error.code === "ACTION_REJECTED") {
        setErrorMessage("Transaction was rejected by user")
      } else if (error.reason) {
        setErrorMessage(error.reason)
      } else if (error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("An unexpected error occurred")
      }
    }
  }

  const unwrapTokens = async () => {
    try {
      setTransactionState("waitingExecution")
      setErrorMessage(null)

      // Get decimals from DAO data
      const decimals = daoSelected?.decimals ?? 18
      const parsedAmount = parseUnits(wrapAmount, decimals)

      const wrapperContract = new ethers.Contract(wrapperToken, wrapperContractAbiJson, etherlink.signer)
      const tx = await wrapperContract.withdrawTo(etherlink.signer.address, parsedAmount)
      setExecutionTxHash(tx.hash)
      setTransactionState("executing")
      await tx.wait()
      setTransactionState("success")
    } catch (error: any) {
      console.error("Error in unwrapTokens:", error)
      setTransactionState("error")

      // Parse error message
      if (error.code === "ACTION_REJECTED") {
        setErrorMessage("Transaction was rejected by user")
      } else if (error.reason) {
        setErrorMessage(error.reason)
      } else if (error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("An unexpected error occurred")
      }
    }
  }

  return (
    <Box>
      <WrapContainer>
        <Typography variant="h5" style={{ marginBottom: "8px", color: "#fff", fontSize: "24px", fontWeight: 700 }}>
          Convert {daoSelected?.symbol} &lt;&gt; underlying
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: "24px" }}>
          Use this to wrap your underlying tokens into governance tokens, or unwrap them back.
        </Typography>
        <StyledTabs
          value={wrapTabValue}
          onChange={(e, newValue) => {
            setWrapTabValue(newValue)
            setTransactionState("")
            setApprovalTxHash(null)
            setExecutionTxHash(null)
            setErrorMessage(null)
          }}
        >
          <Tab label="Wrap" />
          <Tab label="Unwrap" />
        </StyledTabs>

        <Box>
          <Box display="flex" alignItems="flex-end" style={{ gap: "16px", marginBottom: "16px" }}>
            <StyledAmountInput
              type="number"
              label="Amount"
              placeholder={wrapTabValue === 0 ? "Amount to Wrap" : "Amount to Unwrap"}
              value={wrapAmount}
              onChange={e => setWrapAmount(e.target.value)}
            />

            <Button
              variant="contained"
              style={{ maxWidth: "200px", height: "56px" }}
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
              {transactionState === "error" && "Try Again"}
              {!transactionState && (wrapTabValue === 0 ? "Wrap Tokens" : "Unwrap Tokens")}
            </Button>
          </Box>

          <TxStatus
            state={transactionState}
            wrapMode={wrapTabValue === 0 ? "wrap" : "unwrap"}
            approvalTxHash={approvalTxHash}
            executionTxHash={executionTxHash}
            errorMessage={errorMessage}
          />
        </Box>
      </WrapContainer>
    </Box>
  )
}
