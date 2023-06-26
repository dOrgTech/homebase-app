import React, { useMemo, useState, useEffect } from "react"
import {
  Grid,
  styled,
  Typography,
  Paper,
  DialogContent,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { ErrorText } from "modules/explorer/components/styled/ErrorText"
import * as Yup from "yup"
import BigNumber from "bignumber.js"
import { Autocomplete } from "@material-ui/lab"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance"
import { Token } from "models/Token"
import { ProposalFormInput } from "./ProposalFormInput"
import { BatchBar } from "./BatchBar"
import { useDAOID } from "../pages/DAO/router"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"

export type Asset = Token | { symbol: "XTZ" }

const AmountText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: 16,
  lineHeight: "146.3%",
  marginRight: 10,
  fontWeight: 300
}))

const DAOBalanceText = styled(Typography)({
  color: "#ffff",
  lineHeight: "100%",
  marginRight: 10
})

const CustomErrorText = styled(ErrorText)({
  textTransform: "capitalize"
})

const AutoCompletePaper = styled(Paper)({
  background: "#24282B"
})

const AmountContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0
  }
}))

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

const CustomLabelContainer = styled(Grid)({
  marginBottom: 18
})

const CustomMaxLabel = styled(Typography)({
  fontSize: 16,
  paddingBottom: 5,
  textDecoration: "underline",
  textUnderlineOffset: 6,
  cursor: "pointer"
})

const DaoBalance = styled(Grid)({
  height: 20
})

const CurrentAsset = styled(Typography)({
  opacity: 0.7
})

export interface FormTransferParams {
  recipient: string
  amount: number
  asset?: Asset
}

export interface TreasuryProposalFormValues {
  transferForm: {
    transfers: FormTransferParams[]
    isBatch: boolean
  }
}

export const treasuryProposalFormSchema = Yup.object().shape({
  transferForm: Yup.object().shape({
    transfers: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number().required("Required").positive("Should be positive"),
        recipient: Yup.string().required("Required")
      })
    )
  })
})

const emptyTransfer = {
  recipient: "",
  amount: 0
}

export const treasuryProposalFormInitialState: TreasuryProposalFormValues = {
  transferForm: {
    transfers: [emptyTransfer],
    isBatch: false
  }
}

export const NewTreasuryProposalDialog: React.FC<{ open: boolean }> = ({ open }) => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, touchedFields: touched }
  } = useFormContext<TreasuryProposalFormValues>()

  const { fields, append } = useFieldArray({
    control,
    name: "transferForm.transfers"
  })
  const values = getValues()
  const [isBatch, setIsBatch] = useState(values.transferForm.isBatch)

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const [activeTransfer, setActiveTransfer] = React.useState(1)
  const daoId = useDAOID()
  const { data: daoData, ledger } = useDAO(daoId)
  const dao = daoData as LambdaDAO | undefined
  const { tokenHoldings: daoHoldings } = useDAOHoldings(daoId)
  const { data: tezosBalance } = useTezosBalance(daoId)

  const [showMax, setShowMax] = React.useState<boolean>(false)
  const [max, setMax] = React.useState(0)
  const [index, setIndex] = React.useState(0)

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch)
    setValue("transferForm.isBatch", !isBatch)
    setActiveTransfer(1)
  }

  const recipientError = (errors.transferForm?.transfers?.[activeTransfer - 1] as any)?.recipient
  const amountError = (errors.transferForm?.transfers?.[activeTransfer - 1] as any)?.amount
  const assetsError = (errors.transferForm?.transfers?.[activeTransfer - 1] as any)?.asset

  const { transfers } = watch("transferForm")

  const currentTransfer = transfers[activeTransfer - 1]

  const daoAssets = daoHoldings
    ? [...daoHoldings, { balance: tezosBalance || new BigNumber(0), token: { symbol: "XTZ" } }]
    : []

  const assetOptions = daoAssets.filter(a => a.token.symbol).map(a => a.token)
  const currentAssetBalance = daoAssets.find(asset =>
    currentTransfer !== undefined ? asset.token.symbol === currentTransfer.asset?.symbol : null
  )

  useMemo(() => {
    if (!open) {
      setMax(0)
      setShowMax(false)
      reset()
    }
  }, [open, reset])

  useEffect(() => {
    let result = 0
    if (currentTransfer !== undefined && currentTransfer.asset?.symbol.toString() !== "XTZ") {
      result =
        (currentAssetBalance ? currentAssetBalance?.balance.toNumber() : 0) -
        (ledger && ledger[0] ? ledger[0].staked.toNumber() : 0)
    } else {
      result = currentAssetBalance ? currentAssetBalance?.balance.toNumber() : 0
    }
    setMax(result)
  }, [index, setValue, max, currentAssetBalance, currentTransfer, ledger])

  return (
    <DialogContent style={{ paddingBottom: 29, paddingTop: 24 }}>
      <Grid container direction={"column"} style={{ gap: 31 }}>
        <Grid item>
          <BatchBar
            isBatch={isBatch}
            stateIsBatch={values.transferForm.isBatch}
            handleIsBatchChange={handleIsBatchChange}
            onClickAdd={() => {
              append(emptyTransfer)
              setActiveTransfer(activeTransfer + 1)
            }}
            items={values.transferForm.transfers}
            activeItem={activeTransfer}
            setActiveItem={(index: number) => setActiveTransfer(index + 1)}
          />
        </Grid>
        {fields.map(
          (field, index) =>
            index === activeTransfer - 1 && (
              <>
                <Grid container direction="column">
                  <ProposalFormInput label={"Recipient"}>
                    <Controller
                      key={field.id}
                      name={`transferForm.transfers.${index}.recipient`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="string"
                          InputProps={{ disableUnderline: true }}
                          placeholder="Type an Address Here"
                        />
                      )}
                    />
                  </ProposalFormInput>
                  {recipientError && errors.transferForm?.transfers?.[activeTransfer - 1]?.recipient ? (
                    <CustomErrorText>{recipientError.type}</CustomErrorText>
                  ) : null}
                </Grid>
                <Grid container style={{ gap: 26 }}>
                  <Grid item xs={isMobileSmall ? 12 : 6}>
                    <ProposalFormInput label={"Asset"}>
                      <Controller
                        key={field.id}
                        name={`transferForm.transfers.${index}.asset`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, ...props } }) => (
                          <AutoCompleteField
                            options={assetOptions || []}
                            PaperComponent={AutoCompletePaper}
                            getOptionLabel={option =>
                              (
                                option as
                                  | Token
                                  | {
                                      symbol: string
                                    }
                              ).symbol
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                InputProps={{
                                  ...params.InputProps,
                                  disableUnderline: true
                                }}
                                label="Select asset"
                              />
                            )}
                            onChange={(e, data) => {
                              data !== null ? setShowMax(true) : setShowMax(false)
                              setValue(`transferForm.transfers.${index}.amount`, 0)
                              onChange(data)
                              setIndex(index)
                            }}
                            {...props}
                          />
                        )}
                      />
                    </ProposalFormInput>
                    {assetsError && errors.transferForm?.transfers?.[activeTransfer - 1]?.asset ? (
                      <CustomErrorText>{assetsError.type}</CustomErrorText>
                    ) : null}
                  </Grid>

                  <Grid item xs={isMobileSmall ? 12 : true}>
                    <CustomLabelContainer container direction="row" item justifyContent="space-between">
                      <Typography>{"Amount"}</Typography>
                      {showMax ? (
                        <CustomMaxLabel
                          color="secondary"
                          onClick={() => {
                            setValue(`transferForm.transfers.${index}.amount`, max)
                          }}
                        >
                          Use Max
                        </CustomMaxLabel>
                      ) : null}
                    </CustomLabelContainer>
                    <ProposalFormInput>
                      <Controller
                        key={field.id}
                        name={`transferForm.transfers.${index}.amount`}
                        control={control}
                        rules={{
                          validate: () => {
                            return getValues(`transferForm.transfers.${index}.amount`) > 0
                          }
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="tel"
                            placeholder="0"
                            InputProps={{
                              inputProps: {
                                step: 0.01,
                                min: dao && dao.data.extra.min_xtz_amount,
                                max: dao && dao.data.extra.max_xtz_amount
                              },
                              disableUnderline: true,
                              endAdornment: (
                                <InputAdornment position="start">
                                  <CurrentAsset color="textPrimary" variant="subtitle2">
                                    {" "}
                                    {values.transferForm.transfers[activeTransfer - 1].asset?.symbol || "-"}
                                  </CurrentAsset>
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </ProposalFormInput>
                    {amountError && errors.transferForm?.transfers?.[activeTransfer - 1]?.amount ? (
                      <ErrorText>{"Must be greater than zero"}</ErrorText>
                    ) : null}
                  </Grid>
                  <DaoBalance container direction="row" alignItems="center">
                    <Grid item>
                      <DAOBalanceText variant="subtitle2">DAO Balance:</DAOBalanceText>
                    </Grid>
                    <Grid item>
                      {daoAssets ? (
                        <AmountContainer item container direction="row" justifyContent="flex-end">
                          {currentAssetBalance !== undefined &&
                          currentTransfer !== undefined &&
                          currentTransfer.asset?.symbol.toString() !== "XTZ" ? (
                            <AmountText>
                              {(
                                (currentAssetBalance ? currentAssetBalance?.balance.toNumber() : 0) -
                                (ledger && ledger[0] ? ledger[0].staked.toNumber() : 0)
                              ).toString() || "-"}
                            </AmountText>
                          ) : currentAssetBalance !== undefined && currentTransfer !== undefined ? (
                            <AmountText>{currentAssetBalance?.balance.toString() || "-"}</AmountText>
                          ) : null}
                          <AmountText>
                            {(currentTransfer !== undefined && currentTransfer.asset?.symbol.toString()) || "-"}
                          </AmountText>
                        </AmountContainer>
                      ) : null}
                    </Grid>
                  </DaoBalance>
                </Grid>
              </>
            )
        )}
      </Grid>
    </DialogContent>
  )
}
