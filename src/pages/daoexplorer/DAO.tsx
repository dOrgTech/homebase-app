import React from 'react'
import { useRouteMatch } from 'react-router-dom'

export const DAO = () => {
  const match = useRouteMatch()

  console.log(match)

  return <div>DAO</div>
}