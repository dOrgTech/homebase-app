import {
  Box,
  Grid,
  Link,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { TemplateTableRowContainer } from "modules/explorer/components/TemplateTableRowContainer";
import { useDAOID } from "modules/explorer/daoRouter";
import React from "react";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { IPFS_GATEWAY_URI } from "services/ipfs";
import { ProposalTableHeadText } from "./TableHeader";

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
  wordBreak: "break-all",
});

const Thumbnail = styled(Box)({
  width: 150,
  height: 150,
  "& > img": {
    width: "100%",
    height: "100%",
  },
});

export const NFTTable: React.FC = () => {
  const daoId = useDAOID();
  const { nftHoldings } = useDAOHoldings(daoId);
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <ResponsiveGenericTable>
        {!isMobileSmall && (
          <TableHeader item container wrap="nowrap" id="demo">
            <Grid item xs={2}>
              <ProposalTableHeadText align={"left"}>NFTs</ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText align={"center"}>
                PREVIEW
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={4}>
              <ProposalTableHeadText align={"center"}>
                DESCRIPTION
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={4}>
              <ProposalTableHeadText align={"center"}>
                AUTHORS
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>
        )}
        {nftHoldings && nftHoldings.length
          ? nftHoldings.map((holding, i) => (
              <GenericTableContainer key={`holding-${i}`}>
                <TemplateTableRowContainer
                  container
                  direction={isMobileSmall ? "column" : "row"}
                  alignItems="center"
                >
                  <Grid item sm={2}>
                    <TokenName>
                      {" "}
                      <Cursor variant="subtitle1" color="textSecondary">
                        {holding.token.name}
                      </Cursor>
                    </TokenName>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    container
                    direction="row"
                    alignItems="center"
                    justify={isMobileSmall ? "space-evenly" : "center"}
                  >
                    <Link
                      href={`${IPFS_GATEWAY_URI}/${holding.token.artifact_hash}`}
                      rel="noopener"
                      target="_blank"
                    >
                      <Thumbnail>
                        <img
                          src={`${IPFS_GATEWAY_URI}/${holding.token.artifact_hash}`}
                          alt={`${holding.token.name}-thumbnail`}
                        />
                      </Thumbnail>
                    </Link>
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    container
                    direction="row"
                    alignItems="center"
                    justify={isMobileSmall ? "space-evenly" : "center"}
                  >
                    {isMobileSmall ? (
                      <Typography variant="subtitle1" color="textSecondary">
                        DESCRIPTION{" "}
                      </Typography>
                    ) : null}
                    <Cursor
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      {holding.token.description || " - "}
                    </Cursor>
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    container
                    direction="row"
                    alignItems="center"
                    justify={isMobileSmall ? "space-evenly" : "center"}
                  >
                    {isMobileSmall ? (
                      <Typography variant="subtitle1" color="textSecondary">
                        CREATORS{" "}
                      </Typography>
                    ) : null}
                    <Cursor
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      {holding.token.creators.join(", ")}
                    </Cursor>
                  </Grid>
                </TemplateTableRowContainer>
              </GenericTableContainer>
            ))
          : null}
      </ResponsiveGenericTable>
    </>
  );
};
