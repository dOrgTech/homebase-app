import React, { useMemo } from "react"
import { Grid, Typography, styled } from "@mui/material"
import { ethers } from "ethers"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { ShortenedValueField } from "modules/etherlink/components/proposalRenderers/ShortenedValueField"
import { proposalInterfaces } from "modules/etherlink/config"

const Container = styled(ContentContainer)(({ theme }) => ({
  gap: 10,
  padding: "32px 46px",
  [theme.breakpoints.down("lg")]: {
    padding: "18px 25px"
  }
}))

const ActionBox = styled(Grid)({
  border: "1px solid #575757",
  borderRadius: 8,
  padding: 16,
  marginTop: 12,
  gap: 8
})

const Warning = styled(Typography)({
  color: "#ffb74d",
  fontWeight: 600,
  marginTop: 8
})

const Label = styled(Typography)({
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 4
})

interface DecodedAction {
  index: number
  target: string
  value: string
  calldata: string
  selector: string
  functionName?: string
  signature?: string
  args: { name: string; type: string; value: string }[]
}

// Every function signature the app knows how to build, regardless of which
// proposal type it belongs to. Decoding against all of them means the
// description tag cannot decide which calls are shown.
const knownInterfaces: string[] = Array.from(
  new Set(
    proposalInterfaces.flatMap((entry: any) => (Array.isArray(entry.interface) ? (entry.interface as string[]) : []))
  )
)

const decodeAction = (index: number, target: string, value: string, calldata: string): DecodedAction => {
  const data = calldata && calldata.startsWith("0x") ? calldata : `0x${calldata || ""}`
  const selector = data.length >= 10 ? data.slice(0, 10) : data
  const action: DecodedAction = { index, target, value, calldata: data, selector, args: [] }
  if (data.length < 10) return action
  for (const abi of knownInterfaces) {
    try {
      const iface = new ethers.Interface([abi])
      const parsed = iface.parseTransaction({ data })
      if (!parsed) continue
      action.functionName = parsed.name
      action.signature = parsed.signature
      action.args = parsed.fragment.inputs.map((input, i) => ({
        name: input.name || `arg${i}`,
        type: input.type,
        value: String(parsed.args[i])
      }))
      return action
    } catch {
      continue
    }
  }
  return action
}

const formatValue = (value: string, decimals: number) => {
  try {
    return `${ethers.formatUnits(BigInt(value || "0"), decimals)} XTZ`
  } catch {
    return value
  }
}

interface ProposalActionsListProps {
  targets?: string[]
  values?: any[]
  callDataPlain?: string[]
  declaredType?: string
  nativeDecimals?: number
}

/**
 * Lists every call a proposal will make when executed, decoded from the
 * on-chain targets, values and calldata rather than from the proposal's
 * self-declared type. Shown on every on-chain proposal so that a second or
 * third action cannot hide behind a benign first one.
 */
export const ProposalActionsList: React.FC<ProposalActionsListProps> = ({
  targets,
  values,
  callDataPlain,
  declaredType,
  nativeDecimals = 18
}) => {
  const actions = useMemo(() => {
    const list = Array.isArray(targets) ? targets : []
    return list.map((target, i) =>
      decodeAction(i, String(target || ""), String(values?.[i] ?? "0"), String(callDataPlain?.[i] ?? "0x"))
    )
  }, [targets, values, callDataPlain])

  if (actions.length === 0) return null

  const declared = (declaredType || "").toLowerCase()
  const undecoded = actions.filter(a => !a.functionName)
  const warnings: string[] = []
  if (actions.length > 1 && declared !== "batch") {
    warnings.push(`This proposal executes ${actions.length} actions but is labelled "${declaredType}".`)
  }
  if (declared === "offchain") {
    warnings.push("This proposal is labelled as an off-chain debate but carries on-chain actions.")
  }
  if (undecoded.length > 0) {
    warnings.push(
      `${undecoded.length} of ${actions.length} actions call a function this app does not recognise. Review the raw calldata before voting.`
    )
  }

  return (
    <Container container>
      <Grid container>
        <Typography variant="h3" color="textPrimary">
          Actions on execution ({actions.length})
        </Typography>
      </Grid>
      {warnings.map(w => (
        <Warning key={w} variant="body2">
          {w}
        </Warning>
      ))}
      {actions.map(action => (
        <ActionBox container direction="column" key={action.index}>
          <Typography variant="body1" color="textPrimary" style={{ fontWeight: 600 }}>
            Action {action.index + 1}: {action.functionName ? action.signature : `unrecognised call ${action.selector}`}
          </Typography>
          <Grid item>
            <Label color="textPrimary">Target</Label>
            <ShortenedValueField value={action.target} label="Target" />
          </Grid>
          {action.value !== "0" ? (
            <Grid item>
              <Label color="textPrimary">Value</Label>
              <Typography variant="body2" color="textPrimary">
                {formatValue(action.value, nativeDecimals)}
              </Typography>
            </Grid>
          ) : null}
          {action.args.map(arg => (
            <Grid item key={`${action.index}-${arg.name}`}>
              <Label color="textPrimary">
                {arg.name} ({arg.type})
              </Label>
              <ShortenedValueField value={arg.value} label={arg.name} />
            </Grid>
          ))}
          {!action.functionName ? (
            <Grid item>
              <Label color="textPrimary">Calldata</Label>
              <ShortenedValueField value={action.calldata} label="Calldata" />
            </Grid>
          ) : null}
        </ActionBox>
      ))}
    </Container>
  )
}
