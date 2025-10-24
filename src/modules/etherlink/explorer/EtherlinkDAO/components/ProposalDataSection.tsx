import { Grid, Typography, styled, useTheme, useMediaQuery } from "components/ui"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import {
  RegistryProposalRenderer,
  MintBurnProposalRenderer,
  TransferETHProposalRenderer,
  TransferERC20ProposalRenderer,
  TransferERC721ProposalRenderer,
  ContractCallProposalRenderer,
  ConfigChangeProposalRenderer
} from "modules/etherlink/components/proposalRenderers"

const StyledContentContainer = styled(ContentContainer)(({ theme }) => ({
  gap: 10,
  padding: "32px 46px",
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

interface ProposalDataItem {
  parameter: string
  value: string
}

interface ProposalDataSectionProps {
  proposalData?: ProposalDataItem[]
  proposalType?: string
  tokenSymbol?: string
  decimals?: number
  nativeDecimals?: number
  targets?: string[]
  callDataPlain?: string[]
  values?: any[]
}

export const ProposalDataSection = ({
  proposalData,
  proposalType,
  tokenSymbol,
  decimals,
  nativeDecimals,
  targets,
  callDataPlain,
  values
}: ProposalDataSectionProps) => {
  if (!proposalData || proposalData.length === 0) {
    return null
  }

  const renderProposalData = () => {
    const type = proposalType?.toLowerCase() || ""

    // Registry proposal
    if (type === "registry") {
      return <RegistryProposalRenderer proposalData={proposalData} />
    }

    // Config change proposals (quorum, voting delay, voting period, proposal threshold)
    if (type === "quorum" || type === "voting delay" || type === "voting period" || type === "proposal threshold") {
      return <ConfigChangeProposalRenderer proposalData={proposalData} proposalType={type} />
    }

    // Mint/Burn proposals
    if (type.startsWith("mint") || type.startsWith("burn")) {
      return (
        <MintBurnProposalRenderer
          proposalData={proposalData}
          proposalType={type}
          tokenSymbol={tokenSymbol}
          decimals={decimals}
        />
      )
    }

    // Transfer ETH/ERC20/ERC721
    if (type === "transfer") {
      console.log("ProposalDataSection - Full proposalData:", proposalData)

      // Check the VALUE of the first element (which contains the function name)
      // proposalData[0] = { parameter: "Function", value: "transferETH" | "transferERC20" | "transferERC721" }
      const transferType = proposalData?.[0]?.value?.toLowerCase() || ""
      console.log("ProposalDataSection - Detected transferType:", transferType)

      // Use includes() for more defensive matching
      if (transferType.includes("transfererc721")) {
        console.log("ProposalDataSection - Routing to TransferERC721ProposalRenderer")
        return <TransferERC721ProposalRenderer proposalData={proposalData} />
      } else if (transferType.includes("transfererc20")) {
        console.log("ProposalDataSection - Routing to TransferERC20ProposalRenderer")
        return <TransferERC20ProposalRenderer proposalData={proposalData} decimals={decimals} />
      } else {
        // transferETH or fallback
        console.log("ProposalDataSection - Routing to TransferETHProposalRenderer (default)")
        return (
          <TransferETHProposalRenderer
            proposalData={proposalData}
            targets={targets}
            callDataPlain={callDataPlain}
            values={values}
            tokenSymbol={tokenSymbol}
            decimals={nativeDecimals || 18}
          />
        )
      }
    }

    // Contract call - show Target and CallData
    return <ContractCallProposalRenderer proposalData={proposalData} targets={targets} callDataPlain={callDataPlain} />
  }

  return (
    <StyledContentContainer container>
      <Grid container>
        <Typography variant="h3" color="textPrimary">
          Proposal Data
        </Typography>
      </Grid>
      <Grid container>{renderProposalData()}</Grid>
    </StyledContentContainer>
  )
}
