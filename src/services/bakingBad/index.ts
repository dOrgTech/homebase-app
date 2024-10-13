import { Network, rpcNodes } from "services/beacon"

export const networkNameMap: Record<Network, string> = Object.keys(rpcNodes).reduce((acc, network) => {
  acc[network as Network] = network
  return acc
}, {} as Record<Network, string>)
