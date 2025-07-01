import React, { useState, useEffect } from "react"
import { Button } from "./Button"
import { StyledTextField } from "./StyledTextField"
import { ContentContainer } from "./ContentContainer"
import { ContainerTitle } from "./Containers"
import { Grid } from "@material-ui/core"
import { useTezos } from "services/beacon/hooks/useTezos"

export const TokenBridgeWidget: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState("0")
  const { tezos, account } = useTezos()

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const balance = await tezos.tz.getBalance(account)
          setBalance(balance.toString())
        } catch (error) {
          console.error("Failed to fetch balance:", error)
        }
      }
    }

    fetchBalance()
  }, [account, tezos])

  return (
    <ContentContainer container direction="column" spacing={2}>
      <Grid item>
        <ContainerTitle>Token Bridge</ContainerTitle>
      </Grid>
      <Grid item>
        <StyledTextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      </Grid>
      <Grid item>
        <p>Balance: {balance}</p>
      </Grid>
      <Grid item>
        <Button
          onClick={async () => {
            try {
              const contract = await tezos.wallet.at("KT1_CONTRACT_ADDRESS")
              const op = await contract.methods.transfer(account, amount).send()
              await op.confirmation()
              console.log("Transaction successful!")
            } catch (error) {
              console.error("Transaction failed:", error)
            }
          }}
        >
          Bridge
        </Button>
      </Grid>
    </ContentContainer>
  )
}
