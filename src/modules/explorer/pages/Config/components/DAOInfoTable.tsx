/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core"
import React from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useDAOID } from "../../DAO/router"
import BigNumber from "bignumber.js"

const RowValue = styled(Typography)({
  fontWeight: 300,
  fontSize: 18
})

const TableTitle = styled(Typography)({
  fontWeight: 500,
  fontSize: 18
})

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    maxWidth: 390
  }
}))

export const DaoInfoTables: React.FC = () => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  return (
    <>
      <CustomTableContainer>
        <Table style={{ marginTop: 32 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <TableTitle>Proposal & Voting Settings</TableTitle>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dao ? (
              <>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Voting Period Duration</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{dao.data.period} blocks</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Flush Delay Duration</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>
                      {new BigNumber(dao.data.proposal_flush_level).toNumber() -
                        2 * new BigNumber(dao.data.period).toNumber()}{" "}
                      blocks
                    </RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Proposal Blocks to Expire</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>
                      {new BigNumber(dao.data.proposal_expired_level).toNumber() -
                        new BigNumber(dao.data.proposal_flush_level).toNumber()}{" "}
                      blocks
                    </RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Stake Required to Propose</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>
                      {new BigNumber(dao.data.extra.frozen_extra_value).toNumber()} locked {dao.data.token.symbol}
                    </RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Stake Returned if Rejected</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>
                      {dao.data.extra.returnedPercentage}% of locked {dao.data.token.symbol}
                    </RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Transfer Maximum XTZ Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.extra.max_xtz_amount).div(10 ** 6).toNumber()} XTZ</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Transfer Minimum XTZ Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.extra.min_xtz_amount).div(10 ** 6).toNumber()} XTZ</RowValue>
                  </TableCell>
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
              <TableCell colSpan={2}>
                <TableTitle>Quorum Settings</TableTitle>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dao ? (
              <>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Quorum Threshold</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>
                      {dao.data.quorum_threshold.toNumber()} {dao.data.token.symbol}
                    </RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Quorum Min Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.min_quorum_threshold).div(10000).toNumber()}%</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Quorum Max Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.max_quorum_threshold).div(10000).toNumber()}%</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Quorum Change</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.quorum_change).div(10000).toNumber()}%</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Quorum Max Change</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.max_quorum_change).div(10000).toNumber()}%</RowValue>
                  </TableCell>
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </>
  )
}
