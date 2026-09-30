import React, { useState } from "react"
import { Grid, styled, TextField, Typography } from "@mui/material"
import { SmallButton } from "modules/common/SmallButton"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { subscribeToDAOAlerts } from "services/services/lite/lite-services"
import { ContentContainer } from "./ContentContainer"

const AlertsContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "24px 38px",
  [theme.breakpoints.down("lg")]: {
    width: "inherit"
  }
}))

const TitleText = styled(Typography)({
  fontSize: 18,
  fontWeight: 500
})

const HelperText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  color: theme.palette.primary.light
}))

const EmailInput = styled(TextField)({
  "background": "#2f3438",
  "borderRadius": 8,
  "flex": "1 1 280px",
  "maxWidth": 480,
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    fontSize: 16,
    fontWeight: 300
  }
})

// Deliberately permissive: the backend is the authority on deliverability, this
// only stops obviously malformed input from costing a round trip.
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const DAOEmailAlerts: React.FC<{ daoAddress: string; daoName?: string }> = ({ daoAddress, daoName }) => {
  const { network } = useTezos()
  const openNotification = useNotification()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const onSubscribe = async () => {
    if (!looksLikeEmail(email)) {
      openNotification({
        message: "Please enter a valid email address",
        autoHideDuration: 3000,
        variant: "error"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const resp = await subscribeToDAOAlerts(email.trim(), daoAddress, network, daoName)

      if (!resp.ok) {
        openNotification({
          message: "Could not subscribe to email alerts",
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }

      setConfirmationSent(true)
      setEmail("")
      openNotification({
        message: "Check your inbox to confirm",
        autoHideDuration: 5000,
        variant: "success"
      })
    } catch (error) {
      console.log("error: ", error)
      openNotification({
        message: "Could not subscribe to email alerts",
        autoHideDuration: 3000,
        variant: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertsContainer item>
      <Grid container direction="column" style={{ gap: 12 }}>
        <Grid item>
          <TitleText color="textPrimary">Get email alerts for this DAO</TitleText>
          <HelperText>Be notified when proposals are created and when voting is about to close.</HelperText>
        </Grid>
        <Grid item container direction="row" alignItems="center" wrap="wrap" style={{ gap: 12 }}>
          <EmailInput
            type="email"
            value={email}
            placeholder="you@example.com"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            onChange={event => setEmail(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter" && !isSubmitting) {
                onSubscribe()
              }
            }}
          />
          <SmallButton variant="contained" color="secondary" disabled={isSubmitting} onClick={onSubscribe}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </SmallButton>
        </Grid>
        {confirmationSent ? (
          <Grid item>
            <HelperText color="secondary">Check your inbox to confirm</HelperText>
          </Grid>
        ) : null}
      </Grid>
    </AlertsContainer>
  )
}
