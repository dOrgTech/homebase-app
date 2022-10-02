import React from "react"
import { Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from "@material-ui/core"
import { toShortAddress } from "../../../services/contracts/utils"

const titles = ["Address", "Votes"] as const

interface RowData {
  address: string
  votes: string
}

export const VotesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`votestitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={`votesrow-${i}`}>
              <TableCell>{isSmall ? toShortAddress(row.address) : row.address}</TableCell>
              <TableCell>{row.votes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
