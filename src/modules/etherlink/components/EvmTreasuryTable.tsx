import { Typography } from "@material-ui/core"
import { SmallButton } from "modules/common/SmallButton"
import { Grid } from "@material-ui/core"
import { TableContainer } from "@material-ui/core"
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"

import { Table } from "@material-ui/core"
import { CopyButton } from "components/ui/CopyButton"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"
import { toShortAddress } from "services/contracts/utils"

export const EvmTreasuryTable = () => {
  const { daoSelected, daoRegistryDetails, daoTreasuryTokens } = useContext(EtherlinkContext)
  const { setMetadataFieldValue, setTransferAssets, setCurrentStep } = useEvmProposalOps()
  const history = useHistory()

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
              <SmallButton
                onClick={() => {
                  setMetadataFieldValue("type", "transfer_assets")

                  setTransferAssets(
                    [{ assetType: "transferETH", recipient: "", amount: "" }],
                    daoSelected.registryAddress
                  )
                  setCurrentStep(1)
                  history.push(`${window.location.pathname.slice(0, -8)}proposals`)
                }}
              >
                <Typography color="primary">Transfer</Typography>
              </SmallButton>
            </TableCell>
          </TableRow>
          {daoTreasuryTokens?.map((token: any) => (
            <TableRow key={token.address}>
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.symbol}</TableCell>
              <TableCell>{token.balance}</TableCell>
              <TableCell>
                <Grid container direction="row" alignItems="center">
                  {toShortAddress(token.address)}
                  <CopyButton text={token.address} />
                </Grid>
              </TableCell>
              <TableCell>
                <SmallButton
                  onClick={() => {
                    setMetadataFieldValue("type", "transfer_assets")

                    setTransferAssets(
                      [
                        {
                          assetType: "transferERC20",
                          assetSymbol: token.symbol,
                          assetAddress: token.address,
                          recipient: "",
                          amount: token.balance
                        }
                      ],
                      daoSelected.registryAddress
                    )
                    setCurrentStep(1)
                    history.push(`${window.location.pathname.slice(0, -8)}proposals`)
                  }}
                >
                  <Typography color="primary">Transfer</Typography>
                </SmallButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
