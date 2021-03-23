import React, { useContext } from "react";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";

export const RegistryHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);

  return (
    <TemplateHeader template="registry">
      <PrimaryButton
        variant="outlined"
        onClick={() =>
          dispatch({
            type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
            payload: {
              isUpdate: false,
              daoAddress: id,
            },
          })
        }
      >
        NEW ITEM
      </PrimaryButton>
    </TemplateHeader>
  );
};
