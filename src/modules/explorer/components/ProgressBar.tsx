import { styled, LinearProgress, Theme } from "@material-ui/core";

export const ProgressBar = styled(LinearProgress)(
  ({
    theme,
    favor,
    against,
  }: {
    theme: Theme;
    favor: boolean;
    against?: boolean;
  }) => ({
    marginTop: 10,
    "&.MuiLinearProgress-colorSecondary, &.MuiLinearProgress-colorPrimary": {
      background:
        !favor && !against
          ? theme.palette.secondary.main
          : (!favor && against) || (favor && against)
          ? "#3D3D3D"
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
