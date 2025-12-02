import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import {
  Grid,
  Table,
  TableBody,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  TableHead,
  TableCell
} from "components/ui"
import { CustomTableContainer, CustomTableCell, CustomTableCellValue, RowValue, SummaryHeaderCell } from "components/ui"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"
import { CopyAddress } from "modules/common/CopyAddress"
import { CopyButton } from "modules/common/CopyButton"

// Styled components moved to components/ui/etherlink/SummaryTable

export const EvmDaoSummary = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { data } = useEvmDaoCreateStore()

  const isWrappedToken = data?.tokenDeploymentMechanism === "wrapped"

  // Format duration helper
  const formatDuration = (days: number, hours: number, minutes: number) => {
    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    return parts.length > 0 ? parts.join(" ") : "0m"
  }

  const votingDelay = formatDuration(
    Number(data?.voting?.votingBlocksDay) || 0,
    Number(data?.voting?.votingBlocksHours) || 0,
    Number(data?.voting?.votingBlocksMinutes) || 0
  )

  const votingDuration = formatDuration(
    Number(data?.voting?.proposalFlushBlocksDay) || 0,
    Number(data?.voting?.proposalFlushBlocksHours) || 0,
    Number(data?.voting?.proposalFlushBlocksMinutes) || 0
  )

  const executionDelay = formatDuration(
    Number(data?.voting?.proposalExpiryBlocksDay) || 0,
    Number(data?.voting?.proposalExpiryBlocksHours) || 0,
    Number(data?.voting?.proposalExpiryBlocksMinutes) || 0
  )

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
        },
        { key: "Voting Delay", value: votingDelay },
        { key: "Voting Duration", value: votingDuration },
        { key: "Execution Delay", value: executionDelay }
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
        },
        { key: "Voting Delay", value: votingDelay },
        { key: "Voting Duration", value: votingDuration },
        { key: "Execution Delay", value: executionDelay }
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

        {/* Initial Members (only for new token deployment) */}
        {data?.tokenDeploymentMechanism !== "wrapped" && (
          <div style={{ marginTop: 32 }}>
            <Typography variant="h6" style={{ color: "white", marginBottom: 8, lineHeight: 1.3 }}>
              Initial Members ({data?.members?.length || 0})
            </Typography>
            <CustomTableContainer>
              <Table aria-label="members table">
                <TableHead>
                  <TableRow>
                    <SummaryHeaderCell>#</SummaryHeaderCell>
                    <SummaryHeaderCell>Address</SummaryHeaderCell>
                    <SummaryHeaderCell align="right">Amount</SummaryHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(data?.members) && data.members.length > 0 ? (
                    data.members.map((member: { address: string; amountOfTokens: number }, index: number) => (
                      <TableRow key={`${member.address}-${index}`}>
                        <CustomTableCell component="th" scope="row">
                          <Typography style={{ color: "white", textAlign: "left" }}>{index + 1}</Typography>
                        </CustomTableCell>
                        <CustomTableCellValue align="left">
                          {typeof member.address === "string" && member.address.startsWith("0x") ? (
                            <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                              {isMobileSmall ? (
                                <CopyAddress address={member.address} />
                              ) : (
                                <>
                                  <Grid
                                    container
                                    style={{ color: "white" }}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                  >
                                    {member.address}
                                    <CopyButton text={member.address} />
                                  </Grid>
                                </>
                              )}
                            </RowValue>
                          ) : (
                            <RowValue style={isMobileSmall ? { width: "max-content" } : { color: "white" }}>
                              {member.address}
                            </RowValue>
                          )}
                        </CustomTableCellValue>
                        <CustomTableCellValue align="right">
                          <RowValue style={isMobileSmall ? { width: "max-content" } : { color: "white" }}>
                            {String(member.amountOfTokens)}
                          </RowValue>
                        </CustomTableCellValue>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <CustomTableCell component="th" scope="row">
                        <Typography style={{ color: "white", textAlign: "left" }}>—</Typography>
                      </CustomTableCell>
                      <CustomTableCellValue align="left">
                        <RowValue style={{ color: "white" }}>No members</RowValue>
                      </CustomTableCellValue>
                      <CustomTableCellValue align="right">
                        <RowValue style={{ color: "white" }}>-</RowValue>
                      </CustomTableCellValue>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CustomTableContainer>
          </div>
        )}

        {/* Registry Entries */}
        <div style={{ marginTop: 32 }}>
          <Typography variant="h6" style={{ color: "white", marginBottom: 8, lineHeight: 1.3 }}>
            Registry Entries
          </Typography>
          <CustomTableContainer>
            <Table aria-label="registry table">
              <TableHead>
                <TableRow>
                  <SummaryHeaderCell>Key</SummaryHeaderCell>
                  <SummaryHeaderCell align="right">Value</SummaryHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.registry && Object.keys(data.registry).length > 0 ? (
                  Object.entries(data.registry).map(([key, value]: [string, any]) => (
                    <TableRow key={`registry-${key}`}>
                      <CustomTableCell component="th" scope="row">
                        <Typography style={{ color: "white", textAlign: "left" }}>{key}</Typography>
                      </CustomTableCell>
                      <CustomTableCellValue align="right">
                        {typeof value === "string" && value.startsWith("0x") ? (
                          <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                            {isMobileSmall ? (
                              <CopyAddress address={value} />
                            ) : (
                              <>
                                <Grid
                                  container
                                  style={{ color: "white" }}
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="flex-end"
                                >
                                  {value}
                                  <CopyButton text={value} />
                                </Grid>
                              </>
                            )}
                          </RowValue>
                        ) : (
                          <RowValue style={isMobileSmall ? { width: "max-content" } : { color: "white" }}>
                            {String(value)}
                          </RowValue>
                        )}
                      </CustomTableCellValue>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <CustomTableCell component="th" scope="row">
                      <Typography style={{ color: "white", textAlign: "left" }}>No registry entries</Typography>
                    </CustomTableCell>
                    <CustomTableCellValue align="right">
                      <RowValue style={{ color: "white" }}>-</RowValue>
                    </CustomTableCellValue>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CustomTableContainer>
        </div>

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
