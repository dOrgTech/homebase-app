import React, { createContext, useReducer, Dispatch, useMemo } from "react";
import {
  CreatorAction,
  CreatorState,
  StepperIndex,
  ActionTypes,
  INITIAL_MIGRATION_STATE,
} from "./types";

export const INITIAL_STATE: CreatorState = {
  activeStep: StepperIndex.SELECT_TEMPLATE,
  governanceStep: StepperIndex.SELECT_TEMPLATE,
  onNextStep: () => {
    console.log("si br");
    return undefined;
  },
  data: INITIAL_MIGRATION_STATE,
};

const CreatorContext = createContext<{
  state: CreatorState;
  dispatch: Dispatch<CreatorAction>;
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

export const reducer = (
  state: CreatorState,
  action: CreatorAction
): CreatorState => {
  switch (action.type) {
    case ActionTypes.UPDATE_HANDLER:
      state = {
        ...state,
        onNextStep: action.handler,
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
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  return (
    <CreatorContext.Provider value={contextValue}>
      {children}
    </CreatorContext.Provider>
  );
};

export { CreatorProvider, CreatorContext };
