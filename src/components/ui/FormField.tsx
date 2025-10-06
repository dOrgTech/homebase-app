// Bridge wrapper to reuse Tezos ProposalFormInput in the UI layer
// This keeps feature code importing from components/ui only.
import { ProposalFormInput } from "modules/explorer/components/ProposalFormInput"

export const FormField = ProposalFormInput
