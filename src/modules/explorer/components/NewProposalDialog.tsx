import { DAOTemplate } from "modules/creator/state";
import React from "react";
import { NewRegistryProposalDialog } from "../Registry";
import { NewTreasuryProposalDialog } from "../Treasury";

interface Props {
  template: DAOTemplate;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const NewProposalDialog: React.FC<Props> = ({ template, ...props }) => {
  switch (template) {
    case "treasury":
      return <NewTreasuryProposalDialog {...props} />;
    case "registry":
      return <NewRegistryProposalDialog {...props} />;
  }
};
