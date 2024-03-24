import { Grid, GridProps, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import ArrowForward from "@material-ui/icons/ArrowForward"
import { BigNumber } from "bignumber.js"
import React from "react"
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"
import { parseUnits, toShortAddress } from "services/contracts/utils"
import { FA2Symbol } from "./FA2Symbol"
import numbro from "numbro"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { useTezos } from "services/beacon/hooks/useTezos"
import { networkNameMap } from "services/bakingBad"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "./CopyButton"

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary
}))

const AddressLabel = styled(Typography)({
  fontWeight: 300,
  cursor: "default"
})

const ExplorerLabel = styled(Typography)({
  marginLeft: 8,
  fontSize: 16
})
interface Props extends GridProps {
  address: string
  amount: BigNumber
  contract: string
  tokenId: string
}

const formatConfig = {
  thousandSeparated: true
}

export const TransferBadge: React.FC<Props> = ({ address, amount, contract, tokenId, ...props }) => {
  const { data } = useTokenMetadata(contract, tokenId)
  const { network } = useTezos()
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const openBlockExplorer = () => {
    window.open(`https://${networkNameMap[network]}.tzkt.io/` + address, "_blank")
  }

  return (
    <Grid alignItems="center" direction="row" justifyContent="space-between" container style={{ gap: 20 }} {...props}>
      <Grid item container xs={isMobileSmall ? 12 : 8} justifyContent={isMobileSmall ? "center" : "flex-start"}>
        <Grid item>
          {data && (
            <Typography variant="body1" color="textPrimary">
              {numbro(parseUnits(amount, data.decimals)).format(formatConfig)}{" "}
              <FA2Symbol contractAddress={contract} tokenId={tokenId} />
            </Typography>
          )}
        </Grid>
        <ArrowContainer item>
          <ArrowForward color="inherit" />
        </ArrowContainer>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Blockie address="address" style={{ marginRight: 6 }}></Blockie>
            <AddressLabel color="textPrimary" style={{ marginRight: 6 }}>
              {isMobileSmall ? toShortAddress(address) : address}
            </AddressLabel>
            <CopyButton text={address} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={isMobileSmall ? 12 : 3}>
        <Grid
          style={{ cursor: "pointer" }}
          item
          container
          justifyContent={isMobileSmall ? "center" : "flex-end"}
          alignItems="center"
          onClick={openBlockExplorer}
        >
          <OpenInNewIcon style={{ fontSize: 16 }} color="secondary" />
          <ExplorerLabel color="secondary">View on Block Explorer</ExplorerLabel>
        </Grid>
      </Grid>
    </Grid>
  )
}
