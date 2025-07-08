import React, { useState, useContext } from "react"
import { ethers } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { Box, styled, Typography, Tabs, Tab, CircularProgress, Link } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { StyledTextField } from "components/ui/StyledTextField"
import { useTezos } from "services/beacon/hooks/useTezos"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

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
    inputs: [
      {
        internalType: "contract IERC20",
        name: "underlyingToken",
        type: "address"
      },
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "CheckpointUnorderedInsertion",
    type: "error"
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "increasedSupply",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "cap",
        type: "uint256"
      }
    ],
    name: "ERC20ExceededSafeSupply",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "ERC20InvalidUnderlying",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "ERC2612ExpiredSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC2612InvalidSigner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256"
      },
      {
        internalType: "uint48",
        name: "clock",
        type: "uint48"
      }
    ],
    name: "ERC5805FutureLookup",
    type: "error"
  },
  {
    inputs: [],
    name: "ERC6372InconsistentClock",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256"
      }
    ],
    name: "InvalidAccountNonce",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256"
      }
    ],
    name: "VotesExpiredSignature",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDelegate",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDelegate",
        type: "address"
      }
    ],
    name: "DelegateChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousVotes",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newVotes",
        type: "uint256"
      }
    ],
    name: "DelegateVotesChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint32",
        name: "pos",
        type: "uint32"
      }
    ],
    name: "checkpoints",
    outputs: [
      {
        components: [
          {
            internalType: "uint48",
            name: "_key",
            type: "uint48"
          },
          {
            internalType: "uint208",
            name: "_value",
            type: "uint208"
          }
        ],
        internalType: "struct Checkpoints.Checkpoint208",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "clock",
    outputs: [
      {
        internalType: "uint48",
        name: "",
        type: "uint48"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address"
      }
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "delegates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "depositFor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256"
      }
    ],
    name: "getPastTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256"
      }
    ],
    name: "getPastVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "getVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "numCheckpoints",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "underlying",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "withdrawTo",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
]

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
