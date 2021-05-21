import React, { useContext } from "react";
import { ActionTypes, ModalsContext } from "../../ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo";

export const HoldingsHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);
  const shouldDisable = useIsProposalButtonDisabled(id)

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
