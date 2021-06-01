import React, { createContext, useReducer, Dispatch, useMemo } from "react";

import { MigrationParams } from "services/contracts/baseDAO/types";
import useLocalStorage from "modules/common/hooks/useLocalStorage";
import {
  CreatorAction,
  CreatorState,
  ActionTypes,
} from "modules/creator/state/types";

const deploymentStatus = {
  deploying: false,
  successful: false,
};

const LOCAL_STORAGE_KEY = "creatorParams";

export const INITIAL_MIGRATION_STATE: MigrationParams = {
  template: "treasury",
  orgSettings: {
    name: "",
    symbol: "",
    description: "",
    governanceToken: {
      address: "",
      tokenId: ""
    },
    administrator: "",
    guardian: "",
  },
  votingSettings: {
    votingDays: 0,
    votingHours: 0,
    votingMinutes: 0,
    proposeStakeRequired: 0,
    proposeStakePercentage: 0,
    frozenScaleValue: 0,
    frozenDivisionValue: 1,
    minXtzAmount: 0,
    maxXtzAmount: 0,
    proposalFlushDays: 0,
    proposalFlushHours: 0,
    proposalFlushMinutes: 0,
    proposalExpiryDays: 0,
    proposalExpiryHours: 0,
    proposalExpiryMinutes: 0,
  },
  quorumSettings: {
    quorumThreshold: 0,
    minQuorumAmount: 1,
    maxQuorumAmount: 99,
    quorumChange: 5,
    quorumMaxChange: 19,
  }
};

export const INITIAL_STATE: CreatorState = {
  data: INITIAL_MIGRATION_STATE,
  deploymentStatus,
};

const CreatorContext = createContext<{
  state: CreatorState;
  dispatch: Dispatch<CreatorAction>;
  updateCache: (value: MigrationParams) => void;
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
  updateCache: () => null,
});

export const reducer = (
  state: CreatorState,
  action: CreatorAction
): CreatorState => {
  switch (action.type) {
    case ActionTypes.UPDATE_DEPLOYMENT_STATUS:
      const { contract, deploying } = action.status;
      state = {
        ...state,
        deploymentStatus: {
          contract,
          deploying,
          successful: false,
        },
      };
      return state;
    case ActionTypes.UPDATE_NAVIGATION_BAR:
      state = {
        ...state,
        next: action.next,
        back: action.back,
      };
      return state;
    case ActionTypes.UPDATE_ORGANIZATION_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          orgSettings: action.org,
        },
      };
      return state;
    case ActionTypes.UPDATE_QUORUM_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          quorumSettings: action.quorum,
        },
      };
      return state;
    case ActionTypes.UPDATE_VOTING_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          votingSettings: action.voting,
        },
      };
      return state;
    case ActionTypes.CLEAR_CACHE:
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      state = {
        ...INITIAL_STATE,
        deploymentStatus: {
          ...INITIAL_STATE.deploymentStatus,
          successful: true,
        },
      };
      return state;
    case ActionTypes.UPDATE_TEMPLATE:
      state = {
        ...state,
        data: {
          ...state.data,
          template: action.template,
        },
      };
      return state;
  }
};

const CreatorProvider: React.FC = ({ children }) => {
  const [data, updateCache] = useLocalStorage<MigrationParams>(
    LOCAL_STORAGE_KEY,
    INITIAL_STATE.data
  );

  const stateWithCache = {
    ...INITIAL_STATE,
    data,
  };

  const [state, dispatch] = useReducer(reducer, stateWithCache);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  return (
    <CreatorContext.Provider value={{ ...contextValue, updateCache }}>
      {children}
    </CreatorContext.Provider>
  );
};

export { CreatorProvider, CreatorContext };
