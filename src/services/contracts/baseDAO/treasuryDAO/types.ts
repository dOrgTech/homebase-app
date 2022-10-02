import { TransferParams } from ".."

export type TreasuryExtraDTO = [
  {
    id: 298021
    active: true
    hash: "exprtevAuptvU9Bw6HFVB7yCAUygSW4oLV454647xqEmTar5hVzzQ3"
    key: "slash_division_value"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  },
  {
    id: 298022
    active: true
    hash: "exprtextRC1PHYnJYFZ8QDdRYTdR1PC1aEMFyjMjehAytHgwTqr1mH"
    key: "frozen_scale_value"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  },
  {
    id: 298023
    active: true
    hash: "exprtpS3eiFbdRb7fHTBtTeLKEpFJqpb1snfeQvi6Erwf4GVMXecc4"
    key: "max_xtz_amount"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  },
  {
    id: 298024
    active: true
    hash: "expru9gtnoVVDCRx9ZB8jhvr688wYWKPCHtAEvfbSei2aMLCqyHKo3"
    key: "min_xtz_amount"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  },
  {
    id: 298025
    active: true
    hash: "expruDLFhS5Z5wWdfcPRFopF5rmNfU6Ng3raS7V9w9jex11FU16ao5"
    key: "slash_scale_value"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  },
  {
    id: 298026
    active: true
    hash: "expruE4XAPWaDWMBA6AmSi8FnCSAJjCCJATSmBMbnUmieqwgQV1WoE"
    key: "frozen_extra_value"
    value: string
    firstLevel: 292370
    lastLevel: 292370
    updates: 1
  }
]

export interface TreasuryProposeArgs {
  agoraPostId: number
  transfers: TransferParams[]
}
