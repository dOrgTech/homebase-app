import React, { useContext } from "react";
import { ActionTypes, ModalsContext } from "../../ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";
import { useMemo } from "react";

export const HoldingsHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cycleInfo = useCycleInfo(id)
  const { dispatch } = useContext(ModalsContext);
  const shouldDisable = useMemo(() => {
    if(cycleInfo && cycleInfo.type === "proposing") {
      return true
    }

    return false
  }, [cycleInfo])

  return (
    <TemplateHeader template="treasury">
      <PrimaryButton
        variant="outlined"
        onClick={() => {
          dispatch({
            type: ActionTypes.OPEN_TREASURY_PROPOSAL,
            payload: {
              daoAddress: id,
            },
          });
        }}
        disabled={shouldDisable}
      >
        NEW TRANSFER
      </PrimaryButton>
    </TemplateHeader>
  );
};
