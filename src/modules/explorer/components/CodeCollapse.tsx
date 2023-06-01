import { Collapse, Grid, IconButton, styled, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { ProposalCodeEditorInput } from "./ProposalFormInput"
import Prism, { highlight } from "prismjs"

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const TableHeader = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  borderTop: ".6px solid rgba(125,140,139, 0.2)",
  minHeight: 34
})

interface Props {
  code: string
}

export const CodeCollapse: React.FC<Props> = ({ code }) => {
  const [open, setopen] = useState(false)

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"}>
        <TableHeader item container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" style={{ fontWeight: "500" }} color="textPrimary">
              View Lambda Parameter Code
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-label="expand row" size="small" onClick={() => setopen(!open)}>
              {open ? <KeyboardArrowUpIcon htmlColor="#FFF" /> : <KeyboardArrowDownIcon htmlColor="#FFF" />}
            </IconButton>
          </Grid>
        </TableHeader>
        <Grid
          item
          container
          wrap={"nowrap"}
          component={Collapse}
          in={open}
          timeout="auto"
          unmountOnExit
          direction="column"
        >
          <ProposalCodeEditorInput
            label=""
            containerstyle={{ marginTop: "8px" }}
            insertSpaces
            ignoreTabKey={false}
            tabSize={4}
            padding={10}
            style={{
              minHeight: 500,
              fontFamily: "Roboto Mono",
              fontSize: 14,
              fontWeight: 400,
              outlineWidth: 0
            }}
            value={code}
            onValueChange={code => true}
            highlight={code => highlight(code, Prism.languages.javascript, "javascript")}
            title={""}
          />
        </Grid>
      </Grid>
    </TableContainer>
  )
}
