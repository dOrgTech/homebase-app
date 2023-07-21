import { Grid, GridProps, Typography, TypographyProps, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { toShortAddress } from "services/contracts/utils"
import { CopyButton } from "./CopyButton"

interface Props extends GridProps {
  address: string
  typographyProps?: TypographyProps
}

export const CopyAddress: React.FC<Props> = ({ address, typographyProps }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="subtitle2" color="textPrimary" {...typographyProps}>
            {isMobileSmall ? toShortAddress(address) : address}
          </Typography>
        </Grid>
        <Grid item>
          <CopyButton text={address} />
        </Grid>
      </Grid>
    </>
  )
}
