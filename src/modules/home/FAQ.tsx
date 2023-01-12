import { Grid, Link, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { Header } from "./Header"
import { ContentContainer } from "../explorer/components/ContentContainer"
import { FAQItem } from "./FAQItem"
import { useGenerateFAQ } from "./hooks/useGenerateFAQ"

const PageContainer = styled("div")(({ theme }) => ({
  background: theme.palette.primary.dark,
  width: "1000px",
  margin: "auto",

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  }
}))

const PageGrid = styled(Grid)({
  gap: 46
})

const TextBlock = styled(ContentContainer)({
  padding: "38px",
  boxSizing: "border-box",
  fontWeight: 300
})

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 30,
  fontWeight: 400,
  lineHeight: 0.8,
  marginBottom: 25
}))

const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 300
}))

const BodyTextGrid = styled(Grid)({
  display: "grid",
  gap: 12
})

export const FAQ: React.FC = () => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const faqList = useGenerateFAQ()

  return (
    <PageContainer>
      {!isExtraSmall && (
        <Grid item>
          <Header />
        </Grid>
      )}
      <PageGrid container direction="column">
        <TextBlock item>
          <TitleText color="textPrimary" variant="h1">
            Welcome to Homebase FAQ
          </TitleText>
          <BodyTextGrid container>
            <BodyText color="textPrimary">
              We strive to make Homebase super user-centered. Feel free to reach out to our team at any time on the{" "}
              <Link color="secondary" target="_blank" href="https://discord.gg/XufcBNu277">
                Discord
              </Link>
              .
            </BodyText>
            <BodyText color="textPrimary">
              Below are questions we’ve received and would like to share the answers to in a direct way for users.
            </BodyText>
          </BodyTextGrid>
        </TextBlock>

        {faqList.map(({ question, answer }, i) => (
          <FAQItem key={`question-${i}`} id={`question-${i}`} question={question} answer={answer} />
        ))}
      </PageGrid>
    </PageContainer>
  )
}
