import React, { useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { Grid, TextField, Typography, MenuItem, useMediaQuery, useTheme } from "@material-ui/core"
import { SendButton } from "./ProposalFormSendButton"
import Select, { SelectChangeEvent } from "@mui/material/Select"

interface EthContractCallFormProps {
  open: boolean
  handleClose: () => void
}

// TODO: @ashutoshpw to be fixed by ashutoshpw
const EthChangeConfigProposalForm: React.FC<EthContractCallFormProps> = ({ open, handleClose }) => {
  const [configType, setConfigType] = useState("quorums")
  const [offChainResources, setOffChainResources] = useState("")

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <ResponsiveDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      title={"Change Config Proposal"}
      template="xs"
    >
      <Grid item xs={12} style={{ marginBottom: "20px", textAlign: "center" }}>
        <Select
          defaultValue="quorums"
          style={{ color: "#fff", border: "1px solid #ccc", height: "40px", minWidth: "100px" }}
          onChange={(e: SelectChangeEvent<string>) => {
            setConfigType(e.target.value)
          }}
        >
          <MenuItem value="quorums">QUORUMS</MenuItem>
          <MenuItem value="durations">DURATIONS</MenuItem>
        </Select>
      </Grid>

      {configType === "quorums" ? (
        <>
          <Grid container direction="row">
            <Grid item xs={isMobileSmall ? 12 : 8}>
              <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
                style={{ height: "100%" }}
              >
                <Typography>Participation percentage required for transfers and contract calls</Typography>
              </Grid>
            </Grid>
            <Grid item xs={isMobileSmall ? 12 : 4}>
              <TextField
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setOffChainResources(e.target.value)
                }}
                type="number"
                InputProps={{ disableUnderline: true }}
                placeholder="%"
                style={{ border: "1px solid #ccc", width: "70px", borderRadius: 4 }}
              />
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Grid item xs={isMobileSmall ? 12 : 8}>
              <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
                style={{ height: "100%" }}
              >
                <Typography>Participation percentage required for change config proposals</Typography>
              </Grid>
            </Grid>
            <Grid item xs={isMobileSmall ? 12 : 4}>
              <TextField
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setOffChainResources(e.target.value)
                }}
                type="number"
                InputProps={{ disableUnderline: true }}
                placeholder="%"
                style={{ border: "1px solid #ccc", width: "70px", borderRadius: 4 }}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container direction="row">
            <Typography>Coming Soon</Typography>
          </Grid>
        </>
      )}

      <Grid container direction="row" justifyContent="center">
        <SendButton onClick={() => {}}>Submit</SendButton>
      </Grid>
    </ResponsiveDialog>
  )
}

export default EthChangeConfigProposalForm
