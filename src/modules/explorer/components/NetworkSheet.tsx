import { styled, Grid, Typography, capitalize, Button } from "@material-ui/core"
import React, { useContext, useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network, getNetworkDisplayName, networkDotColorMap, rpcNodes } from "services/beacon"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ColorDot } from "./ChangeNetworkButton"
import { ContentContainer } from "./ContentContainer"
import { ActionTypes, CreatorContext } from "modules/creator/state"
import { EtherlinkContext } from "services/wagmi/context"

const SheetItem = styled(ContentContainer)({
  "height": 50,
  "& > *": {
    height: "100%"
  },
  "cursor": "pointer"
})

interface Props {
  open: boolean
  onClose: () => void
}

const SUPPORTED_NETWORKS = Object.keys(rpcNodes) as Network[]

const StyledButton = styled(Button)({
  padding: "8px 24px",
  textTransform: "none",
  minWidth: 100
})

export const NetworkSheet: React.FC<Props> = props => {
  const { network, changeNetwork } = useTezos()
  const { dispatch } = useContext(CreatorContext)
  const { daoSelected, network: etherlinkNetwork } = useContext(EtherlinkContext)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [targetNetwork, setTargetNetwork] = useState<Network | null>(null)

  const options = useMemo(() => SUPPORTED_NETWORKS.filter(n => n !== network), [network])

  const isOnEtherlinkDAO = useMemo(() => {
    const pathname = window.location.pathname
    return pathname.includes("/explorer/etherlink/dao/") && daoSelected
  }, [daoSelected])

  const handleNetworkClick = (networkOption: Network) => {
    if (isOnEtherlinkDAO) {
      setTargetNetwork(networkOption)
      setConfirmDialogOpen(true)
    } else {
      props.onClose()
      changeNetwork(networkOption)
      dispatch({
        type: ActionTypes.CLEAR_CACHE
      })
    }
  }

  const handleConfirmNetworkChange = () => {
    if (targetNetwork) {
      setConfirmDialogOpen(false)
      props.onClose()
      changeNetwork(targetNetwork)
      dispatch({
        type: ActionTypes.CLEAR_CACHE
      })
      window.location.href = "/explorer/daos"
    }
  }

  const handleCancelNetworkChange = () => {
    setConfirmDialogOpen(false)
    setTargetNetwork(null)
  }

  return (
    <>
      <ResponsiveDialog open={props.open} onClose={props.onClose} title={"Choose Network"}>
        <Grid container direction={"column"} style={{ gap: 20 }}>
          {options.map((networkOption, i) => (
            <SheetItem item key={`network-${i}`} onClick={() => handleNetworkClick(networkOption)}>
              <Grid container justifyContent="center" alignItems="center" style={{ gap: 8 }}>
                <Grid item>
                  <ColorDot color={networkDotColorMap[networkOption]} />
                </Grid>
                <Grid item>
                  <Typography variant={"h6"} color="textPrimary">
                    {getNetworkDisplayName(networkOption)}
                  </Typography>
                </Grid>
              </Grid>
            </SheetItem>
          ))}
        </Grid>
      </ResponsiveDialog>

      <ResponsiveDialog open={confirmDialogOpen} onClose={handleCancelNetworkChange} title={"Network Change"}>
        <Grid container direction="column" style={{ gap: 24 }}>
          <Grid item>
            <Typography variant="body1" color="textPrimary">
              The DAO you are currently viewing exists on <strong>{getNetworkDisplayName(etherlinkNetwork)}</strong>.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textPrimary">
              Switching to <strong>{targetNetwork && getNetworkDisplayName(targetNetwork)}</strong> will redirect you to
              the DAO Explorer.
            </Typography>
          </Grid>
          <Grid item container direction="row" justifyContent="flex-end" style={{ gap: 12 }}>
            <StyledButton variant="outlined" onClick={handleCancelNetworkChange}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" color="secondary" onClick={handleConfirmNetworkChange}>
              Continue
            </StyledButton>
          </Grid>
        </Grid>
      </ResponsiveDialog>
    </>
  )
}
