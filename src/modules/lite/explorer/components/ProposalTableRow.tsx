import React from "react"
import { styled, Grid, Typography, useTheme, useMediaQuery, LinearProgress } from "@material-ui/core"
import { RowContainer } from "./tables/RowContainer"
import { ProposalStatus, TableStatusBadge } from "./ProposalTableRowStatusBadge"
import { useHistory } from "react-router"
import { Poll } from "models/Polls"
import ReactHtmlParser from "react-html-parser"
import dayjs from "dayjs"
export interface ProposalTableRowData {
  daoId?: string
  id: string
}

const ArrowInfo = styled(Typography)(({ theme }) => ({
  fontFamily: "Roboto Flex",
  fontWeight: 300,
  fontSize: 16,
  color: "#bfc5ca",
  [theme.breakpoints.down("xs")]: {
    marginTop: 5
  }
}))

const Title = styled(Typography)({
  fontWeight: 600,
  fontSize: 18
})

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  width: "inherit",
  color: "#BFC5CA",
  wordBreak: "break-word",
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

export const ProposalTableRow: React.FC<{ poll: Poll | any; daoId?: string }> = ({ poll, daoId }) => {
  const navigate = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <RowContainer
      style={{ background: "#2F3438", borderRadius: 8 }}
      item
      container
      alignItems="baseline"
      onClick={() =>
        navigate.push(`/explorer/lite/dao/${poll.daoID}/community/proposal/${poll._id}`, { poll: poll, daoId: daoId })
      }
    >
      <Grid container item style={{ gap: 16 }} xs={12} md={12} justifyContent={isMobile ? "center" : "flex-start"}>
        <Title color="textPrimary" align={isMobile ? "center" : "left"}>
          {poll.name}
        </Title>

        <Grid container direction="row">
          <DescriptionText>{ReactHtmlParser(poll.description)}</DescriptionText>
        </Grid>

        <Grid
          container
          direction={isMobile ? "column" : "row"}
          alignItems={isMobileSmall ? "center" : "center"}
          wrap="nowrap"
          style={{ gap: 18 }}
        >
          <TableStatusBadge status={poll.isActive || ProposalStatus.ACTIVE} />
          <ArrowInfo color="textPrimary">{poll.timeFormatted}</ArrowInfo>
          {poll.isActive === ProposalStatus.ACTIVE ? (
            <ArrowInfo> • &nbsp; Created {dayjs(poll.startTime).format("LL")}</ArrowInfo>
          ) : null}
        </Grid>
      </Grid>
    </RowContainer>
  )
}
