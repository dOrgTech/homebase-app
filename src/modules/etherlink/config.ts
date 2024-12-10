import { EvmDaoBasics } from "./components/EvmDaoBasics"
import { EvmDaoDeployment } from "./components/EvmDaoDeployment"
import { EvmDaoQuorum } from "./components/EvmDaoQuorum"
import { EvmDaoSummary } from "./components/EvmDaoSummary"
import { EvmDaoVoting } from "./components/EvmDaoVoting"

export const STEPS = [
  { title: "DAO Template", index: 0, path: "template", component: EvmDaoBasics },
  { title: "DAO Basics", index: 1, path: "dao", component: EvmDaoBasics },
  { title: "Proposals & Voting", index: 2, path: "voting", component: EvmDaoVoting },
  { title: "Quorum", index: 3, path: "quorum", component: EvmDaoQuorum },
  { title: "Review Information", index: 4, path: "summary", component: EvmDaoSummary },
  { title: "Deployment Type", index: 5, path: "type", component: EvmDaoDeployment }
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
