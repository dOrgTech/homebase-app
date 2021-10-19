import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import dayjs from "dayjs";
import { OverflowCell } from "./OverflowCell";
import { useAgoraTopic } from "services/agora/hooks/useTopic";
import { toShortAddress } from "services/contracts/utils";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const titles = ["Update History", "Proposal Title", "Last Updated", "Proposal"];

interface RowData {
  key: string;
  lastUpdated: string;
  proposalId: string;
  agoraPostId: number;
}

const ProposalTitleCell: React.FC<{ agoraPostId: number; proposalId: string }> =
  ({ agoraPostId, proposalId }) => {
    const { data: agoraPost } = useAgoraTopic(agoraPostId);

    return (
      <OverflowCell>
        {agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposalId)}`}
      </OverflowCell>
    );
  };

export const UpdatesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`updatestitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={`updatesrow-${i}`}>
              <OverflowCell>{row.key.toUpperCase()}</OverflowCell>
              <ProposalTitleCell proposalId={row.proposalId} agoraPostId={row.agoraPostId} />
              <TableCell>{dayjs(row.lastUpdated).format("L")}</TableCell>
              <OverflowCell>{row.proposalId}</OverflowCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
