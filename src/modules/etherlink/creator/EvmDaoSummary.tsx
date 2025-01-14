import { DescriptionText } from "components/ui/DaoCreator"
import { TitleBlock } from "modules/common/TitleBlock"
import React from "react"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

interface EvmDaoSummaryProps {
  // Add props as needed
}

export const EvmDaoSummary: React.FC<EvmDaoSummaryProps> = () => {
  return (
    <div className="evm-dao-summary">
      <TitleBlock
        title="DAO Summary"
        description={
          <DescriptionText variant="subtitle1">These settings will define the summary for your DAO.</DescriptionText>
        }
      />
      <div className="summary-content"></div>
    </div>
  )
}
