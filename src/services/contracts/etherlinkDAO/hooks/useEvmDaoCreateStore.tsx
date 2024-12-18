import { create } from "zustand"
import { STEPS } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"

interface EvmDaoCreateStore {
  currentStep: number
  data: Record<string, any>
  loading: Record<string, boolean>
  error: Record<string, string | null>
  getIn: (field: string) => any
  setFieldValue: (field: string, value: any) => void
  next: {
    text: string
    handler: () => string | undefined
  }
  prev: {
    text: string
    handler: () => string | undefined
  }
}

const useEvmDaoCreateZustantStore = create<EvmDaoCreateStore>((set, get) => ({
  currentStep: 0,
  data: {
    name: "",
    symbol: "",
    description: "",
    administrator: "",
    governanceToken: {
      address: "",
      symbol: "",
      tokenDecimals: 0
    },
    quorum: {
      returnedTokenPercentage: 0
    },
    members: [{ address: "", amountOfTokens: 0 }],
    voting: {
      votingBlocksDay: 0,
      votingBlocksWeek: 0
    },
    registry: {}
  },
  getIn: (field: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      return get().data[parent][child]
    }
    return get().data[field]
  },
  setFieldValue: (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      set({ data: { ...get().data, [parent]: { ...get().data[parent], [child]: value } } })
    } else {
      set({ data: { ...get().data, [field]: value } })
    }
  },
  next: {
    text: "Next",
    handler: () => {
      const { currentStep } = get()
      if (currentStep === STEPS.length - 1) return
      console.log("Moving to Next Step", currentStep)
      set({ currentStep: currentStep + 1 })
      return STEPS[currentStep + 1]?.path
    }
  },
  prev: {
    text: "Back",
    handler: () => {
      const { currentStep } = get()
      if (currentStep === 0) return
      console.log("Moving to Previous Step", currentStep)
      set({ currentStep: currentStep - 1 })
      return STEPS[currentStep - 1]?.path
    }
  },
  loading: {},
  error: {}
}))

const useEvmDaoCreateStore = () => {
  const data = useEvmDaoCreateZustantStore()
  const history = useHistory()
  return {
    ...data,
    next: {
      text: "Next",
      handler: () => {
        const nextStep = data.next.handler()
        if (nextStep) {
          history.push(nextStep)
        }
      }
    },
    prev: {
      text: "Back",
      handler: () => {
        const prevStep = data.prev.handler()
        if (prevStep) {
          history.push(prevStep)
        }
      }
    }
  }
}

export default useEvmDaoCreateStore
