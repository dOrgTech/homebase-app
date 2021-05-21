import React, { useContext } from "react";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo";

export const RegistryHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);
  const shouldDisable = useIsProposalButtonDisabled(id)

  return (
    <TemplateHeader template="registry">
      <PrimaryButton
        variant="outlined"
        onClick={() =>
          dispatch({
            type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
            payload: {
              daoAddress: id,
            },
          })
        }
        disabled={shouldDisable}
      >
        NEW ITEM
      </PrimaryButton>
    </TemplateHeader>
  );
};
