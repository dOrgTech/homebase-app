import React, { useEffect, useState, useCallback } from "react"
import { Grid, Box, Tooltip, FormField, FormTextArea, FormTextField, Typography } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { getContractDetails } from "modules/etherlink/utils"
import { ethers } from "ethers"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ThemedTabButton } from "components/ui/ThemedTabButton"

export const EvmPropContractCall: React.FC = () => {
  const { network } = useTezos()
  const { daoContractCall, setDaoContractCall } = useEvmProposalOps()
  const [writeMethods, setWriteMethods] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"callData" | "writeMethods" | "computeCallData">("computeCallData")
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [methodInput, setMethodInput] = useState<string>("")
  const [functionSignature, setFunctionSignature] = useState<string>("")
  const [parsedInputs, setParsedInputs] = useState<{ type: string; name: string }[]>([])
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const [calldataError, setCalldataError] = useState<string>("")

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

  const parseFunctionSignature = useCallback((signature: string) => {
    try {
      const match = signature.match(/^(\w+)\((.*)\)$/)
      if (!match) {
        setParsedInputs([])
        return
      }

      const paramsString = match[2].trim()
      if (!paramsString) {
        setParsedInputs([])
        return
      }

      const params: { type: string; name: string }[] = []
      let currentParam = ""
      let bracketDepth = 0
      let paramIndex = 0

      for (let i = 0; i < paramsString.length; i++) {
        const char = paramsString[i]
        if (char === "[") {
          bracketDepth++
          currentParam += char
        } else if (char === "]") {
          bracketDepth--
          currentParam += char
        } else if (char === "," && bracketDepth === 0) {
          const parts = currentParam.trim().split(/\s+/)
          if (parts.length >= 2) {
            params.push({
              type: parts[0],
              name: parts.slice(1).join(" ")
            })
          } else if (parts.length === 1) {
            params.push({
              type: parts[0],
              name: `param${paramIndex}`
            })
          }
          paramIndex++
          currentParam = ""
        } else {
          currentParam += char
        }
      }

      if (currentParam.trim()) {
        const parts = currentParam.trim().split(/\s+/)
        if (parts.length >= 2) {
          params.push({
            type: parts[0],
            name: parts.slice(1).join(" ")
          })
        } else if (parts.length === 1) {
          params.push({
            type: parts[0],
            name: `param${paramIndex}`
          })
        }
      }

      setParsedInputs(params)
      setInputValues({})
    } catch (error) {
      console.error("Error parsing function signature:", error)
      setParsedInputs([])
    }
  }, [])

  const computeCallDataFromSignature = useCallback(() => {
    if (!functionSignature) {
      setCalldataError("")
      return
    }

    try {
      // Build the function ABI from the signature
      const functionName = functionSignature.match(/^(\w+)/)?.[1]
      if (!functionName) {
        setCalldataError("")
        return
      }

      const inputs = parsedInputs.map(input => ({
        type: input.type,
        name: input.name
      }))

      const abi = [
        {
          name: functionName,
          type: "function",
          inputs: inputs,
          outputs: []
        }
      ]

      const iface = new ethers.Interface(abi)

      // Get the values in the correct order
      // Validate that all required inputs have values
      const values = parsedInputs.map(input => {
        const value = inputValues[input.name] || ""
        if (!value) {
          // Don't encode if any input is missing
          return null
        }
        return value
      })

      // Only encode if all inputs have values or if there are no inputs
      if (values.includes(null) && parsedInputs.length > 0) {
        setCalldataError("")
        return
      }

      // Encode the function data
      const callData = iface.encodeFunctionData(
        functionName,
        values.filter(v => v !== null)
      )
      setDaoContractCall("callData", callData)
      setCalldataError("")
    } catch (error) {
      console.error("Error computing callData from signature:", error)
      const errorMessage =
        (error as any)?.message || "Error computing callData. Check your function signature and inputs."
      setCalldataError(errorMessage)
      setDaoContractCall("callData", "")
    }
  }, [functionSignature, parsedInputs, inputValues, setDaoContractCall])

  useEffect(() => {
    parseFunctionSignature(functionSignature)
  }, [functionSignature, parseFunctionSignature])

  useEffect(() => {
    // Debounce the computation to avoid excessive re-encoding
    const timeoutId = setTimeout(() => {
      if (activeTab === "computeCallData") {
        computeCallDataFromSignature()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [activeTab, parsedInputs, inputValues, computeCallDataFromSignature])

  useEffect(() => {
    if (daoContractCall.targetAddress) {
      getContractDetails(daoContractCall.targetAddress, network).then(data => {
        const methods = data?.abi
          ? data.abi.filter((method: any) => method.type === "function" && method.stateMutability === "nonpayable")
          : []
        setWriteMethods(methods || [])
      })
    }
  }, [daoContractCall.targetAddress, network])

  console.log("Write Methods", JSON.stringify(writeMethods, null, 2))

  return (
    <Grid container direction="row" style={{ gap: 18 }}>
      {/* Row 1: Target Contract Address and Value in the same row */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <FormField label="Target Contract Address" labelStyle={{ fontSize: 16 }}>
              <FormTextField
                defaultValue={daoContractCall.targetAddress}
                placeholder="0x..."
                onChange={e => setDaoContractCall("targetAddress", e.target.value)}
                inputProps={{ style: { fontSize: 14 } }}
              />
            </FormField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField label="Value (XTZ)" labelStyle={{ fontSize: 16 }}>
              <FormTextField
                defaultValue={daoContractCall.value}
                placeholder="0"
                type="number"
                onChange={e => setDaoContractCall("value", e.target.value)}
                inputProps={{ style: { fontSize: 14 }, min: 0 }}
              />
            </FormField>
          </Grid>
        </Grid>
      </Grid>
      {/* Row 2: Tabs and Content */}
      <Grid item xs={12}>
        <Box>
          <ThemedTabButton active={activeTab === "computeCallData"} onClick={() => setActiveTab("computeCallData")}>
            Compute CallData
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
          <ThemedTabButton active={activeTab === "callData"} onClick={() => setActiveTab("callData")}>
            CallData
          </ThemedTabButton>
        </Box>

        {activeTab === "callData" && (
          <FormField label="Call Data" labelStyle={{ fontSize: 16 }}>
            <FormTextArea
              defaultValue={daoContractCall.callData}
              placeholder="0x..."
              onChange={e => setDaoContractCall("callData", e.target.value)}
              inputProps={{ style: { fontSize: 14, paddingTop: 12, paddingBottom: 12 } }}
            />
          </FormField>
        )}

        {activeTab === "writeMethods" && (
          <Box display="flex" width="100%">
            <Box style={{ display: "flex", flexDirection: "row", width: "100%", gap: 24 }}>
              <Box style={{ width: "33%" }}>
                <FormField label="Method" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                  <FormTextField
                    select
                    value={selectedMethod}
                    onChange={e => setSelectedMethod(e.target.value as string)}
                    SelectProps={{ native: true }}
                    inputProps={{ style: { fontSize: 14 } }}
                  >
                    <option value="">Select a method</option>
                    {writeMethods.map((method, index) => (
                      <option key={index} value={method.name}>
                        {method.name}
                      </option>
                    ))}
                  </FormTextField>
                </FormField>
              </Box>

              <Box style={{ width: "66%" }}>
                <FormField label="Input" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                  <FormTextField
                    value={methodInput}
                    onChange={e => {
                      setMethodInput(e.target.value)
                      generateCallData()
                    }}
                    inputProps={{ style: { fontSize: 14 } }}
                    placeholder={
                      selectedMethod
                        ? writeMethods
                            .find(method => method.name === selectedMethod)
                            ?.inputs?.map((input: { type: string; name: string }) => `${input.type} ${input.name}`)
                            .join(", ") || "No inputs required"
                        : "Select a method first"
                    }
                  />
                </FormField>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === "computeCallData" && (
          <Box display="flex" flexDirection="column" width="100%" style={{ gap: 16 }}>
            <FormField label="Function to Call" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
              <FormTextField
                value={functionSignature}
                onChange={e => setFunctionSignature(e.target.value)}
                placeholder="e.g., transfer(address to, uint256 amount)"
                inputProps={{ style: { fontSize: 14 } }}
              />
            </FormField>

            {parsedInputs.length > 0 && (
              <Box>
                <Typography style={{ marginBottom: 12, fontSize: 16 }}>Function Arguments</Typography>
                {parsedInputs.map((input, index) => (
                  <Box key={index} style={{ marginBottom: 12 }}>
                    <FormField
                      label={`${input.name} (${input.type})`}
                      labelStyle={{ fontSize: 14 }}
                      containerStyle={{ gap: 8 }}
                    >
                      <FormTextField
                        value={inputValues[input.name] || ""}
                        onChange={e => {
                          setInputValues(prev => ({
                            ...prev,
                            [input.name]: e.target.value
                          }))
                        }}
                        placeholder={`Enter ${input.name}`}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
                  </Box>
                ))}
              </Box>
            )}

            <FormField label="Call Data (Hex)" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
              <FormTextField
                value={daoContractCall.callData}
                placeholder="Complete the inputs to compute calldata"
                disabled
                inputProps={{ style: { fontSize: 14 } }}
              />
              {calldataError && (
                <Typography color="error" style={{ fontSize: 14, marginTop: 8 }}>
                  {calldataError}
                </Typography>
              )}
            </FormField>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}
