import { styled, Grid, Typography, Tooltip } from "@material-ui/core"
import React, { useContext, useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network, getNetworkDisplayName, networkDotColorMap, rpcNodes } from "services/beacon"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ColorDot } from "./ChangeNetworkButton"
import { ContentContainer } from "./ContentContainer"
import { ActionTypes, CreatorContext } from "modules/creator/state"
import { EtherlinkContext } from "services/wagmi/context"

const SheetItem = styled(ContentContainer)<{ disabled?: boolean }>(({ disabled }) => ({
  "height": 50,
  "& > *": {
    height: "100%"
  },
  "cursor": disabled ? "not-allowed" : "pointer",
  "opacity": disabled ? 0.5 : 1,
  "pointerEvents": disabled ? "none" : "auto"
}))

interface Props {
  open: boolean
  onClose: () => void
}

const SUPPORTED_NETWORKS = Object.keys(rpcNodes) as Network[]

export const NetworkSheet: React.FC<Props> = props => {
  const { network, changeNetwork } = useTezos()
  const { dispatch } = useContext(CreatorContext)
  const { daoSelected } = useContext(EtherlinkContext)

  const options = useMemo(() => SUPPORTED_NETWORKS.filter(n => n !== network), [network])

  const isOnEtherlinkDAO = useMemo(() => {
    const pathname = window.location.pathname
    return pathname.includes("/explorer/etherlink/dao/") && daoSelected
  }, [daoSelected])

  const handleNetworkClick = (networkOption: Network) => {
    if (isOnEtherlinkDAO) {
      return
    }
    props.onClose()
    changeNetwork(networkOption)
    dispatch({
      type: ActionTypes.CLEAR_CACHE
    })
  }

  return (
    <ResponsiveDialog open={props.open} onClose={props.onClose} title={"Choose Network"}>
      <Grid container direction={"column"} style={{ gap: 20 }}>
        {options.map((networkOption, i) => {
          const item = (
            <SheetItem
              item
              key={`network-${i}`}
              disabled={isOnEtherlinkDAO}
              onClick={() => handleNetworkClick(networkOption)}
            >
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
          )

          if (isOnEtherlinkDAO) {
            return (
              <Tooltip key={`network-${i}`} title="Can't change network while viewing a DAO or Proposal" arrow>
                <div>{item}</div>
              </Tooltip>
            )
          }

          return item
        })}
      </Grid>
    </ResponsiveDialog>
  )
}
