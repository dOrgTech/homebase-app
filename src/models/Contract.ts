export interface ArbitraryContract {
  counter: number
  name: string
  type: string
  children: ContractChild[]
}

interface ContractChild {
  counter: number
  name: string
  type: string
  children: ParametersList[]
  placeholder: string
  validate: any
  initValue: string
}

interface ParametersList {
  counter: number
  name: string
  type: string
  children: ParametersList[]
  placeholder: string
  validate: any
  initValue: string
}
