import React from "react";
import {
  styled,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import { toShortAddress } from "services/contracts/utils";
import { RowContainer } from "../tables/RowContainer";

export interface TokenHoldersRowData {
  username: string;
  votes: string;
  weight: string;
  proposals_voted: number;
  index: number;
}

const Username = styled(Typography)({
  marginLeft: 15,
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
  weight,
  proposals_voted,
  index,
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <RowContainer item container alignItems="center" justify="center">
      <Row item container alignItems="center" justify="center">
        <Grid item xs={12} md={5}>
          <Grid container direction="row" alignItems="center">
            {!isMobileSmall && (
              <Grid item md={2}>
                <Typography variant="body1" color="textSecondary">
                  {index + 1}
                </Typography>
              </Grid>
            )}

            <Grid item md={9}>
              <Grid container direction="row" alignItems="center" wrap="nowrap">
                <Blockie address={username} size={40} />
                <Username variant="body1" color="textSecondary">
                  {toShortAddress(username)}
                </Username>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <TextContainer item xs={12} md={3} container>
          <Title variant="body1" color="textSecondary">
            VOTES:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {votes}
          </Typography>
        </TextContainer>
        <TextContainer item xs={12} md={2} container>
          <Title variant="body1" color="textSecondary">
            WEIGHT:{" "}
          </Title>
          <Typography variant="body1" color="textSecondary">
            {weight}
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
