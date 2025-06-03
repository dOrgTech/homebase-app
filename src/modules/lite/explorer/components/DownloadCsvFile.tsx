import React, { useEffect, useState } from "react"
import { Button, Typography } from "@material-ui/core"
import DownloadCSVIcon from "assets/img/download_csv.svg?react"
import { Choice } from "models/Choice"
import { mkConfig, generateCsv, download } from "export-to-csv"
import { useNotification } from "modules/lite/components/hooks/useNotification"
import BigNumber from "bignumber.js"
import { bytes2Char } from "@taquito/utils"
import dayjs from "dayjs"

interface GroupedVotes {
  address: string
  options: any[]
}

type DownloadCsvFileProps = {
  data: GroupedVotes[]
  pollId: string | undefined
  symbol: string
  decimals: string
  isXTZ: boolean
}

export const DownloadCsvFile: React.FC<DownloadCsvFileProps> = ({ data, pollId, symbol, decimals, isXTZ }) => {
  const [votesDetails, setVotesDetails] = useState<any>()
  const openNotification = useNotification()
  useEffect(() => {
    const getTotal = (options: any) => {
      let total = new BigNumber(0)
      if (options) {
        options.map((item: any) => {
          total = total.plus(new BigNumber(item.balance))
        })
      }
      const formatted = total.div(new BigNumber(10).pow(isXTZ ? 6 : decimals))
      return formatted
    }
    const arr: any = []

    data.map(item => {
      const formattedVote = {
        address: item.address,
        choices: item.options.map(item => item.name),
        balance: getTotal(item.options),
        signature: item.options[0].signature,
        ipfsStorage: item.options[0].cidLink,
        timestamp:
          item.options[0] && item.options[0].payloadBytes ? bytes2Char(item.options[0].payloadBytes).split(" ")[4] : ""
      }
      return arr.push(formattedVote)
    })
    setVotesDetails(arr)
  }, [data, decimals, isXTZ])

  const downloadCvs = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `proposal-${pollId}`,
      showTitle: false
    })

    const votesData = votesDetails.map((row: any) => {
      return {
        "Address": row.address,
        "Choice": row.choices.toLocaleString().replace(",", ", "),
        "Token": symbol,
        "Vote Weight": row.balance,
        "Signature": row.signature,
        "IPFS Storage Link": row.ipfsStorage,
        "Timestamp": dayjs(row.timestamp).format("LLL").toString()
      }
    })
    try {
      const csv = generateCsv(csvConfig)(votesData)
      download(csvConfig)(csv)
    } catch (error) {
      openNotification({
        message: `Error downloading csv file`,
        autoHideDuration: 3000,
        variant: "error"
      })
    }
  }

  return (
    <Button>
      <DownloadCSVIcon style={{ marginRight: 8 }} />
      <Typography color="secondary" onClick={downloadCvs}>
        {" "}
        Download CSV
      </Typography>
    </Button>
  )
}
