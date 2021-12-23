import {
  TextField,
} from "@material-ui/core";
import React from "react";
import {ResponsiveDialog} from "../../v2/components/ResponsiveDialog";
import {ProposalFormInput} from "../../components/ProposalFormInput";

export const RegistryItemDialog: React.FC<{
  item: { key: string; value: string };
  open: boolean;
  handleClose: () => void;
}> = ({item: {key, value}, open, handleClose}) => {
  return (
    <>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={key}
      >
        <ProposalFormInput label={"Value"}>
          <TextField
            InputProps={{disableUnderline: true}}
            multiline
            maxRows={Infinity}
            value={value}
            disabled
          />
        </ProposalFormInput>
      </ResponsiveDialog>
    </>
  );
};
