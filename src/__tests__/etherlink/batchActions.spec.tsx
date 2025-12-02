/**
 * @jest-environment jsdom
 */
import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { act } from "react-dom/test-utils"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EtherlinkContext } from "services/wagmi/context"

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

describe("Batch Actions CSV parsing", () => {
  test("parses transfer actions (ERC20) with 4-column CSV", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const csv = [
      "type,asset,to,amount",
      "transfer,0x140F04125B21A6ac4e0B037712FD3409e69B4C90,0x645c1B43df7231B6654af996407230Dc9267047f,90",
      "transfer,0x8cB5a2b7C7585099989AC9d815E75261EBf635b8,0x645c1B43df7231B6654af996407230Dc9267047f,10",
      "transfer,0xCe5BA986d66Eef214D3083eF751323625B49A259,0x645c1B43df7231B6654af996407230Dc9267047f,50",
      "transfer,0xA1cd28839cc7e4AE090aE27Ea7f5fAa9D9d8fc4F,0x645c1B43df7231B6654af996407230Dc9267047f,300",
      "transfer,0xF4F4F137dF97412395de61F268C822Fa95C557b5,0x645c1B43df7231B6654af996407230Dc9267047f,30"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(5)
    actions.forEach(a => expect(a.type).toBe("transfer_erc20"))
  })

  test("parses transfer actions with native XTZ", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "transfer,native,0x0000000000000000000000000000000000000001,1.5",
      "transfer,Native,0x0000000000000000000000000000000000000002,2.0"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(2)
    expect(actions[0].type).toBe("transfer_eth")
    expect(actions[1].type).toBe("transfer_eth")
  })

  test("auto-detects transfer type based on asset", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "transfer,native,0x0000000000000000000000000000000000000001,1",
      "transfer,0x0000000000000000000000000000000000000002,0x0000000000000000000000000000000000000001,10"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(2)
    expect(actions[0].type).toBe("transfer_eth")
    expect(actions[1].type).toBe("transfer_erc20")
  })

  test("parses mint actions with empty asset (defaults to DAO token)", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "mint,,0x0000000000000000000000000000000000000001,100",
      "mint,,0x0000000000000000000000000000000000000002,200"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(2)
    expect(actions[0].type).toBe("mint")
    expect(actions[0].asset).toBe("")
    expect(actions[1].type).toBe("mint")
    expect(actions[1].asset).toBe("")
  })

  test("parses burn actions using 'to' column for address to burn from", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "burn,,0x0000000000000000000000000000000000000001,50",
      "burn,,0x0000000000000000000000000000000000000002,75"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(2)
    expect(actions[0].type).toBe("burn")
    expect(actions[0].from).toBe("0x0000000000000000000000000000000000000001")
    expect(actions[1].type).toBe("burn")
    expect(actions[1].from).toBe("0x0000000000000000000000000000000000000002")
  })

  test("parses mint with custom token address", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "mint,0x0000000000000000000000000000000000000003,0x0000000000000000000000000000000000000001,1000"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(1)
    expect(actions[0].type).toBe("mint")
    expect(actions[0].asset).toBe("0x0000000000000000000000000000000000000003")
  })

  test("parses mixed action types in single CSV", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "transfer,native,0x0000000000000000000000000000000000000001,1",
      "transfer,0x0000000000000000000000000000000000000002,0x0000000000000000000000000000000000000001,10",
      "mint,,0x0000000000000000000000000000000000000001,100",
      "burn,,0x0000000000000000000000000000000000000002,50"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(4)
    expect(actions[0].type).toBe("transfer_eth")
    expect(actions[1].type).toBe("transfer_erc20")
    expect(actions[2].type).toBe("mint")
    expect(actions[3].type).toBe("burn")
  })

  test("rejects unsupported action types", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [
      header,
      "contract_call,0x0000000000000000000000000000000000000001,0x0000000000000000000000000000000000000002,0"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain("not enabled")
  })

  test("validates transfer requires asset", async () => {
    let latest: Api | null = null
    renderWithContext(
      {
        daoSelected: {},
        daoProposalSelected: undefined,
        setIsProposalDialogOpen: () => {},
        daoTreasuryTokens: [],
        daoNfts: []
      },
      api => (latest = api)
    )

    const header = "type,asset,to,amount"

    const csv = [header, "transfer,,0x0000000000000000000000000000000000000001,10"].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain("requires 'asset'")
  })
})
