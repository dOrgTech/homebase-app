import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"
import { CopyAddress } from "modules/common/CopyAddress"
import { CopyButton } from "modules/common/CopyButton"

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  width: "inherit",
  [theme.breakpoints.down("sm")]: {}
}))

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 0,
    paddingLeft: "16px !important",
    textAlign: "end"
  }
}))

const CustomTableCellValue = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: 0,
    paddingRight: "16px !important",
    textAlign: "end",
    paddingBottom: 0
  }
}))

const RowValue = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

export const EvmDaoSummary = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { data } = useEvmDaoCreateStore()

  const isWrappedToken = data?.tokenDeploymentMechanism === "wrapped"

  const tableData = isWrappedToken
    ? [
        { key: "Name", value: data?.name },
        { key: "Token Type", value: "Wrapped Existing Token" },
        { key: "Underlying Token", value: data?.underlyingTokenAddress },
        { key: "Wrapped Symbol", value: data?.wrappedTokenSymbol },
        { key: "Wrapped Name", value: `Wrapped ${data?.wrappedTokenSymbol}` },
        { key: "Decimals", value: "(Matches Underlying Token)" },
        { key: "Initial Supply", value: "0" },
        {
          key: "Quorum",
          value: `${data?.quorum?.returnedTokenPercentage}%`
        },
        {
          key: "Proposal Threshold",
          value: `${data?.quorum?.proposalThreshold || 0}`
        }
      ]
    : [
        { key: "Name", value: data?.name },
        { key: "Token Type", value: "New Standard Token" },
        { key: "Symbol", value: data?.governanceToken?.symbol },
        { key: "Decimals", value: data?.governanceToken?.tokenDecimals?.toString() },
        {
          key: "Total Members",
          value: data?.members.length.toString()
        },
        {
          key: "Total Supply",
          value: data?.members
            .reduce((acc: number, member: { amountOfTokens: number }) => Number(acc) + Number(member.amountOfTokens), 0)
            .toString()
        },
        {
          key: "Transferable",
          value: data?.nonTransferable ? "No" : "Yes"
        },
        {
          key: "Quorum",
          value: `${data?.quorum?.returnedTokenPercentage}%`
        }
      ]
  return (
    <div className="evm-dao-summary">
      <TitleBlock
        title="DAO Summary"
        description={
          <DescriptionText variant="subtitle1">These settings will define the summary for your DAO.</DescriptionText>
        }
      />
      <div className="summary-content">
        <CustomTableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {tableData.map((item: { key: string; value: string }) => (
                <TableRow key={item.key}>
                  <CustomTableCell component="th" scope="row">
                    <Typography style={{ color: "white", textAlign: "left" }}>{item.key}</Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    {typeof item.value === "string" && item?.value?.startsWith("0x") ? (
                      <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                        {isMobileSmall ? (
                          <CopyAddress address={item.value} />
                        ) : (
                          <>
                            <Grid
                              container
                              style={{ color: "white" }}
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              {item.value}
                              <CopyButton text={item.value} />
                            </Grid>
                          </>
                        )}
                      </RowValue>
                    ) : (
                      <RowValue style={isMobileSmall ? { width: "max-content" } : { color: "white" }}>
                        {item.value}
                      </RowValue>
                    )}
                  </CustomTableCellValue>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CustomTableContainer>

        {isWrappedToken && (
          <Grid
            container
            style={{ marginTop: 32, padding: 24, backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 8 }}
          >
            <Grid item xs={12}>
              <Typography variant="h6" style={{ color: "white", marginBottom: 8, lineHeight: 1.3 }}>
                Post-Deployment Steps
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: 2, lineHeight: 1.3 }}
              >
                After your DAO is deployed:
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: 2, lineHeight: 1.3 }}
              >
                1. Token holders must wrap their existing tokens to participate in governance
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: 2, lineHeight: 1.3 }}
              >
                2. Wrapped tokens will automatically delegate voting power
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: 2, lineHeight: 1.3 }}
              >
                3. Users can unwrap tokens at any time to retrieve their original tokens
              </Typography>
              <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.3 }}>
                4. The wrapped token contract address will be provided after deployment
              </Typography>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  )
}
