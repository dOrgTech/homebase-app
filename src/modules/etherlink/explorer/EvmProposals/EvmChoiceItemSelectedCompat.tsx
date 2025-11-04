import React, { useMemo } from "react"
import { Choice } from "models/Choice"
import { ChoiceItemSelected } from "modules/lite/explorer/components/ChoiceItemSelected"
import { IEvmOffchainChoice } from "modules/etherlink/types"

// Adapter to render Etherlink off-chain options using the Tezos ChoiceItemSelected UI
export const EvmChoiceItemSelectedCompat: React.FC<{
  choice: IEvmOffchainChoice
  allChoices: IEvmOffchainChoice[]
  votes: IEvmOffchainChoice[]
  setSelectedVotes: (next: IEvmOffchainChoice[]) => void
  multiple: boolean
}> = ({ choice, allChoices, votes, setSelectedVotes, multiple }) => {
  const toLiteChoice = (c: IEvmOffchainChoice): Choice => ({
    _id: String(c._id || c.pollID || c.name),
    name: String(c.name || ""),
    pollID: String(c.pollID || ""),
    walletAddresses: []
  })

  const fromLiteChoices = (selected: Choice[]): IEvmOffchainChoice[] => {
    const byId = new Map(allChoices.map(c => [String(c._id || c.name), c]))
    return selected.map(sc => byId.get(String(sc._id || sc.name))).filter(Boolean) as IEvmOffchainChoice[]
  }

  const liteChoice = useMemo(() => toLiteChoice(choice), [choice])
  const liteVotes = useMemo(() => votes.map(toLiteChoice), [votes])

  return (
    <ChoiceItemSelected
      choice={liteChoice}
      votes={liteVotes}
      multiple={multiple}
      setSelectedVotes={(sel: Choice[]) => setSelectedVotes(fromLiteChoices(sel))}
    />
  )
}

export default EvmChoiceItemSelectedCompat
