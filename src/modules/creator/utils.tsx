export type FieldChange = { key: string; preventDefault: () => void }

export const handleChange = (event: FieldChange) => {
  return event.key === "-" || event.key === "." || event.key === "," ? event.preventDefault() : null
}

export const handleNegativeInput = (event: FieldChange) => {
  return event.key === "-" || event.key === "," ? event.preventDefault() : null
}
