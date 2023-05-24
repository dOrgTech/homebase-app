/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import { NFT as NFTModel } from "models/Token"
import { CopyAddress } from "modules/common/CopyAddress"
import { NFT } from "modules/explorer/components/NFT"
import { NFTDialog } from "modules/explorer/components/NFTDialog"
import { ProposalFormContainer, ProposalFormDefaultValues } from "modules/explorer/components/ProposalForm"
import { UserBadge } from "modules/explorer/components/UserBadge"

import React, { useState } from "react"
import { NFTDAOHolding } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAONFTHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { ContentContainer } from "../../components/ContentContainer"
import { Hero } from "../../components/Hero"
import { HeroTitle } from "../../components/HeroTitle"
import { useDAOID } from "../DAO/router"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { SmallButton } from "../../../common/SmallButton"
import { MainButton } from "../../../common/MainButton"
import { parseUnits } from "services/contracts/utils"

const Card = styled(ContentContainer)({
  boxSizing: "border-box",
  padding: 30,
  width: 325,
  minHeight: 500,
  cursor: "pointer"
})

const FullWidthContainer = styled(Grid)({
  width: "100%"
})

const ImgContainer = styled(Box)({
  height: 246,
  width: "100%"
})

const NFTId = styled(Typography)({
  fontSize: 14,
  fontWeight: 300
})

const NFTTitle = styled(Typography)({
  fontWeight: 500
})

export const NFTs: React.FC = () => {
  const theme = useTheme()
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const { nftHoldings } = useDAONFTHoldings(daoId)
  const [openTransfer, setOpenTransfer] = useState(false)
  const { account } = useTezos()
  const [defaultValues, setDefaultValues] = useState<ProposalFormDefaultValues>()
  const [selectedNFT, setSelectedNFT] = useState<NFTDAOHolding>()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const onClickNFT = (nft: NFTDAOHolding) => {
    setSelectedNFT(nft)
  }

  const onCloseDialog = () => {
    setSelectedNFT(undefined)
  }

  const onOpenTransferModal = (nft: NFTModel) => {
    setDefaultValues({
      nftTransferForm: {
        isBatch: false,
        transfers: [
          {
            recipient: account,
            amount: 1,
            asset: nft
          }
        ]
      }
    })
    setOpenTransfer(true)
  }

  const onClick = (e: any, nft: NFTModel) => {
    e.stopPropagation()
    onOpenTransferModal(nft)
  }

  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }

  const shouldDisable = useIsProposalButtonDisabled(daoId)

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Grid item>
          <Grid container justifyContent={isMobileSmall ? "center" : "flex-start"} style={{ gap: 12 }}>
            {!nftHoldings ? (
              <>
                <Grid container direction="row" justifyContent="center">
                  <CircularProgress color="secondary" />
                </Grid>
              </>
            ) : (
              <>
                {nftHoldings.map((nft, i) => (
                  <Card
                    key={`nft-${i}`}
                    item
                    container
                    xs={isMobileSmall ? 12 : undefined}
                    direction="column"
                    style={{ gap: 20 }}
                    onClick={() => onClickNFT(nft)}
                  >
                    <Grid item>
                      <Grid container direction="column" style={{ gap: 18 }} alignItems="center">
                        <FullWidthContainer item>
                          {nft.token.firstCreator ? (
                            <UserBadge size={35} address={nft.token.firstCreator} short={true} />
                          ) : (
                            <Typography color={"textPrimary"} variant={"body1"}>
                              Unknown
                            </Typography>
                          )}
                        </FullWidthContainer>
                        <Grid item>
                          <ImgContainer>
                            <NFT
                              qmHash={nft.token.artifact_hash}
                              mediaType={nft.token.mediaType}
                              name={nft.token.name}
                            />
                          </ImgContainer>
                        </Grid>
                        <FullWidthContainer item container direction="row" justifyContent="space-between">
                          <NFTId color="textPrimary">
                            {nft.token.symbol}#{nft.token.id}
                          </NFTId>
                          <NFTId color="textPrimary">#{nft.token.token_id}</NFTId>
                        </FullWidthContainer>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container direction="column" style={{ gap: 20 }}>
                        <Grid item>
                          <NFTTitle color="textPrimary" variant="h4">
                            {nft.token.name}
                          </NFTTitle>
                        </Grid>
                        <Grid item>
                          <Typography color="secondary" style={{ marginBottom: 16 }}>
                            {parseUnits(nft.token.supply, nft.token.decimals).toString()} {nft.token.symbol}
                          </Typography>
                        </Grid>
                        <Grid item container direction="row" justifyContent="center">
                          <SmallButton
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={e => onClick(e, nft.token)}
                            disabled={shouldDisable}
                          >
                            Transfer
                          </SmallButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <NFTDialog open={!!selectedNFT} onClose={onCloseDialog} nft={(selectedNFT as NFTDAOHolding)?.token} />
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={1}
      />
    </>
  )
}
