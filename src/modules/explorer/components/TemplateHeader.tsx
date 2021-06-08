import React from "react";
import {
  Box,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { DAOTemplate } from "modules/creator/state";
import { RectangleContainer } from "./styled/RectangleHeader";
import { CopyAddress } from "modules/common/CopyAddress";
import { useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { SendXTZDialog } from "./SendXTZDialog";

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
}));

const CustomRectangleContainer = styled(RectangleContainer)(({ theme }) => ({
  borderBottom: "none",
  paddingBottom: "0",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 40,
  },
}));

const StyledSendXTZContainer = styled(Box)({
  paddingTop: 10
})

export const TemplateHeader: React.FC<{
  template: DAOTemplate;
}> = ({ template, children }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: dao } = useDAO(id);

  return (
    <Grid item xs={12}>
      <CustomRectangleContainer container justify="space-between">
        <Grid item xs={12}>
          <Container container direction={isMobileSmall ? "column" : "row"}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="secondary"
                align={isMobileSmall ? "center" : "left"}
              >
                {dao?.metadata.unfrozenToken.name}
              </Typography>
              <Typography
                variant="h5"
                color="textSecondary"
                align={isMobileSmall ? "center" : "left"}
                style={{ margin: isMobileSmall ? "15px 0 25px 0" : 0 }}
              >
                {template.charAt(0).toUpperCase() +
                  template.slice(1, template.length)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              container
              justify={isMobileSmall ? "center" : "flex-end"}
            >
              {children}
            </Grid>
          </Container>
          {dao && !isMobileSmall && (
            <CopyAddress
              address={dao.address}
              justify={isMobileSmall ? "center" : "flex-start"}
            />
          )}
          <StyledSendXTZContainer>
            <SendXTZDialog />
          </StyledSendXTZContainer>
          
        </Grid>
      </CustomRectangleContainer>
    </Grid>
  );
};
