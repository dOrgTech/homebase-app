import React, { useState, useMemo } from "react"
import { Grid, styled, Paper, DialogContent, TextField } from "@material-ui/core"
import { useDAONFTHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { ErrorText } from "modules/explorer/components/styled/ErrorText"
import * as Yup from "yup"
import { Autocomplete } from "@material-ui/lab"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { NFT } from "modules/explorer/components/NFT"
import { NFT as NFTModel } from "models/Token"
import { BatchBar } from "./BatchBar"
import { ProposalFormInput } from "./ProposalFormInput"
import { useDAOID } from "../pages/DAO/router"

const AutoCompletePaper = styled(Paper)({
  background: "#24282B"
})

const AutoCompleteField = styled(Autocomplete)({
  "& .MuiInputLabel-root": {
    display: "none"
  },
  "& .MuiAutocomplete-inputRoot": {
    padding: 0
  },
  "& label + .MuiInput-formControl": {
    marginTop: "0"
  },

  '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
    padding: 0
  }
})

const NFTContainer = styled(Grid)({
  maxHeight: 246,
  maxWidth: 272,
  padding: 32,
  boxSizing: "border-box"
})

export interface FormTransferParams {
  recipient: string
  amount: number
  asset?: NFTModel
}

export interface NFTTransferFormValues {
  nftTransferForm: {
    transfers: FormTransferParams[]
    isBatch: boolean
  }
}

export const nftTransferSchema = Yup.object().shape({
  nftTransferForm: Yup.object().shape({
    transfers: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number().required("Required").positive("Should be positive"),
        recipient: Yup.string().required("Required")
      })
    )
  })
})

const emptyTransfer: FormTransferParams = {
  recipient: "",
  amount: 1
}

export const nftTransferFormInitialState: NFTTransferFormValues = {
  nftTransferForm: {
    transfers: [emptyTransfer],
    isBatch: false
  }
}

export const NFTTransferForm: React.FC<{ open: boolean }> = ({ open }) => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, touchedFields: touched }
  } = useFormContext<NFTTransferFormValues>()

  const { fields, append } = useFieldArray({
    control,
    name: "nftTransferForm.transfers"
  })
  const values = getValues()
  const [isBatch, setIsBatch] = useState(values.nftTransferForm.isBatch)
  const [activeTransfer, setActiveTransfer] = React.useState(1)
  const daoId = useDAOID()
  const { nftHoldings } = useDAONFTHoldings(daoId)

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch)
    setValue("nftTransferForm.isBatch", !isBatch)
    setActiveTransfer(1)
  }

  const recipientError = (errors.nftTransferForm?.transfers?.[activeTransfer - 1] as any)?.recipient

  const { transfers } = watch("nftTransferForm")

  const activeAsset = transfers[activeTransfer - 1].asset
  const takenNFTs = transfers.map(t => `${t.asset?.contract}-${t.asset?.token_id}`)

  const nonSelectedNFTs = nftHoldings
    ? nftHoldings.filter(nft => !takenNFTs.includes(`${nft?.token?.contract}-${nft?.token?.token_id}`))
    : []

  const nftOptions = nonSelectedNFTs.map(n => n.token)

  useMemo(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  return (
    <DialogContent>
      <Grid container direction={"column"} style={{ gap: 31 }}>
        <Grid item>
          <BatchBar
            isBatch={isBatch}
            stateIsBatch={values.nftTransferForm.isBatch}
            handleIsBatchChange={handleIsBatchChange}
            onClickAdd={() => {
              append(emptyTransfer)
              setActiveTransfer(activeTransfer + 1)
            }}
            items={values.nftTransferForm.transfers}
            activeItem={activeTransfer}
            setActiveItem={(index: number) => setActiveTransfer(index + 1)}
          />
        </Grid>
        {fields.map(
          (field, index) =>
            index === activeTransfer - 1 && (
              <>
                <ProposalFormInput label={"Recipient"}>
                  <Controller
                    key={field.id}
                    name={`nftTransferForm.transfers.${index}.recipient`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="string"
                        placeholder="Type an Address Here"
                        InputProps={{ disableUnderline: true }}
                      />
                    )}
                  />

                  {recipientError && touched.nftTransferForm?.transfers?.[activeTransfer - 1]?.recipient ? (
                    <ErrorText>{recipientError}</ErrorText>
                  ) : null}
                </ProposalFormInput>
                <ProposalFormInput label={"NFT ID"}>
                  <Grid container direction="column">
                    <Controller
                      key={field.id}
                      name={`nftTransferForm.transfers.${index}.asset`}
                      control={control}
                      render={({ field: { onChange, ...props } }) => (
                        <AutoCompleteField
                          PaperComponent={AutoCompletePaper}
                          options={nftOptions}
                          getOptionLabel={option => `${(option as NFTModel).symbol}#${(option as NFTModel).token_id}`}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Select NFT"
                              InputProps={{ ...params.InputProps, disableUnderline: true }}
                            />
                          )}
                          onChange={(e, data) => onChange(data)}
                          {...props}
                        />
                      )}
                    />
                    {activeAsset && (
                      <Grid item>
                        <Grid container justifyContent="center">
                          <NFTContainer item>
                            <NFT
                              qmHash={activeAsset.artifact_hash}
                              name={activeAsset.name}
                              mediaType={activeAsset.mediaType}
                            />
                          </NFTContainer>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </ProposalFormInput>
              </>
            )
        )}
      </Grid>
    </DialogContent>
  )
}
