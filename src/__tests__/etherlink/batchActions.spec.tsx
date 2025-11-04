/**
 * @jest-environment jsdom
 */
import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { act } from "react-dom/test-utils"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EtherlinkContext } from "services/wagmi/context"

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
  test("parses your provided CSV without errors", async () => {
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
      "type,asset,to,from,amount,tokenId,key,value,target,function,params,rawCalldata,ethValue",
      "transfer_erc20,0x140F04125B21A6ac4e0B037712FD3409e69B4C90,0x645c1B43df7231B6654af996407230Dc9267047f,,90,,,,,,,",
      "transfer_erc20,0x8cB5a2b7C7585099989AC9d815E75261EBf635b8,0x645c1B43df7231B6654af996407230Dc9267047f,,10,,,,,,,",
      "transfer_erc20,0xCe5BA986d66Eef214D3083eF751323625B49A259,0x645c1B43df7231B6654af996407230Dc9267047f,,50,,,,,,,",
      "transfer_erc20,0xA1cd28839cc7e4AE090aE27Ea7f5fAa9D9d8fc4F,0x645c1B43df7231B6654af996407230Dc9267047f,,300,,,,,,,",
      "transfer_erc20,0xF4F4F137dF97412395de61F268C822Fa95C557b5,0x645c1B43df7231B6654af996407230Dc9267047f,,30,,,,,,,"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(5)
    actions.forEach(a => expect(a.type).toBe("transfer_erc20"))
  })
  test("parses mixed actions and reports no errors for valid rows", async () => {
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

    const header = [
      "type",
      "asset",
      "to",
      "from",
      "amount",
      "tokenId",
      "key",
      "value",
      "target",
      "function",
      "params",
      "rawCalldata",
      "ethValue"
    ].join(",")

    const csv = [
      header,
      "transfer_eth,native,0x0000000000000000000000000000000000000001,,,,,,,,,",
      "transfer_erc20,0x0000000000000000000000000000000000000002,0x0000000000000000000000000000000000000001,,10,,,,,,,",
      "registry_set,,,,,,site_url,https://example.com,,,,,",
      'contract_call,,,,,,,,0x0000000000000000000000000000000000000003,setOwner(address),["0x0000000000000000000000000000000000000004"],,'
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(4)
  })

  test("accepts tokenId 0 for transfer_erc721 actions", async () => {
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

    const header = [
      "type",
      "asset",
      "to",
      "from",
      "amount",
      "tokenId",
      "key",
      "value",
      "target",
      "function",
      "params",
      "rawCalldata",
      "ethValue"
    ].join(",")

    const csv = [
      header,
      "transfer_erc721,0x0F80b23D8aa7792C0ec5eEc192fD2C5D79eaf93A,0x0f00b7f32bbEFD81A26196CBa78A22A26Fcb0b0D,,,0,,,,,,"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(1)
    expect(actions[0].type).toBe("transfer_erc721")
    expect(actions[0].tokenId).toBe("0")
  })

  test("accepts tokenId with various numeric values for transfer_erc721 actions", async () => {
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

    const header = [
      "type",
      "asset",
      "to",
      "from",
      "amount",
      "tokenId",
      "key",
      "value",
      "target",
      "function",
      "params",
      "rawCalldata",
      "ethValue"
    ].join(",")

    const csv = [
      header,
      "transfer_erc721,0x0F80b23D8aa7792C0ec5eEc192fD2C5D79eaf93A,0x0f00b7f32bbEFD81A26196CBa78A22A26Fcb0b0D,,,0,,,,,,",
      "transfer_erc721,0x0F80b23D8aa7792C0ec5eEc192fD2C5D79eaf93A,0x0f00b7f32bbEFD81A26196CBa78A22A26Fcb0b0D,,,2,,,,,,",
      "transfer_erc721,0x0F80b23D8aa7792C0ec5eEc192fD2C5D79eaf93A,0x0f00b7f32bbEFD81A26196CBa78A22A26Fcb0b0D,,,9999,,,,,,"
    ].join("\n")

    const { actions, errors } = latest!.parseBatchCsv(csv)
    expect(errors.length).toBe(0)
    expect(actions.length).toBe(3)
    expect(actions[0].tokenId).toBe("0")
    expect(actions[1].tokenId).toBe("2")
    expect(actions[2].tokenId).toBe("9999")
  })
})
