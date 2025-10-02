import React, { useEffect, useState, useCallback } from "react"
import { Grid, Box, Tooltip } from "components/ui"
import { StyledTextField } from "components/ui/StyledTextField"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { getContractDetails } from "modules/etherlink/utils"
import { ethers } from "ethers"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ThemedTabButton } from "components/ui/ThemedTabButton"

import { InputContainer } from "components/ui"

export const EvmPropContractCall: React.FC = () => {
  const { network } = useTezos()
  const { daoContractCall, setDaoContractCall } = useEvmProposalOps()
  const [writeMethods, setWriteMethods] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"callData" | "writeMethods">("callData")
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [methodInput, setMethodInput] = useState<string>("")

  const generateCallData = useCallback(() => {
    if (!selectedMethod || !daoContractCall.targetAddress) return

    try {
      const methodAbi = writeMethods.find(method => method.name === selectedMethod)
      if (!methodAbi) return

      const inputs = methodInput.split(",").map(input => input.trim())
      const iface = new ethers.Interface([methodAbi])

      // Encode function data
      const callData = iface.encodeFunctionData(selectedMethod, inputs)
      setDaoContractCall("callData", callData)
    } catch (error) {
      console.error("Error generating callData:", error)
      alert("Error generating callData. Check your inputs and try again.")
    }
  }, [selectedMethod, daoContractCall.targetAddress, writeMethods, methodInput, setDaoContractCall])

  useEffect(() => {
    if (daoContractCall.targetAddress) {
      getContractDetails(daoContractCall.targetAddress, network).then(data => {
        const methods = data?.abi
          ? data.abi.filter((method: any) => method.type === "function" && method.stateMutability === "nonpayable")
          : []
        setWriteMethods(methods || [])
        console.log({ writeMethods: methods })
      })
    }
  }, [daoContractCall.targetAddress, network])

  console.log("Write Methods", JSON.stringify(writeMethods, null, 2))

  return (
    <InputContainer container spacing={2}>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.targetAddress}
          label="Target Contract Address"
          variant="outlined"
          onChange={e => setDaoContractCall("targetAddress", e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.value}
          label="Value (XTZ)"
          type="number"
          variant="outlined"
          onChange={e => setDaoContractCall("value", e.target.value)}
        />
      </Grid>
      {/* This can be added if we add an option for the user to input the function definition */}
      {/* <Grid item xs={12}>
        <StyledTextField
          fullWidth
          defaultValue={daoContractCall.functionDefinition}
          label="Function JSON Definition"
          multiline
          minRows={3}
          variant="outlined"
          onChange={e => setDaoContractCall("functionDefinition", e.target.value)}
        />
      </Grid> */}

      <Grid item xs={12}>
        <Box>
          <ThemedTabButton active={activeTab === "callData"} onClick={() => setActiveTab("callData")}>
            CallData
          </ThemedTabButton>
          <Tooltip
            title="The contract should be verified by the author on Blockscout"
            disableHoverListener={writeMethods.length > 0}
            arrow
            placement="top"
          >
            <span>
              {" "}
              {/* Wrapper needed for disabled buttons */}
              <ThemedTabButton
                active={activeTab === "writeMethods"}
                disabled={writeMethods.length === 0}
                onClick={() => setActiveTab("writeMethods")}
              >
                Write Methods
              </ThemedTabButton>
            </span>
          </Tooltip>
        </Box>

        {activeTab === "callData" && (
          <StyledTextField
            fullWidth
            defaultValue={daoContractCall.callData}
            label="Call Data"
            multiline
            minRows={3}
            variant="outlined"
            onChange={e => setDaoContractCall("callData", e.target.value)}
          />
        )}

        {activeTab === "writeMethods" && (
          <Box display="flex" width="100%">
            <Box style={{ display: "flex", flexDirection: "row", width: "100%", gap: 10 }}>
              <StyledTextField
                select
                label=""
                value={selectedMethod}
                onChange={e => setSelectedMethod(e.target.value)}
                variant="outlined"
                style={{ width: "33%", marginRight: "10px" }}
                SelectProps={{
                  native: true
                }}
              >
                <option value="">Select a method</option>
                {writeMethods.map((method, index) => (
                  <option key={index} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </StyledTextField>
              <StyledTextField
                label="Input"
                value={methodInput}
                onChange={e => {
                  setMethodInput(e.target.value)
                  generateCallData()
                }}
                variant="outlined"
                style={{ width: "66%" }}
                placeholder={
                  selectedMethod
                    ? writeMethods
                        .find(method => method.name === selectedMethod)
                        ?.inputs?.map((input: { type: string; name: string }) => `${input.type} ${input.name}`)
                        .join(", ") || "No inputs required"
                    : "Select a method first"
                }
              />
            </Box>
          </Box>
        )}
      </Grid>
    </InputContainer>
  )
}
