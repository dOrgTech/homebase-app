import React from "react"
import { Box, Typography, CircularProgress, Link, styled } from "components/ui"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"

const WhiteText = styled(Typography)({
  color: "#fff !important"
})

const WhiteCaption = styled(Typography)({
  color: "#fff !important"
})

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
          <WhiteText>Waiting for approval transaction...</WhiteText>
        </Box>
      )}

      {state === "approving" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <WhiteText>Approving tokens...</WhiteText>
          </Box>
          {approvalTxHash && <ExplorerLink hash={approvalTxHash} label="Approval tx" />}
        </>
      )}

      {state === "waitingExecution" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CheckCircleIcon style={{ fontSize: 16, color: "#4CAF50" }} />
            <WhiteText>Approval complete</WhiteText>
          </Box>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <WhiteText>Waiting for {wrapMode} transaction...</WhiteText>
          </Box>
        </>
      )}

      {state === "executing" && (
        <>
          {wrapMode === "wrap" && (
            <Box display="flex" alignItems="center" style={{ gap: 8 }}>
              <CheckCircleIcon style={{ fontSize: 16, color: "#4CAF50" }} />
              <WhiteText>Approval complete</WhiteText>
            </Box>
          )}
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <CircularProgress size={16} style={{ color: "#4FC3F7" }} />
            <WhiteText>{wrapMode === "wrap" ? "Wrapping" : "Unwrapping"} tokens...</WhiteText>
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
            <WhiteText>Transaction completed successfully!</WhiteText>
          </Box>
          {executionTxHash && <ExplorerLink hash={executionTxHash} label="View transaction" />}
        </>
      )}

      {state === "error" && (
        <>
          <Box display="flex" alignItems="center" style={{ gap: 8 }}>
            <ErrorIcon style={{ fontSize: 16, color: "#f44336" }} />
            <WhiteText>Transaction failed</WhiteText>
          </Box>
          {errorMessage && (
            <WhiteCaption variant="caption" style={{ color: "#f44336" }}>
              {errorMessage}
            </WhiteCaption>
          )}
        </>
      )}
    </Box>
  )
}
