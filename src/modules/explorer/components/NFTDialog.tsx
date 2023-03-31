import { Button, Grid, styled, Theme, Tooltip, Typography } from "@material-ui/core"
import hexToRgba from "hex-to-rgba"
import React, { useState } from "react"
import { NFT } from "./NFT"
import { UserBadge } from "./UserBadge"
import { NFT as NFTModel } from "models/Token"
import { ProposalFormContainer, ProposalFormDefaultValues } from "./ProposalForm"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useIsProposalButtonDisabled } from "../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { InfoIcon } from "./styled/InfoIcon"
import { useDAOID } from "../pages/DAO/router"

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiPaper-root": {
    width: 1010,
    height: 822,
    maxWidth: "100%",
    maxHeight: "100%"
  }
})

const TitleText = styled(Typography)({
  fontSize: 26,
  fontWeight: 500,
  marginBottom: 12
})

const SubtitleText = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 12
})

const Tag = styled(Grid)(({ theme }: { theme: Theme }) => ({
  boxSizing: "border-box",
  padding: 6,
  background: hexToRgba(theme.palette.secondary.main, 0.15),
  borderRadius: 4
}))

const NFTContainer = styled(Grid)({
  maxWidth: 458,
  maxHeight: 415
})

// const CloseButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
//   color: theme.palette.text.secondary,
// }));

interface Props {
  nft: NFTModel | undefined
  open: boolean
  onClose: () => void
}

export const NFTDialog: React.FC<Props> = ({ nft, onClose, open }) => {
  const [openTransfer, setOpenTransfer] = useState(false)
  const { account } = useTezos()
  const [defaultValues, setDefaultValues] = useState<ProposalFormDefaultValues>()

  const onOpenTransferModal = (nft: NFTModel) => {
    setDefaultValues({
      nftTransferForm: {
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

  const daoId = useDAOID()
  const shouldDisable = useIsProposalButtonDisabled(daoId)

  return (
    <>
      <CustomDialog onClose={onClose} open={open}>
        {nft && (
          <>
            {/*<DialogTitle>*/}
            {/*  <Grid container justifyContent="flex-end">*/}
            {/*    <Grid item>*/}
            {/*      <CloseButton onClick={() => (onClose as () => void)()}>*/}
            {/*        <CloseIcon htmlColor="#FFF" />*/}
            {/*      </CloseButton>*/}
            {/*    </Grid>*/}
            {/*  </Grid>*/}
            {/*</DialogTitle>*/}
            <Grid container direction="column" style={{ gap: 32 }}>
              <Grid item>
                <Grid container justifyContent="space-between" style={{ gap: 32 }}>
                  <NFTContainer item>
                    <NFT qmHash={nft.artifact_hash} name={nft.name} mediaType={nft.mediaType} />
                  </NFTContainer>
                  <Grid item>
                    <Grid container direction="column" style={{ gap: 26 }}>
                      <Grid item>
                        <TitleText color="textPrimary">{nft.name}</TitleText>
                        <Typography color="textPrimary" variant="body1">
                          {nft.symbol}#{nft.token_id} • {nft.preferredFormat}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="textPrimary" variant="body1">
                          {nft.description}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={e => onClick(e, nft)}
                          disabled={shouldDisable}
                        >
                          PROPOSE TRANSFER
                        </Button>
                        {shouldDisable && (
                          <Tooltip placement="bottom" title="Not on proposal creation period">
                            <InfoIcon color="secondary" />
                          </Tooltip>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <SubtitleText color="textPrimary" variant="body1">
                  Creators
                </SubtitleText>
                {nft.creators.length ? (
                  nft.creators.map((creator, i) => <UserBadge key={`creator-${i}`} address={creator} size={35} />)
                ) : (
                  <Typography color={"textPrimary"} variant={"body1"}>
                    Unknown
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <SubtitleText color="textPrimary" variant="body1">
                  Tags
                </SubtitleText>
                <Grid container style={{ gap: 12 }}>
                  {nft.tags.map((tag, i) => (
                    <Grid item key={`tag-${i}`}>
                      <Tag color="secondary">
                        <Typography color="secondary">{tag.toUpperCase()}</Typography>
                      </Tag>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
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
  )
}
