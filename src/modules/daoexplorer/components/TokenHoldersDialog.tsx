import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, LinearProgress, styled, Typography } from "@material-ui/core";
import { useTokenHolders } from "../../../services/contracts/baseDAO/hooks/useTokenHolders";

interface TokenHolderDialogData {
  address: string;
}

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)({
  height: 30,
  paddingBottom: 0,
  minWidth: 500,
});

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
  },
});

const ViewButton = styled(Typography)({
  cursor: "pointer",
  marginTop: -30,
});

const TextHeader = styled(Typography)({
  fontWeight: "bold",
});

const Row = styled(Grid)({
  padding: "33px 64px",
  borderTop: "2px solid #3D3D3D",
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
  "&:last-child": {
    marginBottom: 30,
    borderBottom: "2px solid #3D3D3D",
  },
});

const TableHeader = styled(Grid)({
  padding: "33px 64px",
});

const LinearBar = styled(LinearProgress)({
  marginBottom: "-3px",
  marginTop: 30,
});

const TokenHolders = [
  {
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
    tokens: 2248,
  },
  {
    address: "fz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6T",
    tokens: 2248,
  },
  {
    address: "ro1bQgEea45ciBpYdFj4y4P3hNyDM8aMF7P",
    tokens: 2248,
  },
];

export const TokenHoldersDialog: React.FC<TokenHolderDialogData> = ({
  address,
}) => {
  // const { data } = useTokenHolders(address);
  const [open, setOpen] = React.useState(false);
  // console.log(data);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ViewButton
        variant="subtitle1"
        color="secondary"
        onClick={handleClickOpen}
      >
        VIEW
      </ViewButton>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={12}>
              <CloseButton
                color="textSecondary"
                align="right"
                onClick={handleClose}
              >
                X
              </CloseButton>
            </Grid>
          </Grid>
        </Title>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TableHeader container direction="row" alignItems="center">
              <Grid item xs={6}>
                <TextHeader variant="subtitle1" color="textSecondary">
                  TOKEN HOLDER
                </TextHeader>
              </Grid>
              <Grid item xs={6}>
                <TextHeader
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  TOKENS
                </TextHeader>
              </Grid>
            </TableHeader>

            {TokenHolders.map((holder: any, index: any) => {
              return (
                <Row container direction="row" alignItems="center" key={index}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {holder.address.slice(0, 6)}...
                      {holder.address.slice(
                        holder.address.length - 4,
                        holder.address.length
                      )}
                    </Typography>
                    <LinearBar
                      color="secondary"
                      variant="determinate"
                      value={100}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      {holder.tokens}
                    </Typography>
                  </Grid>
                </Row>
              );
            })}
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
