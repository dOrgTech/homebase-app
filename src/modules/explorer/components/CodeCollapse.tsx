import React, { useState } from "react"
import { Collapse, Grid, IconButton, Typography } from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { ProposalCodeEditorInput } from "./ProposalFormInput"
import Prism, { highlight } from "prismjs"
import { TableContainer, TableHeader } from "components/ui/Table"

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
              View Function Parameter Code
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
              fontFamily: "Roboto Flex",
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
