import { styled, LinearProgress, Theme } from "@material-ui/core";

export const ProgressBar = styled(LinearProgress)(
  ({ theme, favor }: { theme: Theme; favor: boolean }) => ({
    marginTop: 10,
    "&.MuiLinearProgress-colorSecondary, &.MuiLinearProgress-colorPrimary": {
      background: "#3D3D3D",
      color: favor ? theme.palette.secondary.main : "#ED254E",
      "& .MuiLinearProgress-bar": {
        backgroundColor: `${
          favor ? theme.palette.secondary.main : "#ED254E"
        } !important`,
      },
    },
  })
);
