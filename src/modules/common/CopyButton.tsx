import React from "react";
import { Box, styled } from "@material-ui/core";
import { FileCopyOutlined } from "@material-ui/icons";

const CopyIcon = styled(FileCopyOutlined)({
  cursor: "pointer",
});

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Box
      padding="5px 0 0 10px"
      marginTop="auto"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
    >
      <CopyIcon color="secondary" fontSize="small" />
    </Box>
  );
};
