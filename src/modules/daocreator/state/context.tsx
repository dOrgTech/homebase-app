import React, { createContext, useReducer, Dispatch, useMemo } from "react";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import { MigrationParams } from "../../../services/contracts/baseDAO/types";
import {
  CreatorAction,
  CreatorState,
  StepperIndex,
  ActionTypes,
  INITIAL_MIGRATION_STATE,
} from "./types";

const deploymentStatus = {
  deploying: false,
};

export const INITIAL_STATE: CreatorState = {
  activeStep: StepperIndex.SELECT_TEMPLATE,
  governanceStep: StepperIndex.SELECT_TEMPLATE,
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
    case ActionTypes.UPDATE_STEP:
      state = {
        ...state,
        activeStep: action.step,
      };
      return state;
    case ActionTypes.UPDATE_GOVERNANCE_STEP:
      state = {
        ...state,
        governanceStep: action.step,
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
    case ActionTypes.UPDATE_VOTING_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          votingSettings: action.voting,
        },
      };
      return state;
    case ActionTypes.UPDATE_MEMBERS_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          memberSettings: action.members,
        },
      };
      return state;
    default:
      return state;
  }
};

const CreatorProvider: React.FC = ({ children }) => {
  const [DAOParams, updateCache] = useLocalStorage<MigrationParams>(
    "creatorParams",
    INITIAL_STATE.data
  );

  console.log(DAOParams);
  const stateWithCache = {
    ...INITIAL_STATE,
    data: DAOParams,
  };

  const [state, dispatch] = useReducer(reducer, stateWithCache);
  console.log(state.data);
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
