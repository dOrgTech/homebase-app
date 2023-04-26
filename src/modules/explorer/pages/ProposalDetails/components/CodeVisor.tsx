/* eslint-disable react/display-name */
import { Grid, styled, makeStyles } from "@material-ui/core"
import React, { useState } from "react"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import Prism, { highlight, plugins } from "prismjs"
import Editor from "react-simple-code-editor"
import "prism-themes/themes/prism-night-owl.css"

const Content = styled(Grid)({
  padding: "0 25px",
  background: "#121416",
  borderRadius: 4
})

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiPaper-root": {
    maxWidth: "900px !important",
    maxHeight: 200
  },
  "& .MuiDialog-paperWidthSm": {
    maxWidth: "900px !important",
    maxHeight: 200,
    height: "fit-content !important"
  },
  "& .MuiDialog-paperScrollPaper": {
    background: "red"
  }
})

const CustomEditor = styled(Editor)({
  "maxHeight": 500,
  "overflow": "scroll !important",
  "& textarea": {
    outline: "none !important"
  },
  "& textarea:focus-visited": {
    outline: "none !important"
  }
})
interface Props {
  open: boolean
  title?: string
  code: string
  handleClose: () => void
}

export const CodeVisor: React.FC<Props> = ({ open, title = "View Code", code, handleClose }) => {
  const grammar = Prism.languages.javascript

  return (
    <>
      <CustomDialog open={open} onClose={handleClose} title={title} template="md">
        <>
          <Content container direction={"column"} style={{ gap: 32 }}>
            <CustomEditor
              disabled={false}
              onValueChange={() => true}
              value={code}
              highlight={code => highlight(code, grammar, "javascript")}
              padding={10}
              style={{
                fontFamily: "Roboto Mono",
                fontSize: 14,
                fontWeight: 400,
                outlineWidth: 0
              }}
            />
          </Content>
        </>
      </CustomDialog>
    </>
  )
}
