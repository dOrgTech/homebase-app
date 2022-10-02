import { Button, ButtonProps, makeStyles, useTheme } from "@material-ui/core"
import React from "react"
import hexToRgba from "hex-to-rgba"

const useButtonStyles = makeStyles({
  root: {
    "color": ({ color }: { color: string }) => color,
    "borderColor": ({ color }: { color: string }) => hexToRgba(color, 0.23),
    "&:hover": {
      backgroundColor: ({ color }: { color: string }) => hexToRgba(color, 0.04),
      borderColor: ({ color }: { color: string }) => color
    },
    "height": 36,
    "borderWidth": 3,
    "borderRadius": 10
  }
})

export type ViewButtonProps = { customColor?: string } & ButtonProps

export const ViewButton: React.FC<ViewButtonProps> = ({ customColor, ...props }) => {
  const theme = useTheme()
  const buttonClasses = useButtonStyles({
    color: customColor || theme.palette.secondary.main
  })
  return <Button classes={buttonClasses} {...props} />
}
