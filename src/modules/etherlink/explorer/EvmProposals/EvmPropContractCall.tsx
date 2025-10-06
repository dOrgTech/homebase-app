import React, { useEffect, useState, useCallback } from "react"
import { Grid, Box, Tooltip, FormField, FormTextArea, FormTextField } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { getContractDetails } from "modules/etherlink/utils"
import { ethers } from "ethers"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ThemedTabButton } from "components/ui/ThemedTabButton"

// Using FormField wrappers to match Tezos input styling

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
    <Grid container direction="column" style={{ gap: 18 }}>
      <Grid item xs={12}>
        <FormField label="Target Contract Address" labelStyle={{ fontSize: 16 }}>
          <FormTextField
            defaultValue={daoContractCall.targetAddress}
            placeholder="0x..."
            onChange={e => setDaoContractCall("targetAddress", e.target.value)}
            inputProps={{ style: { fontSize: 14 } }}
          />
        </FormField>
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  )
}
