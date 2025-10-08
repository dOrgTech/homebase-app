import React from "react"
import { Grid, Typography, styled } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import { toShortAddress } from "services/contracts/utils"

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light
}))
export const CreatorBadge: React.FC<{ address: string | undefined }> = ({ address }) => {
  return (
    <Grid container wrap="nowrap" alignItems="center" style={{ gap: 15, width: "auto", display: "inline-flex" }}>
      <Grid item>
        <Grid container style={{ gap: 9 }} alignItems="center">
          <Blockie address={address || ""} size={27} />
          <Text variant="subtitle2">{toShortAddress(address || "")}</Text>
        </Grid>
      </Grid>
    </Grid>
  )
}
