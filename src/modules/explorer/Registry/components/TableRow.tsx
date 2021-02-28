import React, { useState } from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import { MoreHorizOutlined } from "@material-ui/icons";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  height: 83,
}));

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  minWidth: 146,
  width: "fit-content",
  height: 26,
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const CustomIcon = styled(MoreHorizOutlined)({
  background: "#3866F9",
  borderRadius: 4,
  paddingLeft: 4,
  paddingRight: 4,
  color: "#fff",
  maxHeight: 22,
  cursor: "pointer",
  fill: "#fff",
  width: 41,
});

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

const ActionButton = styled(Paper)((props) => ({
  width: 114,
  background: props.theme.palette.primary.main,
  border: "2px solid #81FEB7",
  borderRadius: 4,
  padding: 2,
  cursor: "pointer",
  textAlign: "center",
  "&:first-child": {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  "&:last-child": {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTop: 0,
  },
}));

const ActionButtonText = styled(Typography)({
  fontWeight: "bold",
});

export const RegistryTableRow: React.FC<any> = ({
  name,
  operationId,
  setShowDialog,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Container
      container
      direction="row"
      alignItems="center"
      justify="space-between"
      onMouseLeave={() => {
        setShowOptions(false);
      }}
    >
      <Grid item xs={7}>
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {name}
          </Cursor>
        </TokenName>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="row" justify="center">
          <Cursor variant="subtitle1" color="textSecondary">
            #{operationId}
          </Cursor>
        </Grid>
      </Grid>
      <Grid xs={2} item>
        {!showOptions ? (
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <CustomIcon onClick={() => setShowOptions(true)} />
          </Grid>
        ) : (
          <Grid
            container
            direction="column"
            justify="flex-end"
            alignItems="flex-end"
          >
            <ActionButton>
              <ActionButtonText
                variant="body1"
                color="textSecondary"
                onClick={() => setShowDialog(true)}
              >
                ADD
              </ActionButtonText>
            </ActionButton>
            <ActionButton>
              <ActionButtonText
                variant="body1"
                color="textSecondary"
                onClick={() => setShowDialog(true)}
              >
                REMOVE
              </ActionButtonText>
            </ActionButton>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
