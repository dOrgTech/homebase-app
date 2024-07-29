import React from "react"
import { TezosToolkit } from "@taquito/taquito"
import { SmallButton } from "./SmallButton"

export const ConnectWalletButton = ({
  connect,
  variant = ""
}: {
  connect: () => Promise<TezosToolkit | string>
  variant?: string
}) => {
  if (variant === "header") {
    return (
      <SmallButton color="secondary" variant="contained" style={{ fontSize: "14px" }} onClick={() => connect()}>
        Connect Wallet B
      </SmallButton>
    )
  }
  if (variant === "explorer") {
    return (
      <SmallButton
        color="secondary"
        variant="contained"
        style={{ fontSize: "14px" }}
        onClick={() => {
          connect()
        }}
      >
        Connect Wallet C
      </SmallButton>
    )
  }
  return (
    <SmallButton variant="outlined" onClick={() => connect()}>
      Connect Wallet A
    </SmallButton>
  )
}