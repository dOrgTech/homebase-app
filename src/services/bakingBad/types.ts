export type Network = "delphinet" | "mainnet";

export interface UnnamedMapValue {
  prim: string;
  type: string;
  value: string;
}

export interface NamedMapValue {
  prim: string;
  type: string;
  value: string;
  name: string
}