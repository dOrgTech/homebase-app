import {
  Box,
  Grid,
  Paper,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../components/Header";
import { MockDAOs } from "../../../mock";
import { MoreHorizOutlined } from "@material-ui/icons";

const Balance = styled(Typography)({
  opacity: 0.8,
});

const Table = styled(Grid)({
  paddingLeft: "6%",
  paddingRight: "6%",
});

const GridBorder = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  paddingBottom: 14,
});

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  height: 83,
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
}));

const ListItem = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  boxSizing: "border-box",
  marginLeft: "6%",
  paddingTop: 20,
  height: 80,
});

const BalanceItem = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  boxSizing: "border-box",
  paddingTop: 20,
  height: 80,
});

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  width: 119,
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const MoreContainer = styled(Grid)({
  maxWidth: "5%",
  borderBottom: "2px solid #3D3D3D",
  boxSizing: "border-box",
  paddingTop: 20,
  height: 80,
  textAlign: "center",
});

export const Treasury: React.FC = () => {
  const history = useHistory<any>();

  const { dao } = history.location.state;

  return (
    <>
      <Header name={dao.name} buttonLabel={"NEW TRANSFER"} />
      <Box
        bgcolor="primary.main"
        width="100%"
        height="100%"
        borderTop="2px solid"
        borderColor="#3D3D3D"
        paddingTop="57px"
        boxSizing="border-box"
      >
        <Table container direction="row" alignItems="center">
          <GridBorder item xs={10}>
            <Typography variant="subtitle1" color="textSecondary">
              TOKEN BALANCES
            </Typography>
          </GridBorder>
          <GridBorder item xs={2}>
            <Balance variant="subtitle1" color="textSecondary">
              BALANCE
            </Balance>
          </GridBorder>
        </Table>

        {MockDAOs.map((dao: any) => {
          return (
            <ListItemContainer
              container
              direction="row"
              alignItems="center"
              key={dao.symbol}
            >
              <ListItem item xs={9}>
                <TokenName>
                  {" "}
                  <Typography variant="subtitle1" color="textSecondary">
                    TOKEN NAME
                  </Typography>
                </TokenName>
              </ListItem>
              <BalanceItem item xs={1}>
                <Typography variant="subtitle1" color="textSecondary">
                  4,330.2
                </Typography>
              </BalanceItem>
              <MoreContainer xs={1} item>
                <MoreHorizOutlined />
              </MoreContainer>
            </ListItemContainer>
          );
        })}
      </Box>
    </>
  );
};
