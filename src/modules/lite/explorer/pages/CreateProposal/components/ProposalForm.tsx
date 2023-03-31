import React from "react"
import { Grid, TextField, styled, Container } from "@mui/material"
import BackButton from "modules/common/BackButton"
import { Choices } from "../../../components/Choices"

const ProposalContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("md")]: {
    marginTop: 30
  }
}))

const ProposalChoices = styled(Grid)({
  flexGrow: 1,
  minHeight: 250
})

export const ProposalForm = () => {
  return (
    <Container>
      <Grid container mx={2} my={3}>
        <BackButton />
      </Grid>
      <Grid container>
        <ProposalContainer container flexDirection="column" style={{ gap: 30 }} xs={12} md={6} lg={8}>
          <Grid item>
            <TextField placeholder="Proposal Title" />
          </Grid>
          <Grid item>
            <TextField placeholder="Proposal Details" multiline minRows={15} maxRows={Infinity} />
          </Grid>
        </ProposalContainer>
        <ProposalContainer container flexDirection="column" style={{ gap: 30 }} item xs={12} md={6} lg={4}>
          <Grid item>
            <TextField placeholder="Proposal Title" />
          </Grid>
          <Grid item>
            <TextField placeholder="Proposal Title" />
          </Grid>
          <ProposalChoices>
            <Choices />
          </ProposalChoices>
        </ProposalContainer>
      </Grid>
    </Container>
  )
}
