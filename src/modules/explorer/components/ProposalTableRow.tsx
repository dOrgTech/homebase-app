import React, { useCallback } from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import dayjs from "dayjs";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { RowContainer } from "./tables/RowContainer";
import { TableStatusBadge } from "./ProposalTableRowStatusBadge";
import { CheckCircleOutlined, CancelOutlined, ErrorOutlineOutlined } from '@material-ui/icons';
import { ProposalStatus } from "services/bakingBad/proposals/types";

export interface ProposalTableRowData {
  daoId?: string;
  id: string;
}

const ArrowContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
}));

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  marginRight: 30,
});

const ErrorIcon = styled(ErrorOutlineOutlined)(({ theme }) => ({
  color: theme.palette.info.main,
}));

const RowContent = styled(Box)(({ theme }) => ({
  marginTop: 25,
  [theme.breakpoints.down("sm")] : {
    marginTop: 15,
  }
}));

const ArrowInfo = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 15,
  },
}));

export const ProposalTableRow: React.FC<
  ProposalWithStatus & { daoId: string | undefined }
> = ({ daoId, id, startDate, status }) => {
  const history = useHistory();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const formattedDate = dayjs(startDate).format("LL");
  const { data: dao } = useDAO(daoId);
  const onClick = useCallback(() => {
    if (dao) {
      history.push(`/explorer/dao/${daoId}/proposal/${dao.template}/${id}`);
    }
  }, [dao, daoId, history, id]);


  return (
    <RowContainer item container alignItems="center" onClick={onClick}>
      <Grid item xs={12} lg={9} md={6}>
        <Box>
          <Typography
            variant="h4"
            color="textSecondary"
            align={isMobileSmall ? "center" : "left"}
          >
            Proposal Title
          </Typography>
        </Box>
        <RowContent>
          <Grid container direction={isMobileSmall ? "column" : "row"} alignItems={isMobileSmall ? "center" : "flex-start"}>
            <TableStatusBadge  status={status} />
            <ArrowInfo color="textSecondary">{"#43"} • Executed {formattedDate}</ArrowInfo>
          </Grid>
        </RowContent>
      </Grid>
      <ArrowContainer item lg={3} md={6} container direction="row" alignItems="center" justify="flex-end">
        <>
        {status === ProposalStatus.ACTIVE ? <ErrorIcon fontSize={"large"} /> : null} 
        {status === ProposalStatus.PENDING ? <ErrorIcon fontSize={"large"} /> : null} 
        {status === ProposalStatus.PASSED ? <CheckCircleOutlined fontSize={"large"} color="secondary" /> : null} 
        {status === ProposalStatus.EXECUTED ? <CheckCircleOutlined fontSize={"large"} color="secondary" /> : null} 
        {status === ProposalStatus.EXPIRED ? <CancelOutlined fontSize={"large"} color="error" /> : null} 
        {status === ProposalStatus.REJECTED ? <CancelOutlined fontSize={"large"} color="error" /> : null} 
        <StatusText color="textSecondary">{status}</StatusText>
        </>
        <ArrowButton>
          <ArrowForwardIcon fontSize={"large"} color="inherit" />
        </ArrowButton>
      </ArrowContainer>
    </RowContainer>
  );
};
