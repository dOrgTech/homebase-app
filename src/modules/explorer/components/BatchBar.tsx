import React from "react"
import { Grid, Paper, styled, Switch, Typography } from "@material-ui/core"
import { ProposalFormInput } from "./ProposalFormInput"

const BatchBarContainer = styled(Grid)(({ theme }) => ({
  height: 47,
  alignItems: "start",
  cursor: "pointer",
  overflowX: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 24px"
  }
}))

const SwitchContainer = styled(Grid)({
  "textAlign": "end",
  "boxShadow": "none",

  "& .Mui-checked.Mui-checked + .MuiSwitch-track": {
    background: "#81FEB7"
  },

  "& .MuiSwitch-colorSecondary.Mui-checked": {
    color: "#FFFFFF",
    marginLeft: "4.1px"
  },

  "& .MuiSwitch-thumb": {
    boxShadow: "none"
  }
})

const TransferActive = styled(Grid)({
  height: 27,
  minWidth: 27,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%"
})

const AddButton = styled(Paper)({
  "marginLeft": 12,
  "minHeight": 31,
  "minWidth": 31,
  "textAlign": "center",
  "padding": 0,
  "background": "inherit",
  "color": "rgb(129, 254, 183)",
  "alignItems": "center",
  "display": "flex",
  "justifyContent": "center",
  "cursor": "pointer",
  "boxShadow": "none",
  "&:hover": {
    background: "#3c4349"
  }
})

interface Props {
  isBatch: boolean
  stateIsBatch: boolean
  handleIsBatchChange: () => void
  onClickAdd: () => void
  items: any[]
  activeItem: number
  setActiveItem: (index: number) => void
}

export const BatchBar = ({ isBatch, handleIsBatchChange, onClickAdd, items, activeItem, setActiveItem }: Props) => {
  return (
    <Grid>
      <Grid container direction="row" alignItems={"center"}>
        <Grid item xs={6}>
          <Typography variant="body1" color="textPrimary">
            Batch Transfer?
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <SwitchContainer item xs={12} justifyContent="flex-end">
            <Switch type="checkbox" onChange={handleIsBatchChange} checked={isBatch} />
          </SwitchContainer>
        </Grid>
      </Grid>
      {isBatch ? (
        <BatchBarContainer container direction="row" wrap="nowrap" style={{ gap: 8 }}>
          {items.map((_, index) => {
            return (
              <TransferActive
                item
                key={index}
                onClick={() => setActiveItem(index)}
                style={Number(index + 1) === activeItem ? { background: "#81FEB7" } : { background: "inherit" }}
              >
                <Typography
                  variant="subtitle2"
                  style={
                    Number(index + 1) === activeItem
                      ? { color: "#1C1F23", fontWeight: 500 }
                      : { color: "#fff", opacity: 0.65, fontWeight: 500 }
                  }
                >
                  {index + 1}
                </Typography>
              </TransferActive>
            )
          })}

          <AddButton onClick={onClickAdd}>+</AddButton>
        </BatchBarContainer>
      ) : null}
    </Grid>
  )
}
