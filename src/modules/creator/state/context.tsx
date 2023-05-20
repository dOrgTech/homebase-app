import React, { createContext, useReducer, Dispatch, useMemo } from "react"

import useLocalStorage from "modules/common/hooks/useLocalStorage"
import { CreatorAction, CreatorState, ActionTypes, MigrationParams } from "modules/creator/state/types"
import { useTezos } from "services/beacon/hooks/useTezos"
import { networkNameMap } from "services/bakingBad"
import { getTezosNetwork } from "services/beacon/utils"

const deploymentStatus = {
  deploying: false,
  successful: false
}

const LOCAL_STORAGE_KEY = "creatorParams"

export const INITIAL_MIGRATION_STATE: MigrationParams = {
  template: "lambda",
  orgSettings: {
    name: "",
    symbol: "",
    description: "",
    governanceToken: {
      address: "",
      tokenId: "0"
    },
    administrator: "",
    guardian: ""
  },
  votingSettings: {
    votingBlocks: 0,
    proposeStakeRequired: "0",
    returnedTokenPercentage: 0,
    minXtzAmount: 0,
    maxXtzAmount: 0,
    proposalFlushBlocks: 0,
    proposalExpiryBlocks: 0,
    votingBlocksDay: 0,
    votingBlocksHours: 0,
    votingBlocksMinutes: 5,
    proposalFlushBlocksDay: 0,
    proposalFlushBlocksHours: 0,
    proposalFlushBlocksMinutes: 5,
    proposalExpiryBlocksDay: 0,
    proposalExpiryBlocksHours: 0,
    proposalExpiryBlocksMinutes: 5
  },
  quorumSettings: {
    quorumThreshold: 2,
    minQuorumAmount: 1,
    maxQuorumAmount: 90,
    quorumChange: 5,
    quorumMaxChange: 19
  }
}

const getInitialState = (data: MigrationParams) => {
  const network = getTezosNetwork()

  data.votingSettings.votingBlocksDay = network === networkNameMap.ghostnet ? 0 : 3
  data.votingSettings.votingBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  data.votingSettings.votingBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0
  data.votingSettings.proposalFlushBlocksDay = network === networkNameMap.ghostnet ? 0 : 1
  data.votingSettings.proposalFlushBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  data.votingSettings.proposalFlushBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0
  data.votingSettings.proposalExpiryBlocksDay = network === networkNameMap.ghostnet ? 0 : 6
  data.votingSettings.proposalExpiryBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  data.votingSettings.proposalExpiryBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0

  return data
}

export const INITIAL_STATE: CreatorState = {
  data: getInitialState(INITIAL_MIGRATION_STATE),
  deploymentStatus
}

const CreatorContext = createContext<{
  state: CreatorState
  dispatch: Dispatch<CreatorAction>
  updateCache: (value: MigrationParams) => void
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
  updateCache: () => null
})

export const reducer = (state: CreatorState, action: CreatorAction): CreatorState => {
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
    case ActionTypes.UPDATE_ORGANIZATION_SETTINGS:
      localStorage.setItem("creator-started", "true")
      state = {
        ...state,
        data: {
          ...state.data,
          orgSettings: action.org
        }
      }
      return state
    case ActionTypes.UPDATE_QUORUM_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          quorumSettings: action.quorum
        }
      }
      return state
    case ActionTypes.UPDATE_VOTING_SETTINGS:
      state = {
        ...state,
        data: {
          ...state.data,
          votingSettings: action.voting
        }
      }
      return state
    case ActionTypes.UPDATE_TEMPLATE:
      state = {
        ...state,
        data: {
          ...state.data,
          template: action.template
        }
      }
      return state
    case ActionTypes.CLEAR_CACHE:
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
      window.localStorage.removeItem("creator-started")
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

const updateInitialState = (network: string, values: MigrationParams) => {
  values.votingSettings.votingBlocksDay = network === networkNameMap.ghostnet ? 0 : 3
  values.votingSettings.votingBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  values.votingSettings.votingBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0
  values.votingSettings.proposalFlushBlocksDay = network === networkNameMap.ghostnet ? 0 : 1
  values.votingSettings.proposalFlushBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  values.votingSettings.proposalFlushBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0
  values.votingSettings.proposalExpiryBlocksDay = network === networkNameMap.ghostnet ? 0 : 6
  values.votingSettings.proposalExpiryBlocksHours = network === networkNameMap.ghostnet ? 0 : 0
  values.votingSettings.proposalExpiryBlocksMinutes = network === networkNameMap.ghostnet ? 5 : 0

  return values
}

const CreatorProvider: React.FC = ({ children }) => {
  const [data, updateCache] = useLocalStorage<MigrationParams>(LOCAL_STORAGE_KEY, INITIAL_STATE.data)
  const isCreatorStarted = localStorage.getItem("creator-started")

  const { network } = useTezos()

  const updatedData = isCreatorStarted ? data : updateInitialState(network, data)

  const stateWithCache = {
    ...INITIAL_STATE,
    updatedData
  }

  const [state, dispatch] = useReducer(reducer, stateWithCache)
  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])
  return <CreatorContext.Provider value={{ ...contextValue, updateCache }}>{children}</CreatorContext.Provider>
}

export { CreatorProvider, CreatorContext }
