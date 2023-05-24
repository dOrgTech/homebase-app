import React, { useMemo } from "react"
import {
  Grid,
  styled,
  Typography,
  useTheme,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  makeStyles,
  Button
} from "@material-ui/core"

import { ProgressBar } from "modules/explorer/components/ProgressBar"
import { useVotesStats } from "../hooks/useVotesStats"
import { VotersProgress } from "./VotersProgress"
import { AppTabBar } from "./AppTabBar"
import { TabPanel } from "./TabPanel"
import { BigNumber } from "bignumber.js"
import { useProposal } from "services/services/dao/hooks/useProposal"
import { UserBadge } from "./UserBadge"
import { ResponsiveDialog } from "./ResponsiveDialog"

interface UpVotesDialogData {
  daoAddress: string
  proposalAddress: string
  favor: boolean
}

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer"
})

const Title = styled(DialogTitle)({
  height: 30,
  paddingBottom: 0,
  minWidth: 250
})

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
    maxHeight: 600
  }
})

const StyledViewButton = styled(Button)({
  marginTop: -30
})

const TextHeader = styled(Typography)({
  marginTop: 10,
  marginBottom: 10
})

const Row = styled(Grid)(({ theme }) => ({
  "padding": "33px 64px",
  "borderTop": `2px solid ${theme.palette.primary.light}`,
  "paddingBottom": 0,
  "display": "flex",
  "alignItems": "end",
  "&:last-child": {
    marginBottom: 30,
    borderBottom: `2px solid ${theme.palette.primary.light}`
  },
  [theme.breakpoints.down("sm")]: {
    padding: "20px 34px"
  }
}))

const TableHeader = styled(Grid)(({ theme }) => ({
  padding: "23px 64px",
  [theme.breakpoints.down("sm")]: {
    padding: "23px 24px"
  }
}))

const LinearBar = styled(ProgressBar)({
  marginBottom: "-3px",
  marginTop: 30
})

const NoTokens = styled(Grid)(({ theme }) => ({
  padding: "33px 64px",
  borderTop: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 34px"
  }
}))

const styles = makeStyles({
  root: {
    "borderRadius": "4px 4px 0px 0px",
    "maxWidth": 135,
    "marginRight": 10,
    "background": "#3D3D3D",
    "&:before": {
      opacity: 0.5
    }
  },
  selected: {
    "background": "rgba(124, 255, 181, 0.15)",
    "&:before": {
      opacity: 0.15
    }
  }
})

const Header = styled(Grid)(({ theme }) => ({
  padding: "20px 64px",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 34px"
  }
}))

export const UpVotesDialog: React.FC<UpVotesDialogData> = ({ daoAddress, proposalAddress, favor }) => {
  const [open, setOpen] = React.useState(false)

  const { data: proposal, isLoading } = useProposal(daoAddress, proposalAddress)
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = React.useState(0)
  const style = styles()
  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const votesData = proposal?.voters

  const { votesSum } = useVotesStats({
    quorumThreshold,
    upVotes: proposal?.upVotes || new BigNumber(0),
    downVotes: proposal?.downVotes || new BigNumber(0)
  })

  const votes = useMemo(() => {
    if (!votesData) {
      return []
    }

    if (selectedTab === 0) {
      return votesData
    }

    if (selectedTab === 1) {
      return votesData.filter(voteData => voteData.support)
    }

    if (selectedTab === 2) {
      return votesData.filter(voteData => !voteData.support)
    }
  }, [votesData, selectedTab])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <StyledViewButton variant="contained" size="small" color="secondary" onClick={handleClickOpen}>
        VIEW
      </StyledViewButton>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={12}>
              <CloseButton color="textSecondary" align="right" onClick={handleClose}>
                X
              </CloseButton>
            </Grid>
          </Grid>
        </Title>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TableHeader container direction="row" alignItems="center">
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: favor ? theme.palette.secondary.main : theme.palette.error.main
                  }}
                >
                  VOTES{" "}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextHeader variant="h3" color="textSecondary">
                  {proposal ? votesSum.toString() : "-"}
                </TextHeader>
                <VotersProgress wrapAll={true} showButton={false} daoId={daoAddress} proposalId={proposalAddress} />
              </Grid>
            </TableHeader>

            <AppTabBar
              class1={style}
              value={selectedTab}
              setValue={setSelectedTab}
              labels={["ALL", "SUPPORT", "OPPOSE"]}
              centered={true}
            />

            <TabPanel value={selectedTab} index={0}></TabPanel>

            {isLoading ? (
              <>
                <Grid container direction="row" justifyContent="center">
                  <CircularProgress color="secondary" />
                </Grid>
              </>
            ) : votes && votes.length > 0 ? (
              <>
                <Header container direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {votes.length} {votes.length !== 1 ? " addresses" : " address"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end">
                    <Typography variant="subtitle1" color="textSecondary">
                      Votes
                    </Typography>
                  </Grid>
                </Header>

                {votes.map((vote, index) => {
                  return (
                    <Row container direction="row" alignItems="center" key={index}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          <UserBadge address={vote.address} />
                        </Typography>
                        <LinearBar
                          color="secondary"
                          variant="determinate"
                          favor={vote.support}
                          value={votesSum ? vote.value.div(votesSum).multipliedBy(100).toNumber() : 0}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary" align="right">
                          {proposal ? vote.value.toString() : "-"}
                        </Typography>
                      </Grid>
                    </Row>
                  )
                })}
              </>
            ) : (
              <NoTokens container direction="row" alignItems="center">
                <Grid item xs={12}>
                  <Typography>No votes</Typography>
                </Grid>
              </NoTokens>
            )}
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  )
}
