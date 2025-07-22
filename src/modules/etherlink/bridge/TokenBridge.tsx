import React, { useState, useContext } from "react"
import { ethers, parseUnits } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { Box, styled, Typography, Tabs, Tab, CircularProgress, Link } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"
import { useTezos } from "services/beacon/hooks/useTezos"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import ERC20_ABI from "assets/abis/erc20.json"
import WRAPPED_TOKEN_ABI from "assets/abis/hb_wrapped_evm.json"

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

const WrapContainer = styled(Box)({
  background: "#1c2024",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "40px",
  maxWidth: "400px",
  margin: "0 auto"
})

const StatusContainer = styled(Box)({
  marginTop: "24px",
  padding: "16px",
  borderRadius: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  minHeight: "80px",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
})

const StatusRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  color: "#9E9E9E"
})

const TxLink = styled(Link)({
  "color": "#4FC3F7",
  "textDecoration": "none",
  "&:hover": {
    textDecoration: "underline"
  }
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { etherlink } = useTezos()
  const { daoSelected } = useContext(EtherlinkContext)

  const wrapTokens = async () => {
    try {
      setTransactionState("waitingApproval")
      setErrorMessage(null)

      // Approval logic
      const erc20Contract = new ethers.Contract(daoSelected.underlyingToken, ERC20_ABI.abi, etherlink.signer)

      // Get token decimals
      const decimals = await erc20Contract.decimals()
      const amountInWei = parseUnits(wrapAmount, decimals)

      // Check existing allowance
      const currentAllowance = await erc20Contract.allowance(etherlink.signer.address, daoSelected.token)

      // Only approve if current allowance is insufficient
      if (currentAllowance.lt(amountInWei)) {
        const tx1 = await erc20Contract.approve(daoSelected.token, amountInWei)
        setApprovalTxHash(tx1.hash)
        setTransactionState("approving")
        await tx1.wait()
      } else {
        console.log("Sufficient allowance already exists, skipping approval")
        setTransactionState("waitingExecution")
      }

      await sleep(1000)

      // Wrap logic
      console.log("wrapperContractAbiHumanReadable", etherlink.signer.address, daoSelected.underlyingToken)
      setTransactionState("waitingExecution")
      const wrapperContract = new ethers.Contract(daoSelected.token, WRAPPED_TOKEN_ABI.abi, etherlink.signer)
      const tx2 = await wrapperContract.depositFor(etherlink.signer.address, amountInWei)
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

      // Get token decimals from wrapped token
      const wrapperContract = new ethers.Contract(daoSelected.token, WRAPPED_TOKEN_ABI.abi, etherlink.signer)
      const decimals = await wrapperContract.decimals()
      const amountInWei = parseUnits(wrapAmount, decimals)

      const tx = await wrapperContract.withdrawTo(etherlink.signer.address, amountInWei)
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
      <WrapContainer style={{ backgroundColor: "rgb(47, 52, 56)", padding: "40px" }}>
        <Typography variant="h5" style={{ marginBottom: "8px", color: "#fff", fontSize: "24px", fontWeight: 700 }}>
          Deposit underlying tokens
        </Typography>
        <Typography style={{ marginBottom: "24px", color: "#9E9E9E" }}>
          Wrap your underlying tokens into {daoSelected?.symbol}. You may unwrap them at any future time
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
          <StyledTextField
            type="number"
            label="Amount"
            placeholder={wrapTabValue === 0 ? "Amount to Wrap (e.g., 100.5)" : "Amount to Unwrap (e.g., 100.5)"}
            value={wrapAmount}
            onChange={e => setWrapAmount(e.target.value)}
            style={{ width: "100%", marginBottom: "16px" }}
          />

          <Button
            variant="contained"
            fullWidth
            style={{ marginBottom: "8px" }}
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

          {transactionState && (
            <StatusContainer>
              {transactionState === "waitingApproval" && (
                <StatusRow>
                  <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
                  <Typography>Waiting for approval transaction...</Typography>
                </StatusRow>
              )}

              {transactionState === "approving" && (
                <>
                  <StatusRow>
                    <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
                    <Typography>Approving tokens...</Typography>
                  </StatusRow>
                  {approvalTxHash && (
                    <StatusRow>
                      <Typography variant="caption">
                        Approval tx:{" "}
                        <TxLink
                          href={`https://testnet.explorer.etherlink.com/tx/${approvalTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {approvalTxHash.slice(0, 10)}...{approvalTxHash.slice(-8)}
                        </TxLink>
                      </Typography>
                    </StatusRow>
                  )}
                </>
              )}

              {transactionState === "waitingExecution" && (
                <>
                  {wrapTabValue === 0 && (
                    <StatusRow>
                      <CheckCircleIcon style={{ fontSize: "16px", color: "#4CAF50" }} />
                      <Typography>{approvalTxHash ? "Approval complete" : "Sufficient allowance available"}</Typography>
                    </StatusRow>
                  )}
                  <StatusRow>
                    <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
                    <Typography>Waiting for {wrapTabValue === 0 ? "wrap" : "unwrap"} transaction...</Typography>
                  </StatusRow>
                </>
              )}

              {transactionState === "executing" && (
                <>
                  {wrapTabValue === 0 && (
                    <StatusRow>
                      <CheckCircleIcon style={{ fontSize: "16px", color: "#4CAF50" }} />
                      <Typography>Approval complete</Typography>
                    </StatusRow>
                  )}
                  <StatusRow>
                    <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
                    <Typography>{wrapTabValue === 0 ? "Wrapping" : "Unwrapping"} tokens...</Typography>
                  </StatusRow>
                  {executionTxHash && (
                    <StatusRow>
                      <Typography variant="caption">
                        {wrapTabValue === 0 ? "Wrap" : "Unwrap"} tx:{" "}
                        <TxLink
                          href={`https://testnet.explorer.etherlink.com/tx/${executionTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {executionTxHash.slice(0, 10)}...{executionTxHash.slice(-8)}
                        </TxLink>
                      </Typography>
                    </StatusRow>
                  )}
                </>
              )}

              {transactionState === "success" && (
                <>
                  <StatusRow>
                    <CheckCircleIcon style={{ fontSize: "16px", color: "#4CAF50" }} />
                    <Typography>Transaction completed successfully!</Typography>
                  </StatusRow>
                  {executionTxHash && (
                    <StatusRow>
                      <Typography variant="caption">
                        View transaction:{" "}
                        <TxLink
                          href={`https://testnet.explorer.etherlink.com/tx/${executionTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {executionTxHash.slice(0, 10)}...{executionTxHash.slice(-8)}
                        </TxLink>
                      </Typography>
                    </StatusRow>
                  )}
                </>
              )}

              {transactionState === "error" && (
                <>
                  <StatusRow>
                    <ErrorIcon style={{ fontSize: "16px", color: "#f44336" }} />
                    <Typography>Transaction failed</Typography>
                  </StatusRow>
                  {errorMessage && (
                    <StatusRow>
                      <Typography variant="caption" style={{ color: "#f44336" }}>
                        {errorMessage}
                      </Typography>
                    </StatusRow>
                  )}
                </>
              )}
            </StatusContainer>
          )}
        </Box>
      </WrapContainer>
    </Box>
  )
}
