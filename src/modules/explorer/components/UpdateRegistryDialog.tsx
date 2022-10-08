import React, { useState, useMemo } from "react"
import { Grid, DialogContent, TextField, styled } from "@material-ui/core"
import { ErrorText } from "modules/explorer/components/styled/ErrorText"
import { Registry } from "services/contracts/baseDAO"
import * as Yup from "yup"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { BatchBar } from "./BatchBar"
import { ProposalFormInput } from "./ProposalFormInput"

const emptyItem = { key: "", value: "" }

const TextArea = styled(TextField)({
  "& .MuiInputBase-input": {
    textAlign: "left",
    paddingTop: 6
  }
})

export const registryProposalFormInitialState: RegistryProposalFormValues = {
  registryUpdateForm: {
    list: [emptyItem],
    isBatch: false
  }
}

export interface RegistryProposalFormValues {
  registryUpdateForm: {
    list: Registry[]
    isBatch: boolean
  }
}

export const updateRegistryFormSchema = Yup.object().shape({
  registryUpdateForm: Yup.object().shape({
    list: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required("Required")
      })
    )
  })
})

export const UpdateRegistryDialog: React.FC<{ open: boolean }> = ({ open }) => {
  const [activeItem, setActiveItem] = React.useState(1)
  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, touchedFields: touched }
  } = useFormContext<RegistryProposalFormValues>()
  const { fields, append } = useFieldArray({
    control,
    name: "registryUpdateForm.list"
  })
  const values = getValues()
  const [isBatch, setIsBatch] = useState(values.registryUpdateForm.isBatch)

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch)
    setValue("registryUpdateForm.isBatch", !isBatch)
    setActiveItem(1)
  }

  const keyError = (errors?.registryUpdateForm?.list?.[activeItem - 1] as any)?.key
  const valueError = (errors?.registryUpdateForm?.list?.[activeItem - 1] as any)?.value

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
            stateIsBatch={values.registryUpdateForm.isBatch}
            handleIsBatchChange={handleIsBatchChange}
            onClickAdd={() => {
              append(emptyItem)
              setActiveItem(activeItem + 1)
            }}
            items={values.registryUpdateForm.list}
            activeItem={activeItem}
            setActiveItem={(index: number) => setActiveItem(index + 1)}
          />
        </Grid>
        {fields.map(
          (field, index) =>
            index === activeItem - 1 && (
              <>
                <Grid item>
                  <ProposalFormInput label={"Key"}>
                    <Controller
                      key={field.id}
                      name={`registryUpdateForm.list.${activeItem - 1}.key`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="string"
                          InputProps={{ disableUnderline: true }}
                          placeholder="Type a Key"
                        />
                      )}
                    />

                    {keyError && touched.registryUpdateForm?.list?.[activeItem - 1]?.key ? (
                      <ErrorText>{keyError}</ErrorText>
                    ) : null}
                  </ProposalFormInput>
                </Grid>
                <Grid>
                  <ProposalFormInput label={"Value"}>
                    <Controller
                      key={field.id}
                      name={`registryUpdateForm.list.${activeItem - 1}.value`}
                      control={control}
                      render={({ field }) => (
                        <TextArea
                          {...field}
                          multiline
                          type="string"
                          rows={6}
                          placeholder="Type a value"
                          InputProps={{ disableUnderline: true }}
                        />
                      )}
                    />

                    {valueError && touched.registryUpdateForm?.list?.[activeItem - 1]?.value ? (
                      <ErrorText>{valueError}</ErrorText>
                    ) : null}
                  </ProposalFormInput>
                </Grid>
              </>
            )
        )}
      </Grid>
    </DialogContent>
  )
}
