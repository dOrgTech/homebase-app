import React, { useContext } from "react";
import { ActionTypes, ModalsContext } from "../../ModalsContext";
import { useParams } from "react-router";
import { PrimaryButton } from "modules/explorer/components/styled/PrimaryButton";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";

export const HoldingsHeader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);

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
      >
        NEW TRANSFER
      </PrimaryButton>
    </TemplateHeader>
  );
};
