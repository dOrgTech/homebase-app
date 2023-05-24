import React, { createContext, useContext, useEffect, useState } from "react"
import { styled, Grid, Typography, useTheme, useMediaQuery, LinearProgress } from "@material-ui/core"
import { RowContainer } from "./tables/RowContainer"
import { ProposalStatus, TableStatusBadge } from "./ProposalTableRowStatusBadge"
import { useHistory } from "react-router"
import { Blockie } from "modules/common/Blockie"
import { toShortAddress } from "services/contracts/utils"
import { Choice } from "models/Choice"
import { Poll } from "models/Polls"
import { ChoiceDetails } from "./ChoiceDetails"
import { usePollChoices } from "../hooks/usePollChoices"

export interface ProposalTableRowData {
  daoId?: string
  id: string
}

const ArrowInfo = styled(Typography)(({ theme }) => ({
  fontFamily: "Roboto Mono",
  fontWeight: 500,
  fontSize: 16,
  [theme.breakpoints.down("xs")]: {
    marginTop: 5
  }
}))

const Address = styled(Typography)({
  marginLeft: 12
})

const BlockieContainer = styled(Grid)({
  marginBottom: 19
})

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  marginBottom: 25,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

export const ProposalTableRow: React.FC<{ poll: Poll }> = ({ poll }) => {
  const navigate = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const choices = usePollChoices(poll)

  return (
    <RowContainer
      item
      container
      alignItems="center"
      onClick={() => navigate.push(`/explorer/lite/dao/${poll.daoID}/community/proposal/${poll._id}`, { poll: poll })}
    >
      <BlockieContainer container direction="row">
        <Blockie address={"tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB"} size={24} />
        <Address color="textPrimary" variant="subtitle2">
          {toShortAddress(poll.author)}
        </Address>
      </BlockieContainer>
      <Grid container item style={{ gap: 25 }} xs={12} md={12} justifyContent={isMobile ? "center" : "flex-start"}>
        <Typography variant="h4" color="textPrimary" align={isMobile ? "center" : "left"}>
          {poll.name}
        </Typography>

        <Grid
          container
          direction={isMobile ? "column" : "row"}
          alignItems={isMobileSmall ? "center" : "flex-start"}
          wrap="nowrap"
          style={{ gap: 18 }}
        >
          <TableStatusBadge status={poll.isActive || ProposalStatus.ACTIVE} />
          <ArrowInfo color="textPrimary">{poll.timeFormatted}</ArrowInfo>
        </Grid>

        <Grid>
          <DescriptionText color="textPrimary">{poll.description}</DescriptionText>
        </Grid>
      </Grid>

      {choices && choices.length > 0
        ? choices.map((choice: Choice, index: number) => (
            <ChoiceDetails
              key={`'choice-'${choice.name}${index}`}
              poll={poll}
              choice={choice}
              index={index}
            ></ChoiceDetails>
          ))
        : null}
    </RowContainer>
  )
}
