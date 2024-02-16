import React from "react"
import { TableCell, TableHead, TableRow, styled, Grid, Typography, useTheme, useMediaQuery } from "@material-ui/core"
import dayjs from "dayjs"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "./CopyButton"
import { toShortAddress } from "services/contracts/utils"
import numbro from "numbro"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

interface RowData {
  address: string
  votes: string
  availableStaked: string
  totalStaked: string
  proposalsVoted: string
}

const Title = styled(Typography)({
  fontSize: 20
})

const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "40px 48px",
  borderRadius: 8
}))

const Value = styled(Typography)({
  marginTop: 8,
  fontWeight: 300,
  gap: 6,
  display: "flex",
  textTransform: "uppercase"
})

const Symbol = styled(Typography)({
  marginLeft: 4,
  fontWeight: 300
})

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

const MobileUsersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  return (
    <>
      <Grid container style={{ gap: 32 }}>
        <Grid item container direction="row">
          <Grid item xs={12}>
            <Title color="textPrimary">Top Addresses</Title>
          </Grid>
        </Grid>

        {data.map((item, i) => (
          <CardContainer key={`usersrow-${i}`} container direction="row" style={{ gap: 24 }}>
            <Grid item container direction="row" alignItems="center" xs={12} style={{ gap: 8 }}>
              <Blockie address={item.address} size={24} />
              <Typography style={{ fontWeight: 300 }} color="textPrimary" variant="body2">
                {toShortAddress(item.address)}
              </Typography>
              <CopyButton text={item.address} />
            </Grid>
            <Grid item container direction="row" xs={12} style={{ gap: 20 }}>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Votes
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.votes).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Voted
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsVoted).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Available Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.availableStaked).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.totalStaked).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
            </Grid>
          </CardContainer>
        ))}
      </Grid>
    </>
  )
}

const DesktopUsersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  return (
    <>
      <Grid container style={{ gap: 32 }}>
        <Grid item container direction="row">
          <Grid item xs={12}>
            <Title color="textPrimary">Top Addresses</Title>
          </Grid>
        </Grid>

        {data.map((item, i) => (
          <CardContainer key={`usersrow-${i}`} container direction="row" style={{ gap: 24 }}>
            <Grid item container direction="row" alignItems="center" xs={12} style={{ gap: 8 }}>
              <Blockie address={item.address} size={24} />
              <Typography style={{ fontWeight: 300 }} color="textPrimary" variant="body2">
                {item.address}
              </Typography>
              <CopyButton text={item.address} />
            </Grid>
            <Grid item container direction="row" xs={12} justifyContent="space-between">
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Votes
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.votes).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Voted
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsVoted).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Available Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.availableStaked).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Total Staked
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.totalStaked).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
            </Grid>
          </CardContainer>
        ))}
      </Grid>
    </>
  )
}

export const UsersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(820))

  return isExtraSmall ? (
    <MobileUsersTable data={data} symbol={symbol} />
  ) : (
    <DesktopUsersTable data={data} symbol={symbol} />
  )
}
