import React, { useEffect } from "react"
import { Grid, Box, CircularProgress } from "components/ui"

import { TitleBlock } from "modules/common/TitleBlock"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

export const EvmDaoTemplate = (): JSX.Element => {
  const { setFieldValue, next } = useEvmDaoCreateStore()

  // Auto-select "full" template and advance to next step
  useEffect(() => {
    setFieldValue("template", "full")
    // Small delay to ensure state is set before navigating
    const timer = setTimeout(() => {
      next.handler()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Show loading state while auto-advancing
  return (
    <Box>
      <TitleBlock title={"DAO Creator"} description={"Loading..."} />
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
        <CircularProgress color="secondary" />
      </Grid>
    </Box>
  )
}
