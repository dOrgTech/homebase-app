import { Grid, Link, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { Header } from "./Header";
import { ContentContainer } from "../explorer/components/ContentContainer";
import { FAQItem } from "./FAQItem";
import { useGenerateFAQ } from "./hooks/useGenerateFAQ";

const PageContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1186,
  height: "100%",
  margin: "auto",

  [theme.breakpoints.down("md")]: {
    padding: "18px",
    boxSizing: "border-box",
  },
}));

const TextBlock = styled(ContentContainer)({
  padding: "35px 42px",
  boxSizing: "border-box",
});

export const FAQ: React.FC = () => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const faqList = useGenerateFAQ();

  return (
    <PageContainer>
      <Grid container direction='column' style={{ gap: 46 }}>
        {!isExtraSmall && (
          <Grid item>
            <Header />
          </Grid>
        )}
        <TextBlock item>
          <Typography color={"textPrimary"} variant={"h1"}>
            Welcome to Homebase FAQ
            <br />
            <br />
          </Typography>
          <Typography color={"textPrimary"} variant={"body1"}>
             We strive to make Homebase super user-centered. Feel free to reach out to our team at any time on the{" "}
            <Link color={"secondary"} target='_blank' href='https://discord.gg/XufcBNu277'>
              Discord
            </Link>
            .<br />
            <br />
            Below are questions we’ve received and would like to share the answers to in a direct way for users.
          </Typography>
        </TextBlock>

        {faqList.map(({ question, answer }, i) => (
          <FAQItem key={`question-${i}`} question={question} answer={answer} />
        ))}
      </Grid>
    </PageContainer>
  );
};
