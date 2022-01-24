import React, { ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { Link } from "@material-ui/core";

const MarkdownParagraph = (props: { children: ReactNode }) => {
  return <Typography variant='body1'>{props.children}</Typography>;
};

const MarkdownLink = (props: any) => {
  console.log(props);
  return (
    <Link target='_blank' color='secondary' underline='always' href={props.href}>
      {props.children}
    </Link>
  );
};

const MarkdownHeader = (props: { children: ReactNode; level: number }) => {
  switch (props.level) {
    case 1:
      return <Typography variant='h1'>{props.children}</Typography>;
    case 2:
      return <Typography variant='h2'>{props.children}</Typography>;
    case 3:
      return <Typography variant='h3'>{props.children}</Typography>;
    case 4:
      return <Typography variant='h4'>{props.children}</Typography>;
    case 5:
      return <Typography variant='h5'>{props.children}</Typography>;
    case 6:
      return <Typography variant='h6'>{props.children}</Typography>;
    default:
      return <Typography variant='h6'>{props.children}</Typography>;
  }
};

const components: Partial<
  Omit<import("react-markdown/lib/complex-types").NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
  h1: MarkdownHeader,
  h2: MarkdownHeader,
  h3: MarkdownHeader,
  h4: MarkdownHeader,
  h5: MarkdownHeader,
  h6: MarkdownHeader,
  p: MarkdownParagraph,
  a: MarkdownLink,
};

const Markdown = (props: ReactMarkdownOptions) => {
  return <ReactMarkdown components={components} remarkPlugins={[[remarkGfm], [remarkBreaks]]} {...props} />;
};

export default Markdown;
