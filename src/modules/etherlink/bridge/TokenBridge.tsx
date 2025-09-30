import React, { useState, useContext } from "react"
import { ethers } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { Box, styled, Typography, Tabs, Tab, CircularProgress, Link } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"
import { useTezos } from "services/beacon/hooks/useTezos"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import ERC20_ABI from "assets/abis/erc20.json"
import wrapperContractAbiJson from "assets/abis/wrapper.json"

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
      const erc20Contract = new ethers.Contract(daoSelected.underlyingToken, ERC20_ABI, etherlink.signer)
      const tx1 = await erc20Contract.approve(daoSelected.token, wrapAmount)
      setApprovalTxHash(tx1.hash)
      setTransactionState("approving")
      await tx1.wait()

      await sleep(1000)

      // Wrap logic
      console.log("wrapperContractAbiHumanReadable", etherlink.signer.address, daoSelected.underlyingToken)
      setTransactionState("waitingExecution")
      const wrapperContract = new ethers.Contract(daoSelected.token, wrapperContractAbiJson, etherlink.signer)
      const tx2 = await wrapperContract.depositFor(etherlink.signer.address, wrapAmount)
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

      const wrapperContract = new ethers.Contract(daoSelected.token, wrapperContractAbiJson, etherlink.signer)
      const tx = await wrapperContract.withdrawTo(etherlink.signer.address, wrapAmount)
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
        <Typography style={{ marginBottom: "24px", color: "#9E9E9E" }}>
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
          <StyledTextField
            type="number"
            label="Amount"
            placeholder={
              wrapTabValue === 0 ? "Amount to Wrap (including decimals)" : "Amount to Unwrap (including decimals)"
            }
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
                  <StatusRow>
                    <CheckCircleIcon style={{ fontSize: "16px", color: "#4CAF50" }} />
                    <Typography>Approval complete</Typography>
                  </StatusRow>
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
