import { Grid, Table, TableBody, TableCell, TableRow, Typography, IconButton } from "components/ui"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { CopyButton } from "modules/common/CopyButton"

interface ProposalDataItem {
  parameter: string
  value: string
}

interface ProposalDataSectionProps {
  proposalData?: ProposalDataItem[]
}

export const ProposalDataSection = ({ proposalData }: ProposalDataSectionProps) => {
  if (!proposalData || proposalData.length === 0) {
    return null
  }

  return (
    <ContentContainer style={{ gap: 10, color: "white", padding: 40 }}>
      <Grid container>
        <Typography style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Proposal Data</Typography>
      </Grid>
      <Grid container>
        {proposalData.map(({ parameter, value }: ProposalDataItem, idx: number) => {
          console.log("callDataXYB", { parameter, value })
          const textValue = value?.length > 64 ? value.slice(0, 8) + "..." + value.slice(-4) : value
          return (
            <Grid key={idx}>
              <Table
                aria-label="simple table"
                style={{ background: "#222222", borderRadius: 8, border: "1px solid #555555", marginTop: "20px" }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography style={{ color: "white" }}>Parameter</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography style={{ color: "white" }}>{parameter}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography style={{ color: "white" }}>Value</Typography>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography style={{ color: "white" }}>{textValue}</Typography>
                        <IconButton
                          onClick={() => navigator.clipboard.writeText(value)}
                          style={{ marginLeft: 8, padding: 4 }}
                        >
                          <CopyButton text={value} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          )
        })}
      </Grid>
    </ContentContainer>
  )
}
