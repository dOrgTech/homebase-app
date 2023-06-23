/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import React from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import BigNumber from "bignumber.js"
import { useDAOID } from "../../DAO/router"
import { useDelegate } from "services/contracts/baseDAO/hooks/useDelegate"
import { CopyButton } from "modules/common/CopyButton"
import { CopyAddress } from "modules/common/CopyAddress"

const RowValue = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

const TableTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

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

const CustomTableCellTitle = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px !important"
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

export const DaoInfoTables: React.FC = () => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const currentDelegate = useDelegate(dao && dao?.data.address ? dao?.data.address : "")

  return (
    <>
      <CustomTableContainer>
        <Table style={isMobileSmall ? {} : { marginTop: 32 }} aria-label="simple table">
          <TableBody>
            {dao ? (
              <>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Contract Address (Treasury)
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                      {isMobileSmall ? (
                        <CopyAddress address={dao.data.address} />
                      ) : (
                        <>
                          <Grid container direction="row" alignItems="center" justifyContent="flex-end">
                            {dao.data.address}
                            <CopyButton text={dao.data.address} />
                          </Grid>
                        </>
                      )}
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Current Delegate
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                      {currentDelegate && currentDelegate.data && currentDelegate.data.address ? (
                        isMobileSmall ? (
                          <CopyAddress address={currentDelegate.data.address} />
                        ) : (
                          <Grid container direction="row" alignItems="center" justifyContent="flex-end">
                            {currentDelegate.data.address}
                            <CopyButton text={dao.data.address} />
                          </Grid>
                        )
                      ) : (
                        "-"
                      )}
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </CustomTableContainer>
      <CustomTableContainer>
        <Table style={{ marginTop: 32 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <CustomTableCellTitle colSpan={2}>
                <TableTitle>Proposal & Voting Settings</TableTitle>
              </CustomTableCellTitle>
            </TableRow>
          </TableHead>
          <TableBody>
            {dao ? (
              <>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Voting Period Duration
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{dao.data.period} blocks</RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Flush Delay Duration
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>
                      {new BigNumber(dao.data.proposal_flush_level).toNumber() -
                        2 * new BigNumber(dao.data.period).toNumber()}{" "}
                      blocks
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Proposal Blocks to Expire
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>
                      {new BigNumber(dao.data.proposal_expired_level).toNumber() -
                        new BigNumber(dao.data.proposal_flush_level).toNumber()}{" "}
                      blocks
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Stake Required to Propose
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>
                      {new BigNumber(dao.data.extra.frozen_extra_value).toNumber()} locked {dao.data.token.symbol}
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Stake Returned if Rejected
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>
                      {dao.data.extra.returnedPercentage}% of locked {dao.data.token.symbol}
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Transfer Maximum XTZ Amount
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.extra.max_xtz_amount).div(10 ** 6).toNumber()} XTZ</RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Transfer Minimum XTZ Amount
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.extra.min_xtz_amount).div(10 ** 6).toNumber()} XTZ</RowValue>
                  </CustomTableCellValue>
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </CustomTableContainer>

      <CustomTableContainer>
        <Table style={{ marginTop: 32 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <CustomTableCellTitle colSpan={2}>
                <TableTitle>Quorum Settings</TableTitle>
              </CustomTableCellTitle>
            </TableRow>
          </TableHead>
          <TableBody>
            {dao ? (
              <>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Quorum Threshold
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>
                      {dao.data.quorum_threshold.toNumber()} {dao.data.token.symbol}
                    </RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Quorum Min Amount
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.min_quorum_threshold).div(10000).toNumber()}%</RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Quorum Max Amount
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.max_quorum_threshold).div(10000).toNumber()}%</RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Quorum Change
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.quorum_change).div(10000).toNumber()}%</RowValue>
                  </CustomTableCellValue>
                </TableRow>
                <TableRow>
                  <CustomTableCell component="th" scope="row">
                    <Typography color="textPrimary" variant="body1">
                      Quorum Max Change
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    <RowValue>{new BigNumber(dao.data.max_quorum_change).div(10000).toNumber()}%</RowValue>
                  </CustomTableCellValue>
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </>
  )
}
