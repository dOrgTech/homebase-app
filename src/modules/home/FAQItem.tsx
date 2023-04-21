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
  height: 91,
  padding: "0px 38px",
  background: theme.palette.primary.main,
  borderRadius: "8px"
}))

const AccordionContent = styled(AccordionDetails)(({ theme }) => ({
  flexDirection: "column",
  padding: "38px 38px",
  background: theme.palette.primary.light,
  borderRadius: "0 0 8px 8px"
}))

const Hash = styled(Typography)({
  marginLeft: 8
})

export const FAQItem = ({ question, answer, id }: { question: string; answer: string; id: string }) => {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState({ display: "none" })

  const location = useLocation()

  const formatQuestion = (question: string) => {
    return question.replaceAll(" ", "-").toLowerCase()
  }
  const questionId = formatQuestion(question)

  useEffect(() => {
    if (location.hash === "#" + questionId) {
      setOpen(true)
      setStyle({ display: "block" })
      return
    }
    setOpen(false)
    setStyle({ display: "none" })
  }, [location, questionId])

  useEffect(() => {
    if (location.hash === "#" + questionId) {
      setOpen(true)
      const element = document.getElementById(`${questionId}`)
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
      setStyle({ display: "block" })
      return
    }
    setOpen(false)
    setStyle({ display: "none" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateLocationHash = () => {
    window.location.hash = "#" + questionId
  }

  return (
    <TableContainer id={questionId}>
      <Grid container direction="column" wrap="nowrap">
        <Accordion style={{ background: "transparent" }} expanded={open}>
          <AccordionHeader
            expandIcon={<ExpandMoreIcon onClick={() => setOpen(!open)} style={{ fill: "rgb(65, 72, 77)" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            onMouseEnter={e => {
              setStyle({ display: "block" })
            }}
            onMouseLeave={e => {
              if (window.location.hash !== "#" + questionId) {
                setStyle({ display: "none" })
              }
            }}
          >
            <Typography
              style={{ display: "flex" }}
              onClick={e => {
                e.preventDefault()
                updateLocationHash()
              }}
            >
              {question}
              <Hash style={style} color="secondary">
                {" "}
                #{" "}
              </Hash>
            </Typography>
          </AccordionHeader>
          <AccordionContent>
            <Markdown>{answer}</Markdown>
          </AccordionContent>
        </Accordion>
      </Grid>
    </TableContainer>
  )
}
