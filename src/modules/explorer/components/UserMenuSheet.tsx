import { styled, Grid, Typography } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import React from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { toShortAddress } from "services/contracts/utils"
import { ArrowDownwardOutlined, ExitToApp, FileCopyOutlined } from "@material-ui/icons"
import { BottomSheet } from "./BottomSheet"

const SheetContainer = styled(Grid)({
  paddingTop: 50
})

const SheetItem = styled(Grid)({
  "height": 65,
  "borderTop": "0.25px solid #7D8C8B",
  "cursor": "pointer",
  "& > *": {
    height: "100%"
  }
})

interface Props {
  open: boolean
  onClose: () => void
}

const MenuText = styled(Typography)({
  fontSize: 14
})

export const UserMenuSheet: React.FC<Props> = props => {
  const { account, reset, connect } = useTezos()

  const handleAccountClick = () => {
    if (account) {
      navigator.clipboard.writeText(account)
    } else {
      connect()
    }

    props.onClose()
  }

  const handleLogout = () => {
    reset()
    props.onClose()
  }

  return (
    <BottomSheet open={props.open} onDismiss={props.onClose}>
      <SheetContainer>
        <SheetItem>
          <Grid container justifyContent="center" style={{ gap: 9 }} alignItems="center" onClick={handleAccountClick}>
            {account ? (
              <>
                <Grid item>
                  <Blockie address={account} size={24} />
                </Grid>
                <Grid item>
                  <MenuText color="textPrimary">{toShortAddress(account)}</MenuText>
                </Grid>
                <Grid item>
                  <FileCopyOutlined htmlColor="#FFF" fontSize="small" />
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <ArrowDownwardOutlined htmlColor="#FFF" fontSize="small" />
                </Grid>
                <Grid item>
                  <MenuText color="textPrimary">Connect Wallet</MenuText>
                </Grid>
              </>
            )}
          </Grid>
        </SheetItem>
        <SheetItem>
          <Grid container justifyContent="center" style={{ gap: 9 }} alignItems="center" onClick={handleLogout}>
            <Grid item>
              <ExitToApp htmlColor="#FFF" fontSize="small" />
            </Grid>
            <Grid item>
              <MenuText color="textPrimary">Log Out</MenuText>
            </Grid>
          </Grid>
        </SheetItem>
      </SheetContainer>
    </BottomSheet>
  )
}
