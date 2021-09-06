import React, { useState } from "react";
import {
  Button,
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import { TemplateTableRowContainer } from "modules/explorer/components/TemplateTableRowContainer";
import { BigNumber } from "bignumber.js";
import { RegistryProposalFormContainer } from "modules/explorer/components/ProposalForm/registryProposalForm";
import { TreasuryProposalFormContainer } from "modules/explorer/components/ProposalForm/treasuryProposalForm";
import { useDAOID } from "modules/explorer/daoRouter";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  minWidth: 119,
  width: "fit-content",
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

export const TreasuryTableRow: React.FC<{
  symbol: string;
  balance: BigNumber;
  decimals: number;
}> = ({ symbol, balance }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNewProposal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <TemplateTableRowContainer
        container
        justify="space-between"
        direction={isMobileSmall ? "column" : "row"}
        alignItems="center"
      >
        <Grid item sm={3}>
          <TokenName>
            {" "}
            <Cursor variant="subtitle1" color="textSecondary">
              {symbol}
            </Cursor>
          </TokenName>
        </Grid>
        <Grid item xs={3} />
        <Grid
          item
          sm={3}
          container
          direction="row"
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-start"}
        >
          {isMobileSmall ? (
            <Typography variant="subtitle1" color="textSecondary">
              BALANCE{" "}
            </Typography>
          ) : null}
          <Cursor variant="subtitle1" color="textSecondary" align="left">
            {balance.dp(10).toString()}
          </Cursor>
        </Grid>

        <Grid
          item
          sm={1}
          container
          direction="row"
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-end"}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleNewProposal}
          >
            TRANSFER
          </Button>
        </Grid>
      </TemplateTableRowContainer>
      {dao ? (
        dao.data.type === "registry" ? (
          <RegistryProposalFormContainer
            open={open}
            handleClose={handleCloseModal}
          />
        ) : (
          <TreasuryProposalFormContainer
            open={open}
            handleClose={handleCloseModal}
          />
        )
      ) : null}
    </>
  );
};
