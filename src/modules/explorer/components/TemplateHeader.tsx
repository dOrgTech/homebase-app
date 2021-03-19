import React from "react";
import {
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

const Container = styled(Grid)((props) => ({
  background: props.theme.palette.primary.main,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
}));

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

const CustomRectangleContainer = styled(RectangleContainer)({
  borderBottom: "none",
  paddingBottom: "0",
});

export const TemplateHeader: React.FC<{
  template: DAOTemplate;
}> = ({ template, children }) => {
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: dao } = useDAO(id);

  return (
    <Grid item xs={12}>
      <CustomRectangleContainer container justify="space-between">
        <Grid item xs={12}>
          <Container container direction="row">
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="secondary">
                {dao?.metadata.unfrozenToken.name}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {template.toUpperCase()}
              </Typography>
            </Grid>
            <JustifyEndGrid
              item
              xs={12}
              sm={6}
              container
              justify={isMobileExtraSmall ? "flex-start" : "flex-end"}
            >
              {children}
            </JustifyEndGrid>
          </Container>
          {dao && <CopyAddress address={dao.address} />}
        </Grid>
      </CustomRectangleContainer>
    </Grid>
  );
};
