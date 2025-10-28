import React from "react"
import { Box, Typography, CircularProgress, Link } from "components/ui"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"

export const TxStatus = ({
  state,
  wrapMode,
  approvalTxHash,
  executionTxHash,
  errorMessage
}: {
  state: string
  wrapMode: "wrap" | "unwrap"
  approvalTxHash: string | null
  executionTxHash: string | null
  errorMessage: string | null
}) => {
  if (!state) return null

  const ExplorerLink = ({ hash, label }: { hash: string; label: string }) => (
    <Typography variant="caption">
      {label}:{" "}
      <Link
        href={`https://testnet.explorer.etherlink.com/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#4FC3F7" }}
      >
        {hash.slice(0, 10)}...{hash.slice(-8)}
      </Link>
    </Typography>
  )

  return (
    <Box style={{ marginTop: 24, padding: 16, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
      {state === "waitingApproval" && (
        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
          <Typography>Waiting for approval transaction...</Typography>
        </Box>
      )}

      {state === "approving" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <Typography>Approving tokens...</Typography>
          </Box>
          {approvalTxHash && <ExplorerLink hash={approvalTxHash} label="Approval tx" />}
        </>
      )}

      {state === "waitingExecution" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CheckCircleIcon style={{ fontSize: 16, color: "#4CAF50" }} />
            <Typography>Approval complete</Typography>
          </Box>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <Typography>Waiting for {wrapMode} transaction...</Typography>
          </Box>
        </>
      )}

      {state === "executing" && (
        <>
          {wrapMode === "wrap" && (
            <Box display="flex" alignItems="center" style={{ gap: 8 }}>
              <CheckCircleIcon style={{ fontSize: 16, color: "#4CAF50" }} />
              <Typography>Approval complete</Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <Typography>{wrapMode === "wrap" ? "Wrapping" : "Unwrapping"} tokens...</Typography>
          </Box>
          {executionTxHash && (
            <ExplorerLink hash={executionTxHash} label={`${wrapMode === "wrap" ? "Wrap" : "Unwrap"} tx`} />
          )}
        </>
      )}

      {state === "success" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CheckCircleIcon style={{ fontSize: 16, color: "#4CAF50" }} />
            <Typography>Transaction completed successfully!</Typography>
          </Box>
          {executionTxHash && <ExplorerLink hash={executionTxHash} label="View transaction" />}
        </>
      )}

      {state === "error" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <ErrorIcon style={{ fontSize: 16, color: "#f44336" }} />
            <Typography>Transaction failed</Typography>
          </Box>
          {errorMessage && (
            <Typography variant="caption" style={{ color: "#f44336" }}>
              {errorMessage}
            </Typography>
          )}
        </>
      )}
    </Box>
  )
}
