import React from "react"
import { Grid, Theme, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import { TransferWithBN } from "services/contracts/baseDAO/hooks/useTransfers"
import { ReactComponent as DepositIcon } from "assets/logos/deposit_icon.svg"
import { ReactComponent as WithdrawalIcon } from "assets/logos/withdrawal_icon.svg"
import { toShortAddress } from "services/contracts/utils"
import dayjs from "dayjs"
import BigNumber from "bignumber.js"
import { formatNumber } from "modules/explorer/utils/FormatNumber"

const ContentBlockItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: "37px 42px",
  background: theme.palette.primary.main,
  borderRadius: 8
}))

const ProposalTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 18
})

const DescriptionText = styled(Typography)({
  color: "#BFC5CA",
  fontSize: 16,
  fontWeight: 300
})

export const TransactionItem: React.FC<{ item: TransferWithBN }> = ({ item, children }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <ContentBlockItem container justifyContent="space-between" alignItems="center">
      <Grid
        container
        direction={isMobileSmall ? "column" : "row"}
        alignItems="center"
        style={isMobileSmall ? { gap: 12 } : {}}
      >
        <Grid item xs={isMobileSmall ? 12 : 1}>
          {item.type === "Withdrawal" ? <WithdrawalIcon /> : <DepositIcon />}
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={isMobileSmall ? 12 : 8}
          style={isMobileSmall ? { gap: 12, textAlign: "center" } : {}}
        >
          <ProposalTitle color="textPrimary" variant="body1">
            {item.type}
          </ProposalTitle>
          <DescriptionText color="textPrimary" variant="body1">
            {item.type === "Withdrawal" ? "To  " : "From  "} {toShortAddress(item.recipient)} &nbsp; {" • "}
            &nbsp; {dayjs(item.date).format("LL")}
          </DescriptionText>
        </Grid>
        <Grid item xs={isMobileSmall ? 12 : 3} container justifyContent={isMobileSmall ? "center" : "flex-end"}>
          <DescriptionText>
            {" "}
            {item.type === "Withdrawal" ? "- " : "+ "} {formatNumber(new BigNumber(item.amount))} {item.token?.symbol}
          </DescriptionText>
        </Grid>
      </Grid>
      <Grid item>{children}</Grid>
    </ContentBlockItem>
  )
}
