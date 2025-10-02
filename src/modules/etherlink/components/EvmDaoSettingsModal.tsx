import React, { useContext } from "react"
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"

import { EtherlinkContext } from "services/wagmi/context"
import { CopyButton } from "modules/common/CopyButton"
import { CopyAddress } from "modules/common/CopyAddress"

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

export const EvmDaoSettingModal: React.FC<{
  open: boolean
  handleClose: () => void
}> = ({ open, handleClose }) => {
  const { daoSelected } = useContext(EtherlinkContext)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const tableData = [
    {
      key: "DAO Contract Address",
      value: daoSelected?.address
    },
    {
      key: "Treasury Address",
      value: daoSelected?.registryAddress
    },
    /**
     * Firebase contains two fields: registryAddress and treasuryAddress
     * We need to display the registryAddress as "Treasury Address"
     * and the treasuryAddress is UNKNOWN at the moment
     */
    // {
    //   key: "Registry Address",
    //   value: daoSelected?.registryAddress
    // },
    {
      key: "Governance Token",
      value: daoSelected?.token
    },
    {
      key: "Quorum",
      value: daoSelected?.quorum
    },
    {
      key: "Proposal Threshold",
      value: daoSelected?.proposalThreshold
    },
    {
      key: "Voting Duration (minutes)",
      value: daoSelected?.votingDuration
    },
    {
      key: "Voting Delay (minutes)",
      value: daoSelected?.votingDelay
    },
    {
      key: "Execution Delay (seconds)",
      value: daoSelected?.executionDelay
    }
  ]

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Dao Settings"} template="xs">
        <CustomTableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {daoSelected?.id &&
                tableData.map((item: { key: string; value: string }, index: number) => (
                  <TableRow key={index}>
                    <CustomTableCell component="th" scope="row">
                      <Typography color="textPrimary" variant="body1">
                        {item.key}
                      </Typography>
                    </CustomTableCell>
                    <CustomTableCellValue align="right">
                      {typeof item.value === "string" && item?.value?.startsWith("0x") ? (
                        <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>
                          {isMobileSmall ? (
                            <CopyAddress address={item.value} />
                          ) : (
                            <>
                              <Grid container direction="row" alignItems="center" justifyContent="flex-end">
                                {item.value}
                                <CopyButton text={item.value} />
                              </Grid>
                            </>
                          )}
                        </RowValue>
                      ) : (
                        <RowValue style={isMobileSmall ? { width: "max-content" } : {}}>{item.value}</RowValue>
                      )}
                    </CustomTableCellValue>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CustomTableContainer>
      </ResponsiveDialog>
    </>
  )
}
