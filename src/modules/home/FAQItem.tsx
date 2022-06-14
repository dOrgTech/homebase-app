import React from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { styled } from "@material-ui/core/styles";
import { ContentContainer } from "../explorer/components/ContentContainer";
import Accordion from "@material-ui/core/Accordion";
import Markdown from "modules/common/Markdown";
const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const AccordionHeader = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 40,
  padding: "20px 38px",
  background: theme.palette.primary.main,
  borderRadius: "8px",
}));

const AccordionContent = styled(AccordionDetails)(({ theme }) => ({
  flexDirection: "column",
  padding: "38px 38px",
  background: theme.palette.primary.light,
  borderRadius: "0 0 8px 8px",
}));

export const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <TableContainer>
      <Grid container direction="column" wrap="nowrap">
        <Accordion style={{background: "transparent"}}>
          <AccordionHeader
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{question}</Typography>
          </AccordionHeader>
          <AccordionContent>
            <Markdown>{answer}</Markdown>
          </AccordionContent>
        </Accordion>
      </Grid>
    </TableContainer>
  );
};
