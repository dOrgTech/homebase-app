import { styled, Grid, Typography, capitalize } from "@material-ui/core"
import React, { useContext, useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network } from "services/beacon"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ColorDot, networkDotColorMap } from "./ChangeNetworkButton"
import { ContentContainer } from "./ContentContainer"
import { EnvKey, getEnv } from "services/config"
import { ActionTypes, CreatorContext } from "modules/creator/state"

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

const SUPPORTED_NETWORKS: Network[] = ["mainnet", "ghostnet"]

export const NetworkSheet: React.FC<Props> = props => {
  const { network, changeNetwork } = useTezos()
  const { dispatch } = useContext(CreatorContext)

  const options = useMemo(() => SUPPORTED_NETWORKS.filter(n => n !== network), [network])

  return (
    <ResponsiveDialog open={props.open} onClose={props.onClose} title={"Choose Network"}>
      <Grid container direction={"column"} style={{ gap: 20 }}>
        {options.map((networkOption, i) => (
          <SheetItem
            item
            key={`network-${i}`}
            onClick={() => {
              props.onClose()
              changeNetwork(networkOption)
              dispatch({
                type: ActionTypes.CLEAR_CACHE
              })
            }}
          >
            <Grid container justifyContent="center" alignItems="center" style={{ gap: 8 }}>
              <Grid item>
                <ColorDot color={networkDotColorMap[networkOption]} />
              </Grid>
              <Grid item>
                <Typography variant={"h6"} color="textPrimary">
                  {capitalize(networkOption)}
                </Typography>
              </Grid>
            </Grid>
          </SheetItem>
        ))}
      </Grid>
    </ResponsiveDialog>
  )
}
