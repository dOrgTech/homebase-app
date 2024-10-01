import React, { createContext, useReducer, Dispatch, useMemo } from "react"
import useLocalStorage from "modules/common/hooks/useLocalStorage"
import { DeploymentAction, DeploymentState, TokenContractParams, ActionTypes } from "./types"
import BigNumber from "bignumber.js"

const deploymentStatus = {
  deploying: false,
  successful: false
}

const LOCAL_STORAGE_KEY = "deploymentParams"

export const INITIAL_TOKEN_STATE: TokenContractParams = {
  tokenSettings: {
    name: "",
    description: "",
    totalSupply: null,
    decimals: null,
    symbol: "",
    icon: ""
  },
  tokenDistribution: {
    holders: [
      {
        walletAddress: "",
        amount: null
      }
    ],
    totalAmount: new BigNumber(0)
  }
}

export const INITIAL_STATE: DeploymentState = {
  data: INITIAL_TOKEN_STATE,
  deploymentStatus
}

const DeploymentContext = createContext<{
  state: DeploymentState
  dispatch: Dispatch<DeploymentAction>
  updateCache: (value: TokenContractParams) => void
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
  updateCache: () => null
})

export const reducer = (state: DeploymentState, action: DeploymentAction): DeploymentState => {
  switch (action.type) {
    case ActionTypes.UPDATE_DEPLOYMENT_STATUS:
      const { contract, deploying } = action.status
      state = {
        ...state,
        deploymentStatus: {
          contract,
          deploying,
          successful: false
        }
      }
      return state
    case ActionTypes.UPDATE_NAVIGATION_BAR:
      state = {
        ...state,
        next: action.next,
        back: action.back
      }
      return state
    case ActionTypes.UPDATE_TOKEN_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          tokenSettings: action.contractInfo
        }
      }
      return state
    case ActionTypes.UPDATE_TOKEN_DISTRIBUTION:
      state = {
        ...state,
        data: {
          ...state.data,
          tokenDistribution: action.distribution
        }
      }
      return state
    case ActionTypes.CLEAR_CACHE:
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
      state = {
        ...INITIAL_STATE,
        deploymentStatus: {
          ...INITIAL_STATE.deploymentStatus,
          successful: true
        }
      }
      return state
  }
}

const DeploymentProvider: React.FC = ({ children }) => {
  const [data, updateCache] = useLocalStorage<TokenContractParams>(LOCAL_STORAGE_KEY, INITIAL_STATE.data)

  const stateWithCache = {
    ...INITIAL_STATE,
    data
  }

  const [state, dispatch] = useReducer(reducer, stateWithCache)
  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])
  return <DeploymentContext.Provider value={{ ...contextValue, updateCache }}>{children}</DeploymentContext.Provider>
}

export { DeploymentProvider, DeploymentContext }
