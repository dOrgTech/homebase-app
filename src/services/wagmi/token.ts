import React, { useState } from "react"
import { useWriteContract } from "wagmi"
import { config } from "./config"

export function DeployContract() {
  const [contractBytecode, setContractBytecode] = useState<string>("")
  const [contractABI, setContractABI] = useState<object>({})

  const handleCompilationComplete = (bytecode: string, abi: object) => {
    setContractBytecode(bytecode)
    setContractABI(abi)
  }
  const { writeContract, data, isSuccess, isPaused, isPending } = useWriteContract({
    config
  })

  console.log({ compiledCode: "" })
  //   const deployContract = () => {
  //     writeContract({
  //       abi: contractABI,
  //       address: ""
  //     })
  //   }
}
