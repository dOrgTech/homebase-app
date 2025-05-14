import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React, { useEffect, useState } from "react"
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"
import { CopyAddress } from "modules/common/CopyAddress"
import { CopyButton } from "modules/common/CopyButton"

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  width: "inherit",
  [theme.breakpoints.down("sm")]: {}
}))

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 0,
    paddingLeft: "16px !important",
    textAlign: "end"
  }
}))

const CustomTableCellValue = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: 0,
    paddingRight: "16px !important",
    textAlign: "end",
    paddingBottom: 0
  }
}))

const RowValue = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))

export const EvmDaoSummary = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { data } = useEvmDaoCreateStore()
  const [tableData, setTableData] = useState<{ key: string; value: string }[]>([
    { key: "Name", value: data?.name },
    { key: "Symbol", value: data?.governanceToken?.symbol },
    {
      key: "Total Members",
      value: data?.members.length
    },
    {
      key: "Total Supply",
      value: data?.members.reduce(
        (acc: number, member: { amountOfTokens: number }) => Number(acc) + Number(member.amountOfTokens),
        0
      )
    },
    {
      key: "Quorum",
      value: `${data?.quorum?.returnedTokenPercentage}%`
    }
  ])

  useEffect(() => {
    const rEntries = Object.entries(data.registry)
    if (rEntries.length > 0) {
      setTableData(prev => {
        rEntries.forEach(([key, value]) => {
          prev.push({
            key: key as string,
            value: value as string
          })
        })
        console.log("[TableData]", prev)
        return prev
      })
    }
  }, [data, tableData])

  return (
    <div className="evm-dao-summary">
      <TitleBlock
        title="DAO Summary"
        description={
          <DescriptionText variant="subtitle1">These settings will define the summary for your DAO.</DescriptionText>
        }
      />
      <div className="summary-content">
        <CustomTableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {tableData.map((item: { key: string; value: string }) => (
                <TableRow key={item.key}>
                  <CustomTableCell component="th" scope="row">
                    <Typography style={{ color: "white", textAlign: "left" }}>{item.key}</Typography>
                  </CustomTableCell>
                  <CustomTableCellValue align="right">
                    {typeof item.value === "string" && item?.value?.startsWith("0x") ? (
                      <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                        {isMobileSmall ? (
                          <CopyAddress address={item.value} />
                        ) : (
                          <>
                            <Grid
                              container
                              style={{ color: "white" }}
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              {item.value}
                              <CopyButton text={item.value} />
                            </Grid>
                          </>
                        )}
                      </RowValue>
                    ) : (
                      <RowValue style={isMobileSmall ? { width: "max-content" } : { color: "white" }}>
                        {item.value}
                      </RowValue>
                    )}
                  </CustomTableCellValue>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CustomTableContainer>
      </div>
    </div>
  )
}
