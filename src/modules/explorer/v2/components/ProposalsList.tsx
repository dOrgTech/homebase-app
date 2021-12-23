import { Collapse, Grid, IconButton, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { ProposalItem } from "modules/explorer/v2/pages/User";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Proposal } from "services/indexer/dao/mappers/proposal/types";
import { ContentContainer } from "./ContentContainer";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const TableHeader = styled(Grid)({
  minHeight: 76,
  padding: "24px 54px",
});

const ProposalsFooter = styled(Grid)({
  borderTop: `0.3px solid #5E6969`,
  minHeight: 60,
});

interface Props {
  currentLevel: number;
  proposals: Proposal[];
  title: string;
  showFooter?: boolean;
  rightItem?: (proposal: Proposal) => React.ReactElement;
}

export const ProposalsList: React.FC<Props> = ({
  currentLevel,
  proposals,
  title,
  showFooter,
  rightItem,
}) => {
  const [open, setopen] = useState(true);

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"}>
        <TableHeader item container justifyContent="space-between">
          <Grid item>
            <Typography variant="body1" color="textPrimary">
              {title}
            </Typography>
          </Grid>
          {proposals.length ? (
            <Grid item>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setopen(!open)}
              >
                {open ? (
                  <KeyboardArrowUpIcon htmlColor="#FFF" />
                ) : (
                  <KeyboardArrowDownIcon htmlColor="#FFF" />
                )}
              </IconButton>
            </Grid>
          ) : null}
        </TableHeader>
        {proposals.length ? (
            <Grid
              item
              container
              component={Collapse}
              in={open}
              timeout="auto"
              unmountOnExit
              direction="column"
            >
              {proposals.map((p, i) => (
                <Grid item key={`proposal-${i}`}>
                  <Link to={`proposal/${p.id}`}>
                    <ProposalItem
                      proposal={p}
                      status={p.getStatus(currentLevel).status}
                    >
                      {rightItem ? rightItem(p) : null}
                    </ProposalItem>
                  </Link>
                </Grid>
              ))}
            </Grid>
        ) : (
          <ProposalsFooter
            item
            container
            direction="column"
            justifyContent="center"
          >
            <Grid item>
              <Typography color="textPrimary" align="center">
                No items
              </Typography>
            </Grid>
          </ProposalsFooter>
        )}
        {showFooter && (
          <ProposalsFooter
            item
            container
            direction="column"
            justifyContent="center"
          >
            <Grid item>
              <Link to="proposals">
                <Typography color="secondary" align="center">
                  View All Proposals
                </Typography>
              </Link>
            </Grid>
          </ProposalsFooter>
        )}
      </Grid>
    </TableContainer>
  );
};
