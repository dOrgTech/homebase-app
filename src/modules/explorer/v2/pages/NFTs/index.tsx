import {
  Box,
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { NFT as NFTModel } from "models/Token";
import { CopyAddress } from "modules/common/CopyAddress";
import { NFT } from "modules/explorer/components/NFT";
import { NFTDialog } from "modules/explorer/components/NFTDialog";
import { ProposalFormContainer, ProposalFormDefaultValues } from "modules/explorer/components/ProposalForm";
import { UserBadge } from "modules/explorer/components/UserBadge";

import React, { useState } from "react";
import { NFTDAOHolding } from "services/bakingBad/tokenBalances";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { ContentContainer } from "../../components/ContentContainer";
import { Hero } from "../../components/Hero";
import { HeroTitle } from "../../components/HeroTitle";
import { useDAOID } from "../DAO/router";

const Card = styled(ContentContainer)({
  boxSizing: "border-box",
  padding: 30,
  width: 325,
  minHeight: 500,
  cursor: "pointer",
});

const FullWidthContainer = styled(Grid)({
  width: "100%",
});

const ImgContainer = styled(Box)({
  height: 246,
  width: "100%",
});

const NFTId = styled(Typography)({
  fontSize: 14,
});

const NFTTitle = styled(Typography)({
  fontWeight: "bold",
});

export const NFTs: React.FC = () => {
  const theme = useTheme();
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId)
  const { nftHoldings } = useDAOHoldings(daoId);
  const [openTransfer, setOpenTransfer] = useState(false);
  const { account } = useTezos();
  const [defaultValues, setDefaultValues] =
    useState<ProposalFormDefaultValues>();
  const [selectedNFT, setSelectedNFT] = useState<NFTDAOHolding>();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const onClickNFT = (nft: NFTDAOHolding) => {
    setSelectedNFT(nft);
  };

  const onCloseDialog = () => {
    setSelectedNFT(undefined);
  };

  const onOpenTransferModal = (nft: NFTModel) => {
    setDefaultValues({
      nftTransferForm: {
        isBatch: false,
        transfers: [
          {
            recipient: account,
            amount: 1,
            asset: nft,
          },
        ],
      },
    });
    setOpenTransfer(true);
  };

  const onClick = (e: any, nft: NFTModel) => {
    e.stopPropagation();
    onOpenTransferModal(nft);
  };

  const onCloseTransfer = () => {
    setOpenTransfer(false);
  };

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Hero>
          <Grid item>
            <HeroTitle>NFT Treasury</HeroTitle>
            {dao && (
              <CopyAddress
                address={dao.data.address}
                justify={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2",
                }}
              />
            )}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenTransfer(true)}
            >
              New Transfer
            </Button>
          </Grid>
        </Hero>
        <Grid item>
        <Grid
          container
          justifyContent={isMobileSmall ? "center" : "flex-start"}
          style={{ gap: 29.5 }}
        >
          {nftHoldings.map((nft, i) => (
            <Card
              key={`nft-${i}`}
              item
              container
              xs={isMobileSmall? 12: undefined}
              direction="column"
              style={{ gap: 20 }}
              onClick={() => onClickNFT(nft)}
            >
              <Grid item>
                <Grid
                  container
                  direction="column"
                  style={{ gap: 18 }}
                  alignItems="center"
                >
                  <FullWidthContainer item>
                    <UserBadge
                      size={35}
                      address={nft.token.creators[0]}
                      short={true}
                    />
                  </FullWidthContainer>
                  <Grid item>
                    <ImgContainer>
                      <NFT
                        qmHash={nft.token.artifact_hash}
                        mimeType={nft.token.preferredFormat}
                        name={nft.token.name}
                      />
                    </ImgContainer>
                  </Grid>
                  <FullWidthContainer item>
                    <NFTId color="textPrimary">
                      {nft.token.symbol} #{nft.token.token_id}
                    </NFTId>
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
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => onClick(e, nft.token)}
                    >
                      Propose Transfer
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
        </Grid>
      </Grid>
      <NFTDialog
        open={!!selectedNFT}
        onClose={onCloseDialog}
        nft={(selectedNFT as NFTDAOHolding)?.token}
      />
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={1}
      />
    </>
  );
};