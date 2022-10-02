import React from "react"
import { styled } from "@material-ui/core"

const Link = styled("a")({
  "display": "flex",
  "textDecoration": "none",
  "&:active": {
    color: "unset"
  }
})

interface ExternalLinkProps {
  link: string
  children: React.ReactNode
  // pass className to allowlocal style overrides
  className?: string
}

export const ExternalLink = ({ link, children, className }: ExternalLinkProps): JSX.Element => {
  return (
    <Link className={className} href={link} rel="noreferrer noopener" target="_blank">
      {children}
    </Link>
  )
}
