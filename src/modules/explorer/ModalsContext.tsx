import React, { createContext, Dispatch, useReducer } from "react";
import { NewTransaction } from "./Registry/components/NewTransaction";
import { UpdateRegistryDialog } from "./Registry/components/UpdateRegistryDialog";
import { NewTreasuryProposalDialog } from "./Treasury";

export enum ActionTypes {
  OPEN_REGISTRY_TRANSACTION = "OPEN_REGISTRY_TRANSACTION",
  OPEN_REGISTRY_PROPOSAL = "OPEN_REGISTRY_PROPOSAL",
  OPEN_TREASURY_PROPOSAL = "OPEN_TREASURY_PROPOSAL",
  OPEN_VOTE = "OPEN_VOTE",
  CLOSE = "CLOSE",
}

type RegistryTransactionAction = {
  type: ActionTypes.OPEN_REGISTRY_TRANSACTION;
  payload: {
    daoAddress: string;
  };
};

type RegistryProposalAction = {
  type: ActionTypes.OPEN_REGISTRY_PROPOSAL;
  payload: {
    isUpdate: boolean;
    daoAddress: string;
    keyToUpdate?: string;
  };
};

type TreasuryProposalAction = {
  type: ActionTypes.OPEN_TREASURY_PROPOSAL;
  payload: {
    daoAddress: string;
  };
};

type VoteAction = {
  type: ActionTypes.OPEN_VOTE;
  payload: {
    support: boolean;
    daoAddress: string;
  };
};

type CloseAction = {
  type: ActionTypes.CLOSE;
  payload: {
    modal: keyof ModalContextState;
  };
};

type ModalsContextAction =
  | RegistryTransactionAction
  | RegistryProposalAction
  | TreasuryProposalAction
  | VoteAction
  | CloseAction;

interface ModalContextState {
  registryTransaction: {
    open: boolean;
  };
  registryProposal: {
    open: boolean;
    params: {
      isUpdate: boolean;
      keyToUpdate?: string;
    };
  };
  treasuryProposal: {
    open: boolean;
  };
  vote: {
    open: boolean;
  };
  daoId: string;
}

interface Context {
  state: ModalContextState;
  dispatch: Dispatch<ModalsContextAction>;
}

const INITIAL_STATE: ModalContextState = {
  registryTransaction: {
    open: false,
  },
  registryProposal: {
    open: false,
    params: {
      isUpdate: false,
    },
  },
  treasuryProposal: {
    open: false,
  },
  vote: {
    open: false,
  },
  daoId: "",
};

export const ModalsContext = createContext<Context>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

const reducer = (
  state: ModalContextState,
  action: ModalsContextAction
): ModalContextState => {
  switch (action.type) {
    case ActionTypes.OPEN_REGISTRY_TRANSACTION:
      return {
        ...state,
        daoId: action.payload.daoAddress,
        registryTransaction: { open: true },
      };
    case ActionTypes.OPEN_REGISTRY_PROPOSAL:
      return {
        ...state,
        daoId: action.payload.daoAddress,
        registryProposal: {
          open: true,
          params: {
            isUpdate: action.payload.isUpdate,
            keyToUpdate: action.payload.keyToUpdate,
          },
        },
      };
    case ActionTypes.OPEN_TREASURY_PROPOSAL:
      return {
        ...state,
        daoId: action.payload.daoAddress,
        treasuryProposal: { open: true },
      };
    case ActionTypes.OPEN_VOTE:
      return {
        ...state,
        daoId: action.payload.daoAddress,
        vote: { open: true },
      };
    case ActionTypes.CLOSE:
      return INITIAL_STATE;
    default:
      throw new Error(`Unrecognized action in Modals Provider`);
  }
};

export const ModalsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <ModalsContext.Provider value={{ state, dispatch }}>
      {children}
      <NewTreasuryProposalDialog />
      <UpdateRegistryDialog />
      <NewTransaction />
    </ModalsContext.Provider>
  );
};
