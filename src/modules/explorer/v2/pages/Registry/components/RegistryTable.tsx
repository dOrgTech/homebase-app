import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import dayjs from "dayjs";
import { RegistryItemDialog } from "modules/explorer/Registry/components/ItemDialog";
import { OverflowCell } from "./OverflowCell";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const titles = ["Registry Items", "Value", "Last Updated"];

interface RowData {
  key: string;
  value: string;
  lastUpdated?: string;
  onClick: () => void;
}

export const RegistryTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<RowData>()
  const [open, setOpen] = useState(false);

  const onClickItem = (row: RowData) => {
    setSelectedItem(row)
    setOpen(true)
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`registrytitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={`registryrow-${i}`}
              onClick={() => onClickItem(row)}
            >
              <TableCell>
                {row.key.toUpperCase()}
              </TableCell>
              <OverflowCell>{row.value}</OverflowCell>
              <TableCell>{row.lastUpdated? dayjs(row.lastUpdated).format("L"): "-"}</TableCell>
              <TableCell align="right">
                <Button variant="contained" color="secondary" onClick={(e) => {
                  e.stopPropagation()
                  row.onClick()
                }}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RegistryItemDialog
        item={selectedItem || { key: "", value: "" }}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </>
  );
};
