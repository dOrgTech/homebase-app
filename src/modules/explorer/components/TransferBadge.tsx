import { Grid, GridProps, styled, Typography } from "@material-ui/core"
import ArrowForward from "@material-ui/icons/ArrowForward"
import { BigNumber } from "bignumber.js"
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge"
import { UserBadge } from "modules/explorer/components/UserBadge"
import React from "react"
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"
import { parseUnits } from "services/contracts/utils"
import { FA2Symbol } from "./FA2Symbol"

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary
}))

interface Props extends GridProps {
  address: string
  amount: BigNumber
  contract: string
  tokenId: string
}

export const TransferBadge: React.FC<Props> = ({ address, amount, contract, tokenId, ...props }) => {
  const { data } = useTokenMetadata(contract, tokenId)

  return (
    <HighlightedBadge
      justifyContent="center"
      alignItems="center"
      direction="row"
      container
      style={{ gap: 20 }}
      {...props}
    >
      <Grid item>
        {data && (
          <Typography variant="body1" color="textPrimary">
            {parseUnits(amount, data.decimals).toString()} <FA2Symbol contractAddress={contract} tokenId={tokenId} />
          </Typography>
        )}
      </Grid>
      <ArrowContainer item>
        <ArrowForward color="inherit" />
      </ArrowContainer>
      <Grid item>
        <UserBadge address={address} />
      </Grid>
    </HighlightedBadge>
  )
}
