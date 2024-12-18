import { EvmDaoRegistry } from "./creator/EvmDaoRegistry"
import { EvmDaoBasics } from "./creator/EvmDaoBasics"
import { EvmDaoMembership } from "./creator/EvmDaoMembership"
import { EvmDaoQuorum } from "./creator/EvmDaoQuorum"
import { EvmDaoSummary } from "./creator/EvmDaoSummary"
import { EvmDaoVoting } from "./creator/EvmDaoVoting"

export const STEPS = [
  { title: "DAO Template", index: 0, path: "template", component: EvmDaoBasics },
  { title: "DAO Basics", index: 1, path: "dao", component: EvmDaoBasics },
  { title: "Proposals & Voting", index: 2, path: "voting", component: EvmDaoVoting },
  { title: "Quorum", index: 3, path: "quorum", component: EvmDaoQuorum },
  { title: "Membership", index: 4, path: "membership", component: EvmDaoMembership },
  { title: "Registry", index: 5, path: "registry", component: EvmDaoRegistry },
  { title: "Review & Deploy", index: 6, path: "summary", component: EvmDaoSummary }
]

export const urlToStepMap: Record<string, number> = {
  template: 0,
  dao: 1,
  voting: 2,
  quorum: 3,
  summary: 4,
  type: 5,
  review: 6
}
