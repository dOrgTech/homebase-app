import {
  styled,
  Grid,
  Theme,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { createTheme } from '@material-ui/core/styles';
import React from "react";

const SectionNames = styled(Grid)(({ theme }: { theme: Theme }) => ({
      width: "55%",

  ["@media (max-width:1030px)"]: { 
    width: "50%"
  },

  ["@media (max-width:960px)"]: { 
    width: "99%",
    
  },
}));

const Container = styled(Grid)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.primary.main,
  minHeight: 138,
  wordBreak: "break-all",
  borderRadius: 8,
  boxSizing: "border-box",
  padding: 32,
  cursor: "pointer",
  transition: "0.15s ease-out",
  
  ["@media (max-width:1335px)"]: { 
    minHeight: 130,

  },

  ["@media (max-width:1155px)"]: { 
    minHeight: 123,

  },

  ["@media (max-width:1030px)"]: { 
  
  },

  ["@media (max-width:960px)"]: { 
    minHeight: 210

  },

  ["@media (max-width:760px)"]: { 
    maxWidth: "86vw"

  },

  "&:hover": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in",
  },
}));

const SymbolText = styled(Typography)({
  fontSize: "18px",
  fontWeight: 300,

  ["@media (max-width:1335px)"]: { 
    fontSize: "16px",
  },
});

const NameText = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  overflow: "hidden",
  fontSize: "32px",

  ["@media (max-width:1335px)"]: { 
    fontSize: "29px",
  },

  ["@media (max-width:1155px)"]: { 
    fontSize: "26px",
  },

  ["@media (max-width:1030px)"]: { 
    
  },

  ["@media (max-width:960px)"]: { 
    fontSize: "28px",
    marginBottom: "10px"
    
  },
}));

const NumberText = styled(Typography)({
  fontSize: "28px",
  fontWeight: 300,

  ["@media (max-width:1335px)"]: { 
    fontSize: "26px",
    lineHeight: 1.2,
    borderBottom: "7px solid transparent",
  },

  ["@media (max-width:1155px)"]: { 
    fontSize: "23px",
    borderBottom: "9.5px solid transparent"
  },

  ["@media (max-width:960px)"]: { 
    fontSize: "26px",
    borderBottom: "6px solid transparent"
  },
});

const VotingAddressesText = styled(Typography)({
  fontSize: "19px",
  fontWeight: 300,

  ["@media (max-width:1335px)"]: { 
    fontSize: "17px",

  },

  ["@media (max-width:1155px)"]: { 
    fontSize: "15.7px",
  },

  ["@media (max-width:960px)"]: { 
    fontSize: "17px"
  },
});
  

export const DAOItem: React.FC<{
  dao: {
    id: string;
    name: string;
    symbol: string;
    votingAddresses: string[];
  };
}> = ({ dao }) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  
  return (
    <Link underline="none" href={`dao/${dao.id}`} id={`dao-${dao.id}`}>
      <Container container justifyContent="space-between">
        <SectionNames>
        <Grid>
          <SymbolText id="dao-symbol" color="secondary">{dao.symbol.toUpperCase()}</SymbolText>
          <NameText id="dao-name" color="textPrimary">{dao.name}</NameText>
          </Grid>
        </SectionNames>
        <Grid>
        <Grid item xs={12} sm>
          <NumberText color="textPrimary">
              {dao.votingAddresses.length}
          </NumberText>
          
          <VotingAddressesText color="textPrimary">
            Voting Addresses
          </VotingAddressesText>
          </Grid>
        </Grid>
      </Container>
    </Link>
  );
};
