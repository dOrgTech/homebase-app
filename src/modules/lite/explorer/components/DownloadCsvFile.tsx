import React, { useEffect, useState } from "react"
import { Button, Typography } from "@material-ui/core"
import { ReactComponent as DownloadCSVIcon } from "assets/img/download_csv.svg"
import { Choice } from "models/Choice"
import { mkConfig, generateCsv, download } from "export-to-csv"
import { useNotification } from "modules/lite/components/hooks/useNotification"

type DownloadCsvFileProps = {
  data: Choice[]
  pollId: string | undefined
  symbol: string
}

export const DownloadCsvFile: React.FC<DownloadCsvFileProps> = ({ data, pollId, symbol }) => {
  const [votesDetails, setVotesDetails] = useState<any>()
  const openNotification = useNotification()

  useEffect(() => {
    const arr: any = []
    data.map(item => {
      item.walletAddresses.map(vote => {
        const formattedVote = {
          address: vote.address,
          choice: item.name,
          balance: vote.balanceAtReferenceBlock,
          signature: vote.signature,
          ipfsStorage: vote.cidLink
        }
        return arr.push(formattedVote)
      })
    })
    setVotesDetails(arr)
  }, [data])

  const downloadCvs = () => {
    console.log(votesDetails)
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `proposal-${pollId}`,
      showTitle: false
    })

    const votesData = votesDetails.map((row: any) => {
      return {
        "Address": row.address,
        "Choice": row.choice,
        "Token": symbol,
        "Vote Weight": row.balance,
        "Signature": row.signature,
        "IPFS Storage Link": row.ipfsStorage
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
