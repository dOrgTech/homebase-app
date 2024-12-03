import React from "react"
import assertNever from "assert-never"
import { Field, FieldArray, FieldProps, Form, Formik, useFormikContext } from "formik"
import type { token, tokenMap, tokenValueType } from "../../../../services/aci"
import { showName, getFieldName, allocateNewTokenCounter } from "../../../../services/aci"
import { styled, Typography } from "@material-ui/core"
import { ProposalFormInput } from "../ProposalFormInput"
import { Button } from "components/ui/Button"

const Title = styled(Typography)({
  fontSize: 18,
  fontWeight: 450
})

function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function RenderItem({
  token: token,
  showTitle: showTitle
}: React.PropsWithoutRef<{
  token: token
  showTitle: boolean
}>) {
  // debugger
  const { setFieldValue, getFieldProps } = useFormikContext<Record<string, tokenValueType>>()
  const counter: number = getFieldProps("counter").value
  const fieldName = getFieldName(token.counter)
  const fieldValue: tokenValueType = getFieldProps(fieldName).value

  try {
    switch (token.type) {
      case "bls12_381_fr":
      case "bls12_381_g1":
      case "bls12_381_g2":
      case "chain_id":
      case "key_hash":
      case "key":
      case "bytes":
      case "address":
      case "signature":
      case "string":
      case "contract":
      case "int":
      case "nat":
      case "mutez":
      case "timestamp":
      case "sapling_transaction_deprecated":
      case "sapling_transaction":
      case "sapling_state":
        return RenderInputField(token, fieldName, showTitle)
      case "never":
      case "unit":
        return RenderConstant(token, showTitle)
      case "bool":
        return RenderCheckbox(token, fieldName, fieldValue, showTitle)
      case "or":
        return RenderSelection(token, fieldName, fieldValue, showTitle)
      case "set":
      case "list":
        return RenderArray(token, fieldName, fieldValue, showTitle, counter, setFieldValue)
      case "pair":
        return RenderPair(token, showTitle)
      case "map":
        return RenderMap(token, fieldName, fieldValue, showTitle, counter, setFieldValue)
      case "option":
        return RenderOption(token, fieldName, fieldValue, showTitle)
      case "lambda":
        return RenderLambda(token, fieldName, showTitle)
      case "ticket_deprecated":
      case "ticket":
      case "operation":
      case "chest":
      case "chest_key":
      case "tx_rollup_l2_address":
      case "constant":
      case "big_map":
        return RenderNonsupport(token)
      default:
        return assertNever(token.type)
    }
  } catch (e) {
    return null
    // return renderError((e as Error).message, true)
  }
}

function RenderInputField(token: token, fieldName: string, showTitle: boolean) {
  return (
    <div style={{ marginTop: "10px" }}>
      <ProposalFormInput label={showTitle ? showName(token.type, token.name) : ""}>
        <Field
          as="input"
          className=""
          placeholder={token.placeholder}
          rows={10}
          name={fieldName}
          validate={token.validate}
          style={{ width: "100%", color: "#fff", background: "transparent", outline: 0, border: 0, fontSize: "18px" }}
        />
      </ProposalFormInput>
      {/* <ErrorMessage name={fieldName} /> */}
    </div>
  )
}

function RenderConstant(token: token, showTitle: boolean) {
  return (
    <div className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
      <label
        className="text-white"
        style={{
          fontFamily: "Roboto Flex"
        }}
      >
        {showTitle && showName(token.type, token.name)}
      </label>
      <div className="md:text-md text-while relative h-fit min-h-fit w-full rounded p-2">
        <p>{capitalizeFirstLetter(token.type)}</p>
      </div>
    </div>
  )
}

// This can be improved with material checkbox
function RenderCheckbox(token: token, fieldName: string, values: tokenValueType, showTitle: boolean) {
  if (typeof values !== "boolean") {
    throw new Error("internal error: the value of bool is incorrect")
  } else {
    return (
      <div className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
        <label className="text-white">{showTitle && showName(token.type, token.name)}</label>
        <div>
          <Field
            style={{
              fontFamily: "Roboto Flex",
              color: "#fff",
              background: "transparent",
              outline: 0,
              border: 0,
              fontSize: "18px",
              marginTop: "10px"
            }}
            className="rounded p-2 text-left text-black"
            name={fieldName}
            type="checkbox"
          />{" "}
          {capitalizeFirstLetter(`${values}`)}
        </div>
      </div>
    )
  }
}

function RenderArray(
  token: token,
  fieldName: string,
  elements: tokenValueType,
  showTitle: boolean,
  counter: number,
  setFieldValue: (field: string, value: tokenValueType, shouldValidate?: boolean | undefined) => void
) {
  if (!Array.isArray(elements)) {
    throw new Error("internal error: the value of array is incorrect")
  }
  return (
    <div
      className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid rgba(255, 255, 255, 0.4)",
        gap: "18",
        borderRadius: "0.25rem",
        padding: "10px",
        marginTop: "10px",
        marginBottom: "10px"
      }}
    >
      <label
        className="text-white"
        style={{
          fontFamily: "Roboto Flex",
          marginBottom: "8px"
        }}
      >
        {showTitle && showName(token.type, token.name)}
      </label>
      <FieldArray name={fieldName}>
        {({ push, pop }) => {
          return (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                borderRadius: "0.25rem",
                border: "2px solid",
                padding: "1rem"
              }}
            >
              {elements &&
                elements.map((v, idx) => {
                  if (!("counter" in v)) {
                    throw new Error("internal error: the value of array is incorrect")
                  }
                  return (
                    <div key={idx} className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
                      <RenderItem token={v} showTitle={false} />
                    </div>
                  )
                })}
              <div className="mt-2 flex flex-col space-y-4 md:flex-row md:space-y-0">
                {elements && elements.length > 0 && (
                  <Button
                    type="button"
                    className={
                      "mx-none block self-center justify-self-end rounded bg-primary p-1.5 font-medium text-white hover:bg-red-500 hover:outline-none focus:bg-red-500 md:mx-auto md:self-end"
                    }
                    onClick={e => {
                      e.preventDefault()
                      pop()
                    }}
                  >
                    Remove
                  </Button>
                )}
                <Button
                  type="button"
                  className="mx-none block self-center justify-self-end rounded bg-primary p-1.5 font-medium text-white hover:bg-red-500 hover:outline-none focus:bg-red-500 md:mx-auto md:self-end"
                  onClick={e => {
                    e.preventDefault()
                    const new_counter = allocateNewTokenCounter(token, counter, setFieldValue)
                    setFieldValue("counter", new_counter)
                    push(token.children[0])
                  }}
                >
                  Add item
                </Button>
              </div>
            </div>
          )
        }}
      </FieldArray>
    </div>
  )
}

function RenderPair(token: token, showTitle: boolean) {
  return (
    <div className="flex w-full flex-col gap-2 rounded">
      <label
        className="text-white"
        style={{
          fontFamily: "Roboto Flex"
        }}
      >
        {showTitle && showName(token.type, token.name)}
      </label>
      {
        <div
          className="flex w-full flex-col gap-2 rounded border-2 p-4"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            gap: "0.5rem",
            borderRadius: "0.25rem",
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px"
          }}
        >
          {token.children.map((v, idx) => {
            return (
              <div key={idx} className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
                <RenderItem token={v} showTitle={true} />
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}

function RenderOption(token: token, fieldName: string, value: tokenValueType, showTitle: boolean) {
  if (typeof value !== "string") {
    throw new Error("internal error: the value of option is incorrect")
  }
  return (
    <div className="flex w-full flex-col gap-2 rounded">
      <label
        className="text-white"
        style={{
          fontFamily: "Roboto Flex"
        }}
      >
        {showTitle && showName(token.type, token.name)}
      </label>
      <Field className="rounded p-2 text-left text-black" name={fieldName} as="select">
        <option className="text-black" key="1" value="none">
          None
        </option>
        <option className="text-black" key="2" value="some">
          Some
        </option>
      </Field>
      {value == "some" ? <RenderItem token={token.children[0]} showTitle={true} /> : <div></div>}
    </div>
  )
}

function RenderLambda(token: token, fieldName: string, showTitle: boolean) {
  return (
    <div className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
      <label className="text-white">{showTitle && showName(token.type, token.name)}</label>
      <Field
        as="textarea"
        className="md:text-md relative h-fit min-h-fit w-full rounded p-2 text-black"
        placeholder={token.placeholder}
        rows={10}
        name={fieldName}
        validate={token.validate}
      />
      {/* <ErrorMessage name={fieldName} /> */}
    </div>
  )
}

function RenderNonsupport(token: token) {
  return (
    <div className="flex w-full flex-col gap-2 rounded border-2 p-4">
      {`Type, ${token.type}, isn't supported as a user input`}
    </div>
  )
}

function RenderMap(
  token: token,
  fieldName: string,
  elements: tokenValueType,
  showTitle: boolean,
  counter: number,
  setFieldValue: (field: string, value: tokenValueType, shouldValidate?: boolean | undefined) => void
) {
  if (!Array.isArray(elements)) {
    throw new Error("internal: the value of array is incorrect")
  }
  return (
    <div className="flex w-full flex-col gap-2 rounded">
      <label
        className="text-white"
        style={{
          fontFamily: "Roboto Flex"
        }}
      >
        {showTitle && showName(token.type, token.name)}
      </label>
      <FieldArray name={fieldName}>
        {({ push, pop }) => {
          return (
            <div className="flex w-full flex-col gap-2 rounded border-2 p-4">
              {elements &&
                elements.map((element, idx) => {
                  if ("counter" in element) {
                    throw new Error("internal error: the value of array is incorrect")
                  }
                  return (
                    <div key={idx} className="mt-1 grid w-full grid-flow-row grid-cols-1 gap-2">
                      <RenderItem token={element.key} showTitle={true} />
                      <RenderItem token={element.value} showTitle={true} />
                    </div>
                  )
                })}
              <div className="mt-2 flex flex-col space-y-4 md:flex-row md:space-y-0">
                {elements && elements.length > 0 && (
                  <button
                    type="button"
                    className={
                      "mx-none block self-center justify-self-end rounded bg-primary p-1.5 font-medium text-white hover:bg-red-500 hover:outline-none focus:bg-red-500 md:mx-auto md:self-end"
                    }
                    onClick={e => {
                      e.preventDefault()
                      pop()
                    }}
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  className="mx-none block self-center justify-self-end rounded bg-primary p-1.5 font-medium text-white hover:bg-red-500 hover:outline-none focus:bg-red-500 md:mx-auto md:self-end"
                  onClick={e => {
                    e.preventDefault()

                    const new_counter = allocateNewTokenCounter(token, counter, setFieldValue)
                    const child: tokenMap = {
                      key: token.children[0],
                      value: token.children[1]
                    }
                    push(child)
                    setFieldValue("counter", new_counter)
                  }}
                >
                  Add item
                </button>
              </div>
            </div>
          )
        }}
      </FieldArray>
    </div>
  )
}

function RenderSelection(token: token, fieldName: string, selected: tokenValueType, showTitle: boolean) {
  const { setFieldValue, setFieldError } = useFormikContext()

  const defaultChildToken = token.children.length > 0 ? token.children[0] : undefined
  const childToken =
    token.children.find(x => {
      return selected && x.name == selected
    }) || defaultChildToken

  // console.log("OldSelectToken", token)

  return (
    <div>
      <Title color="textPrimary">{showTitle && showName(token.type, token.name)}</Title>
      <Field name={fieldName}>
        {({ field }: FieldProps) => (
          <ProposalFormInput>
            <select
              {...field}
              className="rounded p-2 text-left text-black"
              onChange={e => {
                field.onChange(e)
                if (!childToken) return

                setFieldError(getFieldName(childToken.counter), undefined)
              }}
              style={{
                width: "100%",
                padding: "17px",
                background: "transparent",
                color: "white",
                fontSize: "18px",
                outline: 0,
                border: 0
              }}
            >
              {Object.entries(token.children).map(([k, v]) => {
                return (
                  <option className="text-black" key={k} value={v.name}>
                    {v.name}
                  </option>
                )
              })}
            </select>
          </ProposalFormInput>
        )}
      </Field>
      {childToken ? <RenderItem token={childToken} showTitle={false} /> : <div></div>}
    </div>
  )

  // return (
  //   <div className="flex w-full flex-col gap-2 rounded">
  //     <label className="text-white">{showTitle && showName(token.type, token.name)}</label>
  //     <Field name={fieldName}>
  //       {({ field }: FieldProps) => (
  //         <select
  //           {...field}
  //           className="rounded p-2 text-left text-black"
  //           onChange={e => {
  //             field.onChange(e)
  //             if (!childToken) return

  //             setFieldError(getFieldName(childToken.counter), undefined)
  //           }}
  //         >
  //           {Object.entries(token.children).map(([k, v]) => {
  //             return (
  //               <option className="text-black" key={k} value={v.name}>
  //                 {v.name}
  //               </option>
  //             )
  //           })}
  //         </select>
  //       )}
  //     </Field>
  //     {childToken ? <RenderItem token={childToken} showTitle={false} /> : <div></div>}
  //   </div>
  // )
}

export {
  RenderInputField,
  RenderConstant,
  RenderCheckbox,
  RenderArray,
  RenderPair,
  RenderMap,
  RenderOption,
  RenderLambda,
  RenderNonsupport,
  RenderItem,
  RenderSelection
}
