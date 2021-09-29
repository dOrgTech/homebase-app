import {
  Box,
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { TemplateHeader } from "../components/TemplateHeader";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { useDAOID } from "../daoRouter";
import { UserBadge } from "../components/UserBadge";
import { NFT } from "../components/NFT";
import { NFTDialog } from "../components/NFTDialog";
import { NFTDAOHolding } from "services/bakingBad/tokenBalances";
import {
  ProposalFormContainer,
  ProposalFormDefaultValues,
} from "../components/ProposalForm";
import { useTezos } from "services/beacon/hooks/useTezos";
import { NFT as NFTModel } from "models/Token";

const Card = styled(Grid)({
  boxSizing: "border-box",
  padding: 30,
  border: `2px solid #3D3D3D`,
  borderRadius: 8,
  width: 352,
  minHeight: 518,
  cursor: "pointer",
});

const CardsContainer = styled(Grid)({
  padding: "52px 8%",
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
      <Grid item xs>
        <TemplateHeader template="NFT Treasury" />
        <CardsContainer
          container
          justifyContent={isMobileSmall ? "center" : "flex-start"}
          style={{ gap: 29.5 }}
        >
          {nftHoldings.map((nft, i) => (
            <Card
              key={`nft-${i}`}
              item
              container
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
                        mimeType={nft.token.formats[0].mimeType}
                        name={nft.token.name}
                      />
                    </ImgContainer>
                  </Grid>
                  <FullWidthContainer item>
                    <NFTId color="textSecondary">
                      {nft.token.symbol} #{nft.token.token_id}
                    </NFTId>
                  </FullWidthContainer>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="column" style={{ gap: 20 }}>
                  <Grid item>
                    <NFTTitle color="textSecondary" variant="h4">
                      {nft.token.name}
                    </NFTTitle>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => onClick(e, nft.token)}
                    >
                      Propose Transfer
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          ))}
        </CardsContainer>
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
