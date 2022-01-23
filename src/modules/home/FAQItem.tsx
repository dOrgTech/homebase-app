import React, {useState} from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {Collapse, Grid, IconButton, Typography} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {styled} from "@material-ui/styles";
import {ContentContainer} from "../explorer/components/ContentContainer";

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const TableHeader = styled(Grid)({
  minHeight: 76,
  padding: "24px 54px",
});

export const FAQItem = ({question, answer}: { question: string; answer: string; }) => {
  const [open, setopen] = useState(false);

  return (<TableContainer item>
    <Grid container direction="column" wrap={"nowrap"}>
      <TableHeader item container justifyContent="space-between">
        <Grid item>
          <Typography variant="body1" color="textPrimary">
            {question}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setopen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon htmlColor="#FFF"/>
            ) : (
              <KeyboardArrowDownIcon htmlColor="#FFF"/>
            )}
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
        <Grid item>
          <ReactMarkdown components={{
            p: (props) => <Typography variant={"body1"} color={"textPrimary"}>{props}</Typography>
          }} remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
        </Grid>
      </Grid>
    </Grid>
  </TableContainer>)
}