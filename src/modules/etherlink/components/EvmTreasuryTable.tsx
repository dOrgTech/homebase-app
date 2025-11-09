import { Typography } from "components/ui"
import { SmallButton } from "modules/common/SmallButton"
import { Grid } from "components/ui"
import { TableContainer, TableBody, TableCell, TableHead, TableRow, Table } from "components/ui"
import { CopyButton } from "components/ui/CopyButton"
import { useContext, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"
import { toShortAddress } from "services/contracts/utils"
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
import { Card, CardContent, CardMedia } from "components/ui"
import { dbg } from "utils/debug"

const useStyles = makeStyles({
  toggleGroup: {
    marginBottom: 16
  },
  nftGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
    marginTop: 16
  },
  nftCard: {
    "height": "100%",
    "borderRadius": 12,
    "overflow": "hidden",
    "boxShadow": "0 4px 12px rgba(0,0,0,0.1)",
    "transition": "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)"
    }
  },
  nftImage: {
    height: 280,
    objectFit: "cover",
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
  },
  nftContent: {
    padding: 16,
    background: "#292e32"
  },
  nftTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: 4,
    color: "#fff"
  },
  nftCollection: {
    fontSize: "0.9rem",
    color: "#a0a0a0",
    marginBottom: 16
  },
  nftDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  nftPrice: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#fff"
  }
})

export const EvmTreasuryTable = () => {
  const { daoSelected, daoRegistryDetails, daoTreasuryTokens, daoNfts, contractData } = useContext(EtherlinkContext)
  const { setMetadataFieldValue, setTransferAssets, setCurrentStep } = useEvmProposalOps()
  const history = useHistory()
  const [view, setView] = useState("tokens")
  const classes = useStyles()

  if (!daoSelected || !daoRegistryDetails) {
    return <Typography>Loading treasury data...</Typography>
  }

  const renderNFTView = () => {
    const nftList = Array.isArray(daoNfts)
      ? daoNfts.filter((n: any) => {
          const t = String(n?.token?.type || n?.token_type || n?.token?.standard || "").toUpperCase()
          return t.includes("ERC721") || t.includes("ERC-721")
        })
      : []

    if (!nftList.length) {
      return (
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{ padding: 48 }}>
          <Typography color="textSecondary">No NFTs exist for this DAO</Typography>
        </Grid>
      )
    }

    return (
      <div className={classes.nftGrid}>
        {nftList.map(nft => (
          <Card key={nft?.id} className={classes.nftCard}>
            <CardMedia
              className={classes.nftImage}
              image={nft.image_url || `https://picsum.photos/400/400?random=${nft.id}`}
              title={nft.metadata?.name || `NFT #${nft.id}`}
              component="div"
              style={{ backgroundSize: "cover" }}
            />
            <CardContent className={classes.nftContent}>
              <Typography className={classes.nftTitle}>
                {nft.metadata?.name || `NFT #${nft.token_id ?? nft.id}`}
              </Typography>
              <Typography className={classes.nftCollection}>{nft.metadata?.description || "Etherlink DAO"}</Typography>
              <div className={classes.nftDetails}>
                <Typography className={classes.nftPrice}>{nft.token?.symbol}</Typography>
                <Typography color="textSecondary">#{nft.token_id ?? nft.id}</Typography>
              </div>
              <SmallButton
                onClick={() => {
                  const addr =
                    nft?.token?.address ||
                    nft?.token?.contract_address ||
                    nft?.contract?.address ||
                    nft?.contract_address ||
                    nft?.token_address ||
                    (nft as any)?.collection?.address
                  dbg("EL-XFER:quickNFT", {
                    token: nft?.token?.symbol,
                    address: addr,
                    tokenId: String(nft?.token_id ?? nft?.id)
                  })
                  setMetadataFieldValue("type", "transfer_assets")
                  setTransferAssets(
                    [
                      {
                        assetType: "transferERC721",
                        assetAddress: addr,
                        tokenId: String(nft?.token_id ?? nft?.id),
                        recipient: ""
                      }
                    ],
                    daoSelected.registryAddress
                  )
                  setCurrentStep(1)
                  history.push(`${window.location.pathname.slice(0, -8)}proposals`)
                }}
              >
                <Typography color="primary">Transfer NFT</Typography>
              </SmallButton>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderTokenView = () => (
    <TableContainer style={{ overflowX: "auto", maxWidth: "100%" }}>
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
            <TableCell>{contractData?.nativeCurrency || "Tezos"}</TableCell>
            <TableCell>{contractData?.symbol || "XTZ"}</TableCell>
            <TableCell>{daoRegistryDetails?.balance}</TableCell>
            <TableCell>
              <Grid container direction="row" alignItems="center">
                native token
                {/* <CopyButton text="0x1234567890abcdef" /> */}
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
                          assetDecimals: token.decimals,
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

  return (
    <>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, newValue) => newValue && setView(newValue)}
        className={classes.toggleGroup}
      >
        <ToggleButton value="tokens">Tokens</ToggleButton>
        <ToggleButton value="nfts">NFTs</ToggleButton>
      </ToggleButtonGroup>
      {view === "tokens" ? renderTokenView() : renderNFTView()}
    </>
  )
}
