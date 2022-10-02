import React from "react"
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import dayjs from "dayjs"
import { OverflowCell } from "./OverflowCell"
import { useAgoraTopic } from "services/agora/hooks/useTopic"
import { toShortAddress } from "services/contracts/utils"
import { ContentContainer } from "modules/explorer/components/ContentContainer"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const titles = ["Update History", "Proposal Title", "Last Updated", "Proposal"]

interface RowData {
  key: string
  lastUpdated: string
  proposalId: string
  agoraPostId: number
}

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})

const ProposalTitle: React.FC<{ agoraPostId: number; proposalId: string }> = ({ agoraPostId, proposalId }) => {
  const { data: agoraPost } = useAgoraTopic(agoraPostId)

  return <>{agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposalId)}`}</>
}

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const MobileUpdatesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          Update History
        </Typography>
      </MobileTableHeader>
      {data.map((row, i) => (
        <MobileTableRow
          key={`usersMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          style={{ gap: 19 }}
        >
          <Grid item>
            <Typography variant="h6" color="secondary" align="center">
              Proposal Key
            </Typography>
            <Typography variant="h6" color="textPrimary" align="center">
              {row.key}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="secondary" align="center">
              Proposal Title
            </Typography>
            <Typography variant="h6" color="textPrimary" align="center">
              <ProposalTitle proposalId={row.proposalId} agoraPostId={row.agoraPostId} />
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="secondary" align="center">
              Last Updated
            </Typography>
            <Typography variant="h6" color="textPrimary" align="center">
              {row.lastUpdated}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="secondary" align="center">
              Proposal
            </Typography>
            <Typography variant="h6" color="textPrimary" align="center">
              {row.agoraPostId}
            </Typography>
          </Grid>
        </MobileTableRow>
      ))}
    </Grid>
  )
}

const DesktopUpdatesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`updatestitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={`updatesrow-${i}`}>
              <OverflowCell>{row.key.toUpperCase()}</OverflowCell>
              <OverflowCell>
                <ProposalTitle proposalId={row.proposalId} agoraPostId={row.agoraPostId} />
              </OverflowCell>
              <TableCell>{dayjs(row.lastUpdated).format("L")}</TableCell>
              <OverflowCell>{row.proposalId}</OverflowCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export const UpdatesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <TableContainer item>
      {isSmall ? <MobileUpdatesTable data={data} /> : <DesktopUpdatesTable data={data} />}
    </TableContainer>
  )
}
