import { Typography } from "@material-ui/core"
import { SmallButton } from "modules/common/SmallButton"
import { Grid } from "@material-ui/core"
import { TableContainer } from "@material-ui/core"
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"

import { Table } from "@material-ui/core"
import { CopyButton } from "components/ui/CopyButton"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"

export const EvmTreasuryTable = () => {
  const { daoSelected, daoRegistryDetails } = useContext(EtherlinkContext)

  if (!daoSelected || !daoRegistryDetails) {
    return <Typography>Loading treasury data...</Typography>
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Token Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Address</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Etherink Testnet</TableCell>
            <TableCell>XTZ</TableCell>
            <TableCell>{daoRegistryDetails?.balance}</TableCell>
            <TableCell>
              <Grid container direction="row" alignItems="center">
                native token
                <CopyButton text="0x1234567890abcdef" />
              </Grid>
            </TableCell>
            <TableCell>
              <SmallButton>
                <Typography color="primary">Transfer</Typography>
              </SmallButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
