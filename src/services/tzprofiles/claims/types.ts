export type ClaimsDTO = [string[]]

export type ClaimType = "VerifiableCredential" | "BasicProfile"
export interface ClaimSubject {
  id: "did:pkh:tz:tz1PnpYYdcgoVq1RYgj6qSdbzwSJRXXcfU3F"
  website: "https://tezos.domains"
  alias: "Alice"
  logo: "https://i.pinimg.com/originals/32/3c/d5/323cd586eb8f53c45674c70b3d42e44a.jpg"
  description: "Tezos Domains example person"
}

export interface Claim {
  id: string
  type: ClaimType[]
  credentialSubject: ClaimSubject
  issuer: string
  issuanceDate: string
}
