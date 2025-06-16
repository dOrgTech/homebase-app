/* eslint-disable prettier/prettier */
declare global {
  interface Window {
    disconnectEtherlink: typeof disconnect
    web3Modal: any
    DeployContract: any
  }
}

export {}
