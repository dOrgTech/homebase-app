import React, { useContext, useMemo } from "react";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";

export const RegistryHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);
  const cycleInfo = useCycleInfo(id)
  const shouldDisable = useMemo(() => {
    if(cycleInfo && cycleInfo.type === "proposing") {
      return true
    }

    return false
  }, [cycleInfo])

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
        disabled={shouldDisable || !cycleInfo}
      >
        NEW ITEM
      </PrimaryButton>
    </TemplateHeader>
  );
};
