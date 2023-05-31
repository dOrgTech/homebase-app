import React, { useCallback } from "react"
import { styled, Grid, Box, Typography, IconButton, useTheme, useMediaQuery } from "@material-ui/core"
import dayjs from "dayjs"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import { useHistory } from "react-router-dom"
import { RowContainer } from "./tables/RowContainer"
import { TableStatusBadge } from "./ProposalTableRowStatusBadge"
import {
  CheckCircleOutlined,
  CancelOutlined,
  PauseCircleOutline,
  RemoveCircleOutline,
  PlayCircleOutlineOutlined
} from "@material-ui/icons"
import { toShortAddress } from "services/contracts/utils"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useAgoraTopic } from "services/agora/hooks/useTopic"
import { useDAO } from "services/services/dao/hooks/useDAO"

export interface ProposalTableRowData {
  daoId?: string
  id: string
}

const ArrowContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none"
  }
}))

const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light
}))

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  marginRight: 30
})

const RowContent = styled(Box)(({ theme }) => ({
  marginTop: 25,
  [theme.breakpoints.down("sm")]: {
    marginTop: 15
  }
}))

const ArrowInfo = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 15
  }
}))

export const ProposalTableRow: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
  const history = useHistory()
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { cycleInfo } = useDAO(proposal.dao.data.address)

  const formattedDate = dayjs(proposal.startDate).format("LLL")
  const { data: agoraPost } = useAgoraTopic(Number(proposal.metadata.agoraPostId))

  const onClick = useCallback(() => {
    history.push(`/explorer/dao/${proposal.dao.data.address}/proposal/${proposal.id}`)
  }, [history, proposal.dao.data.address, proposal.id])

  return (
    <RowContainer item container alignItems="center" onClick={onClick}>
      <Grid item xs={12} md={9}>
        <Box>
          <Typography variant="h4" color="textSecondary" align={isMobileSmall ? "center" : "left"}>
            {agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposal.id)}`}
          </Typography>
        </Box>
        <RowContent>
          <Grid
            container
            direction={isMobileSmall ? "column" : "row"}
            alignItems={isMobileSmall ? "center" : "flex-start"}
            wrap="nowrap"
            style={{ gap: 32 }}
          >
            {cycleInfo && <TableStatusBadge status={proposal.getStatus(cycleInfo.currentLevel).status} />}

            <ArrowInfo color="textSecondary">Created {formattedDate}</ArrowInfo>
          </Grid>
        </RowContent>
      </Grid>
      <ArrowContainer item md={3} container direction="row" alignItems="center" justifyContent="flex-end">
        <>
          {status === ProposalStatus.ACTIVE ? (
            <PlayCircleOutlineOutlined htmlColor="#FFC839" fontSize={"large"} />
          ) : null}
          {status === ProposalStatus.PENDING ? (
            <PauseCircleOutline htmlColor="rgba(56, 102, 249)" fontSize={"large"} />
          ) : null}
          {status === ProposalStatus.PASSED ? <CheckCircleOutlined fontSize={"large"} color="secondary" /> : null}
          {status === ProposalStatus.NO_QUORUM ? (
            <RemoveCircleOutline fontSize={"large"} htmlColor="rgb(61, 61, 61)" />
          ) : null}
          {status === ProposalStatus.EXECUTED ? <CheckCircleOutlined fontSize={"large"} color="secondary" /> : null}
          {status === ProposalStatus.EXPIRED ? <CancelOutlined fontSize={"large"} htmlColor="rgb(61, 61, 61)" /> : null}
          {status === ProposalStatus.REJECTED ? <CancelOutlined fontSize={"large"} color="error" /> : null}
          {status === ProposalStatus.DROPPED ? <CancelOutlined fontSize={"large"} color="error" /> : null}
          <StatusText color="textSecondary">{status}</StatusText>
        </>
        <ArrowButton>
          <ArrowForwardIcon fontSize={"large"} color="inherit" />
        </ArrowButton>
      </ArrowContainer>
    </RowContainer>
  )
}
