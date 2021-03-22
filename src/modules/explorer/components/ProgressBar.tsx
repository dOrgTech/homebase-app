import { styled, LinearProgress, Theme } from "@material-ui/core";

export const ProgressBar = styled(LinearProgress)(
  ({ theme, favor }: { theme: Theme; favor: boolean }) => ({
    marginTop: 10,
    "&.MuiLinearProgress-colorSecondary, &.MuiLinearProgress-colorPrimary": {
      background: favor
        ? theme.palette.secondary.main
        : theme.palette.error.main,
      color: favor ? theme.palette.secondary.main : theme.palette.error.main,
      "& .MuiLinearProgress-bar": {
        backgroundColor: `${
          favor ? theme.palette.secondary.main : theme.palette.error.main
        } !important`,
      },
    },
  })
);
