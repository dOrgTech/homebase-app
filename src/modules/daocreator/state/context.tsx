import React, { createContext, useReducer, Dispatch } from "react";
import {
  CreatorAction,
  CreatorState,
  StepperIndex,
  ActionTypes,
} from "./types";

export const INITIAL_STATE: CreatorState = {
  activeStep: StepperIndex.SELECT_TEMPLATE,
  governanceStep: StepperIndex.SELECT_TEMPLATE,
  onNextStep: () => undefined,
};

const CreatorContext = createContext<{
  state: CreatorState;
  dispatch: Dispatch<CreatorAction>;
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

export const reducer = (state: CreatorState, action: CreatorAction) => {
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
    default:
      return state;
  }

  // return state;
};

const CreatorProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <CreatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CreatorContext.Provider>
  );
};

export { CreatorProvider, CreatorContext };
