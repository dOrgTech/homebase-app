/**
 * @jest-environment jsdom
 */
import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { act } from "react-dom/test-utils"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EtherlinkContext } from "services/wagmi/context"
import { ethers } from "ethers"

// Mock hooks that require wallet/providers
jest.mock("services/beacon/hooks/useTezos", () => ({
  useTezos: () => ({ etherlink: {}, network: "etherlink_testnet" })
}))

jest.mock("services/wagmi/etherlink/hooks/useProposalUiOverride", () => ({
  useProposalUiOverride: () => ({ overrides: {}, setQueued: jest.fn(), setExecuted: jest.fn() })
}))

type Api = ReturnType<typeof useEvmProposalOps>

const HookProbe: React.FC<{ onUpdate: (api: Api) => void; context: any }> = ({ onUpdate, context }) => {
  const api = useEvmProposalOps()
  useEffect(() => {
    onUpdate(api)
  }, [api])
  return null
}

function renderWithContext(contextValue: any, onUpdate: (api: Api) => void) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <EtherlinkContext.Provider value={contextValue}>
        <HookProbe onUpdate={onUpdate} context={contextValue} />
      </EtherlinkContext.Provider>
    )
  })
  return { root, container }
}

async function waitFor(predicate: () => boolean, timeoutMs = 1000, intervalMs = 10) {
  const start = Date.now()
  return new Promise<void>((resolve, reject) => {
    const tick = () => {
      if (predicate()) return resolve()
      if (Date.now() - start > timeoutMs) return reject(new Error("timeout"))
      setTimeout(tick, intervalMs)
    }
    tick()
  })
}

describe("Transfer Assets flow (ERC-20/NFT)", () => {
  const registry = "0xFC71DB2a8952c15f5aC44E152d931Fc1A74812FD"
  const recipient = "0xE26806D761d0Bc7c697b6338567D4Db483d8b958"

  const baseContext = {
    daoSelected: { address: undefined, registryAddress: registry },
    daoProposalSelected: undefined,
    setIsProposalDialogOpen: () => {},
    daoTreasuryTokens: [],
    daoNfts: []
  }

  test("encodes ERC-20 transfer and enables Next", async () => {
    let latest: Api | null = null
    renderWithContext(baseContext, api => (latest = api))

    await act(async () => {
      latest!.setMetadataFieldValue("type", "transfer_assets")
      latest!.setCurrentStep(2)
      latest!.setTransferAssets(
        [
          {
            assetType: "transferERC20",
            assetSymbol: "ZTK",
            assetAddress: "0x1111111111111111111111111111111111111111",
            assetDecimals: 6,
            recipient,
            amount: "10"
          }
        ],
        registry
      )
    })

    await waitFor(() => !!latest && Array.isArray(latest.createProposalPayload?.calldatas))
    expect(latest!.isNextDisabled).toBe(false)
    expect(latest!.createProposalPayload.calldatas.length).toBe(1)
    expect(latest!.createProposalPayload.targets.length).toBe(1)
  })

  test("missing ERC-20 address stays disabled and produces no calldata", async () => {
    let latest: Api | null = null
    renderWithContext(baseContext, api => (latest = api))

    await act(async () => {
      latest!.setMetadataFieldValue("type", "transfer_assets")
      latest!.setCurrentStep(2)
      latest!.setTransferAssets(
        [
          {
            assetType: "transferERC20",
            assetSymbol: "ZTK",
            recipient,
            amount: "10",
            assetDecimals: 6
          }
        ],
        registry
      )
    })

    await waitFor(() => !!latest)
    expect(latest!.isNextDisabled).toBe(true)
    expect(latest!.createProposalPayload.calldatas.length).toBe(0)
  })

  test("encodes ERC-721 transfer and enables Next", async () => {
    let latest: Api | null = null
    renderWithContext(baseContext, api => (latest = api))

    await act(async () => {
      latest!.setMetadataFieldValue("type", "transfer_assets")
      latest!.setCurrentStep(2)
      latest!.setTransferAssets(
        [
          {
            assetType: "transferERC721",
            assetSymbol: "NFT",
            assetAddress: "0x2222222222222222222222222222222222222222",
            tokenId: "1",
            recipient
          }
        ],
        registry
      )
    })

    await waitFor(() => !!latest && Array.isArray(latest.createProposalPayload?.calldatas))
    expect(latest!.isNextDisabled).toBe(false)
    expect(latest!.createProposalPayload.calldatas.length).toBe(1)
    expect(latest!.createProposalPayload.targets.length).toBe(1)
  })
})

describe("queueForExecution", () => {
  test("uses stored proposal tuples", async () => {
    const queueWait = jest.fn().mockResolvedValue({ status: 1 })
    const queueSpy = jest.fn().mockResolvedValue({ hash: "0xabc", wait: queueWait })

    const contractStub = {
      queue: queueSpy,
      execute: jest.fn(),
      hashProposal: jest.fn().mockResolvedValue(1n),
      proposalEta: jest.fn().mockResolvedValue(0n),
      proposalNeedsQueuing: jest.fn().mockResolvedValue(true)
    }

    const contractSpy = jest.spyOn(ethers, "Contract").mockReturnValue(contractStub as any)

    const proposalTargets = ["0x441c3A385B1ed9e904125AD9B4EfF0942E746296"]
    const proposalValues = ["0"]
    const proposalCalldata = ["0x368b87720000000000000000000000000000000000000000000000000000000000000002"]

    const contextValue = {
      daoSelected: {
        address: "0xDa0Da0Da0Da0Da0Da0Da0Da0Da0Da0Da0Da0Da0D",
        executionDelay: 60,
        registryAddress: "0xRegistry0000000000000000000000000000000000",
        token: "0xToken000000000000000000000000000000000000"
      },
      daoProposalSelected: {
        id: "1",
        type: "contract call",
        title: "Test Proposal",
        description: "Do something",
        externalResource: "https://example.com",
        targets: proposalTargets,
        values: proposalValues,
        callDatas: proposalCalldata,
        callDataPlain: proposalCalldata,
        statusHistoryMap: [],
        status: "passed"
      },
      setIsProposalDialogOpen: () => {},
      daoTreasuryTokens: [],
      daoNfts: [],
      provider: {},
      signer: {},
      contractData: [],
      daos: [],
      isLoadingDaos: false,
      isLoadingDaoProposals: false,
      daoProposals: [],
      daoMembers: [],
      daoProposalVoters: [],
      selectDaoProposal: () => {},
      selectDao: () => {}
    }

    let latest: Api | null = null
    renderWithContext(contextValue, api => (latest = api))

    await waitFor(() => !!latest)

    await act(async () => {
      await latest!.queueForExecution()
    })

    const expectedHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        [
          contextValue.daoProposalSelected.title,
          contextValue.daoProposalSelected.type,
          contextValue.daoProposalSelected.description,
          contextValue.daoProposalSelected.externalResource
        ].join("0|||0")
      )
    )

    expect(queueSpy).toHaveBeenCalledWith(proposalTargets, [0n], proposalCalldata, expectedHash)
    expect(queueWait).toHaveBeenCalled()

    contractSpy.mockRestore()
  })
})
