import React, { useEffect, useState } from "react"
import { AccordionDetails, AccordionSummary, Grid, Typography } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { styled } from "@material-ui/core/styles"
import { ContentContainer } from "../explorer/components/ContentContainer"
import Accordion from "@material-ui/core/Accordion"
import Markdown from "modules/common/Markdown"
import { useLocation } from "react-router-dom"

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const AccordionHeader = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 40,
  padding: "20px 38px",
  background: theme.palette.primary.main,
  borderRadius: "8px"
}))

const AccordionContent = styled(AccordionDetails)(({ theme }) => ({
  flexDirection: "column",
  padding: "38px 38px",
  background: theme.palette.primary.light,
  borderRadius: "0 0 8px 8px"
}))

export const FAQItem = ({ question, answer, id }: { question: string; answer: string; id: string }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.hash === "#" + id) {
      setOpen(true)
    }
  }, [location, id])

  useEffect(() => {
    if (location.hash === "#" + id) {
      setOpen(true)
      const element = document.getElementById(`${id}`)
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <TableContainer id={id}>
      <Grid container direction="column" wrap="nowrap">
        <Accordion style={{ background: "transparent" }} expanded={open}>
          <AccordionHeader
            onClick={() => setOpen(!open)}
            expandIcon={<ExpandMoreIcon style={{ fill: "rgb(65, 72, 77)" }} />}
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
  )
}
