import {
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Theme,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import hexToRgba from "hex-to-rgba";
import React, { useState } from "react";
import { NFT } from "./NFT";
import { UserBadge } from "./UserBadge";
import { NFT as NFTModel } from "models/Token";
import { ProposalFormContainer, ProposalFormDefaultValues } from "./ProposalForm";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ResponsiveDialog } from "../v2/components/ResponsiveDialog";

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiPaper-root": {
    width: 1010,
    height: 822,
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

const Content = styled(DialogContent)({
  boxSizing: "border-box",
  padding: "29px 85px 68px 85px",
});

const TitleText = styled(Typography)({
  fontSize: 26,
  fontWeight: 500,
  marginBottom: 12,
});

const SubtitleText = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 12,
});

const Tag = styled(Grid)(({ theme }: { theme: Theme }) => ({
  boxSizing: "border-box",
  padding: 6,
  background: hexToRgba(theme.palette.secondary.main, 0.15),
  borderRadius: 4,
}));

const NFTContainer = styled(Grid)({
  maxWidth: 458,
  maxHeight: 415,
});

const CloseButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
}));

interface Props {
  nft: NFTModel | undefined;
  open: boolean;
  onClose: () => void;
}

export const NFTDialog: React.FC<Props> = ({ nft, onClose, open }) => {
  const [openTransfer, setOpenTransfer] = useState(false)
  const { account } = useTezos()
  const [defaultValues, setDefaultValues] = useState<ProposalFormDefaultValues>()
  
  const onOpenTransferModal = (nft: NFTModel) => {
    setDefaultValues({
      nftTransferForm: {
        transfers: [{
          recipient: account,
          amount: 1,
          asset: nft
        }]
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

  return (
    <>
      <CustomDialog
        onClose={onClose}
        open={open}
      >
        {nft && (
          <>
            <DialogTitle>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <CloseButton onClick={() => (onClose as () => void)()}>
                    <CloseIcon htmlColor="#FFF" />
                  </CloseButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <Content>
              <Grid container direction="column" style={{ gap: 32 }}>
                <Grid item>
                  <Grid container justifyContent="space-between" style={{ gap: 32 }}>
                    <NFTContainer item>
                      <NFT
                        qmHash={nft.artifact_hash}
                        name={nft.name}
                        mimeType={nft.formats[0].mimeType}
                      />
                    </NFTContainer>
                    <Grid item>
                      <Grid container direction="column" style={{ gap: 26 }}>
                        <Grid item>
                          <TitleText color="textPrimary">
                            {nft.name}
                          </TitleText>
                          <Typography color="textPrimary" variant="body1">
                            {nft.symbol}#{nft.token_id} •{" "}
                            {nft.formats[0].mimeType}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textPrimary" variant="body1">
                            {nft.description}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="secondary" onClick={(e) => onClick(e, nft)}>
                            PROPOSE TRANSFER
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <SubtitleText color="textPrimary" variant="body1">
                    Creator
                  </SubtitleText>
                  <UserBadge address={nft.creators[0]} size={35} />
                </Grid>
                <Grid item>
                  <SubtitleText color="textPrimary" variant="body1">
                    Tags
                  </SubtitleText>
                  <Grid container style={{ gap: 12 }}>
                    {nft.tags.map((tag, i) => (
                      <Grid item key={`tag-${i}`}>
                        <Tag color="secondary">
                          <Typography color="secondary">
                            {tag.toUpperCase()}
                          </Typography>
                        </Tag>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Content>
          </>
        )}
      </CustomDialog>
      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={1}
      />
    </>
  );
};
