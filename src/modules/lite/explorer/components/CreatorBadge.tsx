import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import { toShortAddress } from "services/contracts/utils"

export const CreatorBadge: React.FC<{ address: string | undefined }> = ({ address }) => {
  return (
    <Grid container style={{ gap: 15 }}>
      <Grid item>
        <Typography color="textPrimary" variant="subtitle2">
          by
        </Typography>
      </Grid>
      <Grid item>
        <Grid container style={{ gap: 9 }}>
          <Blockie address={address || ""} size={27} />
          <Typography color="textPrimary" variant="subtitle2">
            {toShortAddress(address || "")}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
