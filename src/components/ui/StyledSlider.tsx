import { Grid, Paper, Slider, styled, Typography, withStyles, withTheme } from "@material-ui/core"
import { useRef } from "react"

const StyledSlider = withStyles({
  root: {
    textAlign: "center",
    width: "100%",
    height: 4.5
  },
  valueLabel: {
    textAlign: "center"
  },
  thumb: {
    height: 20,
    width: 20,
    top: "36.5%",
    backgroundColor: "#fff",
    border: "3px solid #fff"
  },
  track: {
    backgroundColor: "#4BCF93",
    borderRadius: "4px",
    height: 4.5
  },
  rail: {
    height: 4.5
  }
})(Slider)

export const CustomSliderValue = styled(withTheme(Paper))(props => ({
  boxShadow: "none",
  height: 54,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#2F3438",
  borderRadius: 8,
  width: "100%"
}))

export const StyledSliderWithValue = ({
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1
}: {
  defaultValue: number
  onChange: (newValue: any) => void
  min?: number
  max?: number
  step?: number
}) => {
  const sliderValueRef = useRef<HTMLSpanElement>(null)
  const debounceTimeout = useRef<NodeJS.Timeout>()
  const safeMin = typeof min === "number" ? min : 0
  const safeMax = typeof max === "number" ? max : 100
  const initialValue = Math.max(safeMin, Math.min(safeMax, Number.isFinite(defaultValue) ? defaultValue : 0))
  return (
    <Grid container direction="row" alignItems="center" style={{ marginTop: 8, paddingLeft: 6 }}>
      <Grid item xs={8} sm={10}>
        <StyledSlider
          defaultValue={initialValue}
          min={safeMin}
          max={safeMax}
          step={step}
          onChange={(value: any, newValue: any) => {
            if (sliderValueRef.current) {
              sliderValueRef.current.innerHTML = `${newValue}%`
            }
            clearTimeout(debounceTimeout.current)
            debounceTimeout.current = setTimeout(() => {
              onChange(newValue)
            }, 100)
          }}
        />
      </Grid>
      <Grid item xs={4} sm={2} container direction="row" justifyContent="flex-end">
        <CustomSliderValue>
          <Typography
            ref={sliderValueRef}
            variant="subtitle1"
            id="slider-value"
            color="textSecondary"
            style={{ padding: "15%", textAlign: "center" }}
          >
            {initialValue}%
          </Typography>
        </CustomSliderValue>
      </Grid>
    </Grid>
  )
}

export default StyledSlider
