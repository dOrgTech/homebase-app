/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Box, CircularProgress, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { NFT as NFTModel } from "models/Token"
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
import { useDAOID } from "../DAO/router"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { SmallButton } from "../../../common/SmallButton"
import { parseUnits } from "services/contracts/utils"
import ReactPaginate from "react-paginate"
import "../DAOList/styles.css"

const Card = styled(ContentContainer)(({ theme }) => ({
  boxSizing: "border-box",
  padding: 30,
  width: 325,
  minHeight: 500,
  cursor: "pointer",
  background: theme.palette.primary.main
}))

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

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
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
  const value = isMobileSmall ? 6 : 4
  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (nftHoldings) {
      const newOffset = (event.selected * value) % nftHoldings.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const pageCount = Math.ceil(nftHoldings ? nftHoldings.length / value : 0)

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Grid item style={{ width: "inherit" }}>
          <Grid container justifyContent={isMobileSmall ? "center" : "space-between"} style={{ gap: 12 }}>
            {!nftHoldings ? (
              <>
                <Grid container direction="row" justifyContent="center">
                  <CircularProgress color="secondary" />
                </Grid>
              </>
            ) : (
              <>
                {nftHoldings.slice(offset, offset + value).map((nft, i) => (
                  <Card
                    key={`nft-${i}`}
                    item
                    container
                    xs={isMobileSmall ? 12 : 6}
                    direction="column"
                    style={isMobileSmall ? { gap: 20 } : { gap: 20, flexBasis: "49%", maxWidth: "49%" }}
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
                {!(nftHoldings && nftHoldings.length > 0) ? (
                  <ProposalsFooter item container direction="column" justifyContent="center">
                    <Grid item>
                      <Typography color="textPrimary" align="center">
                        No items
                      </Typography>
                    </Grid>
                  </ProposalsFooter>
                ) : null}
                <Grid container direction="row" justifyContent="flex-end">
                  <ReactPaginate
                    previousLabel={"<"}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={6}
                    pageCount={pageCount}
                    renderOnZeroPageCount={null}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                    nextClassName="nextButton"
                    previousClassName="nextButton"
                  />
                </Grid>
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
