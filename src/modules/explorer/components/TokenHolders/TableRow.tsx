import React from "react";
import {
  styled,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { toShortAddress } from "services/contracts/utils";
import { RowContainer } from "../tables/RowContainer";
import { useProfileClaim } from "services/tzprofiles/hooks/useProfileClaim";
import { ProfileAvatar } from "../styled/ProfileAvatar";

export interface TokenHoldersRowData {
  username: string;
  votes: string;
  total_balance: string;
  available_balance: string;
  proposals_voted: number;
  index: number;
}

const Username = styled(Typography)({
  marginLeft: 15,
  wordBreak: "break-all",
});

const Title = styled(Typography)(({ theme }) => ({
  paddingRight: 10,
  fontWeight: "bold",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const Row = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    maxWidth: 200,
    margin: "0 auto",
  },
}));

const TextContainer = styled(Grid)({
  paddingTop: 10,
});

export const TopHoldersTableRow: React.FC<TokenHoldersRowData> = ({
  username,
  votes,
  total_balance,
  available_balance,
  proposals_voted,
  index,
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: profile } = useProfileClaim(username);

  const getDisplayName = () => {
    if (!profile) {
      if (isMobileSmall) {
        return toShortAddress(username);
      }

      return username;
    }

    return profile.credentialSubject.alias;
  };

  const displayName = getDisplayName();

  return (
    <RowContainer item container alignItems="center" justify="center">
      <Row item container alignItems="center" justify="center">
        <Grid item xs={12} md={4}>
          <Grid container direction="row" alignItems="center">
            {!isMobileSmall && (
              <Grid item md={1}>
                <Typography variant="body1" color="textSecondary">
                  {index + 1}
                </Typography>
              </Grid>
            )}

            <Grid item md={10}>
              <Grid container direction="row" alignItems="center" wrap="nowrap">
                <ProfileAvatar address={username} size={40} />
                <Username variant="body1" color="textSecondary">
                  {displayName}
                </Username>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <TextContainer item xs={12} md={2} container>
          <Title variant="body1" color="textSecondary">
            VOTES:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {votes}
          </Typography>
        </TextContainer>
        <TextContainer item xs={12} md={2} container>
          <Title variant="body1" color="textSecondary">
            AVAILABLE STAKED:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {available_balance}
          </Typography>
        </TextContainer>
        <TextContainer item xs={12} md={2} container>
          <Title variant="body1" color="textSecondary">
            TOTAL STAKED:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {total_balance}
          </Typography>
        </TextContainer>
        <TextContainer item xs={12} md={2} container>
          <Title variant="body1" color="textSecondary">
            PROPOSALS VOTED:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {proposals_voted}
          </Typography>
        </TextContainer>
      </Row>
    </RowContainer>
  );
};
