import React, { useState } from "react"
import { Props } from "./components/FiltersUserDialog"

export enum ProposalType {
  ON_CHAIN = "on-chain",
  OFF_CHAIN = "off-chain",
  ALL = "all"
}

export enum OffchainStatus {
  ACTIVE = "active",
  CLOSED = "closed",
  ALL = "all"
}

export enum Order {
  RECENT = "recent",
  POPULAR = "popular"
}

export interface StatusOption {
  label: string
}
