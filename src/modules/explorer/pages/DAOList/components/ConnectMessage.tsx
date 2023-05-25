import React from "react"
import { Grid, Link, styled, Theme, Typography } from "@material-ui/core"
import { useTezos } from "services/beacon/hooks/useTezos"

const Container = styled(Grid)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.primary.main,
  width: "100%",
  maxWidth: "calc(100vw - 48px)",
  wordBreak: "break-all",
  borderRadius: 8,
  boxSizing: "border-box",
  padding: 32
}))

export const ConnectMessage: React.FC = () => {
  const { connect } = useTezos()

  return (
    <Container>
      {" "}
      <Typography variant="body1" color="textPrimary" align={"center"}>
        <Link color="secondary" onClick={() => connect()} style={{ cursor: "pointer" }}>
          Connect your wallet
        </Link>{" "}
        to see which DAOs you hold a stake in
      </Typography>
    </Container>
  )
}
