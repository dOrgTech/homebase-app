/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import _ from "lodash"
import {
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core"
import React, { useState } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useDAOID } from "../../DAO/router"
import BigNumber from "bignumber.js"
import { parseUnits } from "services/contracts/utils"

const RowValue = styled(Typography)({
  fontWeight: 300,
  fontSize: 18
})

const TableTitle = styled(Typography)({
  fontWeight: 500,
  fontSize: 18
})

export const DaoInfoTables: React.FC = () => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  console.log(dao)
  return (
    <>
      <TableContainer>
        <Table style={{ minWidth: 650, marginTop: 32 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
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
                    <RowValue>{dao.data.proposal_flush_level} blocks</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Proposal Blocks to Expire</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{dao.data.proposal_expired_level} blocks</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Stake Required to Propose</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>1 locked token</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Stake Returned if Rejected</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{dao.data.extra.returnedPercentage}% of locked tokens</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Transfer Maximum XTZ Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.extra.max_xtz_amount).toNumber()} XTZ</RowValue>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">Transfer Minimum XTZ Amount</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <RowValue>{new BigNumber(dao.data.extra.min_xtz_amount).toNumber()} XTZ</RowValue>
                  </TableCell>
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer>
        <Table style={{ minWidth: 650, marginTop: 32 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
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
                    <RowValue>{dao.data.quorum_threshold.toNumber()}%</RowValue>
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
      </TableContainer>
    </>
  )
}
