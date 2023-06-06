import React, { useState } from "react"
import { Button, Fade, Grid, styled, Popper, useTheme, useMediaQuery } from "@material-ui/core"
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons"
import { StatusBadge } from "./StatusBadge"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

interface Option {
  name: ProposalStatus | "All"
  value: ProposalStatus | "all"
}
const options: Option[] = [
  { name: "All", value: "all" },
  { name: ProposalStatus.ACTIVE, value: ProposalStatus.ACTIVE },
  { name: ProposalStatus.DROPPED, value: ProposalStatus.DROPPED },
  { name: ProposalStatus.EXECUTABLE, value: ProposalStatus.EXECUTABLE },
  { name: ProposalStatus.EXECUTED, value: ProposalStatus.EXECUTED },
  { name: ProposalStatus.EXPIRED, value: ProposalStatus.EXPIRED },
  { name: ProposalStatus.NO_QUORUM, value: ProposalStatus.NO_QUORUM },
  { name: ProposalStatus.PASSED, value: ProposalStatus.PASSED },
  { name: ProposalStatus.PENDING, value: ProposalStatus.PENDING },
  { name: ProposalStatus.REJECTED, value: ProposalStatus.REJECTED }
]

const CustomBadge = styled(StatusBadge)({
  width: "fit-content !important",
  cursor: "pointer",
  minWidth: 80
})

const CustomBadgeText = styled(StatusBadge)({
  width: "fit-content !important",
  cursor: "pointer",
  minWidth: "fit-content",
  paddingRight: 13,
  paddingLeft: 13
})

const CustomBox = styled(Grid)({
  background: "#383E43",
  borderRadius: 8,
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  padding: "20px 40px",
  width: 308,
  gap: 12
})

const CustomButtom = styled(Button)({
  minWidth: 24
})

export const ProposalFilter: React.FC<{ filterProposalByStatus: any }> = ({ filterProposalByStatus }) => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [state, setState] = useState<ProposalStatus | "all">("all")
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(previousOpen => !previousOpen)
  }

  const selectOption = (option: any) => {
    setState(option.value)
    setOpen(false)
    filterProposalByStatus(option.value)
  }
  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? "transition-popper" : undefined

  return (
    <Grid
      container
      direction="row"
      item
      xs={isMobileSmall ? 12 : 5}
      justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
      alignItems="center"
    >
      <CustomBadgeText status={state}></CustomBadgeText>
      <CustomButtom aria-describedby={id} type="button" onClick={handleClick}>
        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </CustomButtom>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <CustomBox container>
              {options.map((option, index) => {
                return <CustomBadge key={index} status={option.value} onClick={() => selectOption(option)} />
              })}
            </CustomBox>
          </Fade>
        )}
      </Popper>
    </Grid>
  )
}
