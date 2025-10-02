import { create } from "zustand"

type ProposalStatusOverride = "queued" | "executable"

type OverrideEntry = {
  status?: ProposalStatusOverride
  eta?: number // unix seconds when execution becomes available (if known)
  updatedAt: number // unix ms
}

interface ProposalUiOverrideState {
  overrides: Record<string, OverrideEntry | undefined>
  setQueued: (proposalId: string, eta?: number) => void
  setExecutable: (proposalId: string) => void
  clear: (proposalId: string) => void
}

export const useProposalUiOverride = create<ProposalUiOverrideState>(set => ({
  overrides: {},
  setQueued: (proposalId, eta) =>
    set(state => ({
      overrides: {
        ...state.overrides,
        [proposalId]: { status: "queued", eta, updatedAt: Date.now() }
      }
    })),
  setExecutable: proposalId =>
    set(state => ({
      overrides: {
        ...state.overrides,
        [proposalId]: { status: "executable", updatedAt: Date.now() }
      }
    })),
  clear: proposalId =>
    set(state => {
      const next = { ...state.overrides }
      delete next[proposalId]
      return { overrides: next }
    })
}))
