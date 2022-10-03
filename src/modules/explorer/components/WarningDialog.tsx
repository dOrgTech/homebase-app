import React, { useState } from "react"
import { styled, Grid, Typography, Checkbox, FormControlLabel, Link } from "@material-ui/core"
import { SendButton } from "./ProposalFormSendButton"
import { ResponsiveDialog } from "./ResponsiveDialog"

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "300px !important"
  }
})

const TableHeader = styled(Grid)({
  padding: "25px 64px"
})

const Footer = styled(Grid)({
  padding: "15px 64px"
})

export const WarningDialog: React.FC<{
  open: boolean
  handleClose: () => void
}> = ({ open, handleClose }) => {
  const [checked, setChecked] = useState(false)

  return (
    <CustomDialog open={open} onClose={handleClose} title={"DISCLAIMER"}>
      <TableHeader container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary">
            Homebase is currently experimental and its underlying smart contracts remain in testing.
            <br />
            <br />
            Expect breaking changes in coming releases. For more on Homebase, read{" "}
            <Link
              href="https://github.com/dOrgTech/homebase-app"
              rel="noreferrer noopener"
              target="_blank"
              color="secondary"
            >
              here
            </Link>
          </Typography>
        </Grid>
      </TableHeader>
      <Footer>
        <FormControlLabel
          color="secondary"
          control={<Checkbox checked={checked} onChange={event => setChecked(event.target.checked)} name="checkedA" />}
          label="I understand"
        />
      </Footer>
      <SendButton disabled={!checked} onClick={handleClose}>
        CONFIRM
      </SendButton>
    </CustomDialog>
  )
}
