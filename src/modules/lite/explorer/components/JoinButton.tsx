import React, { useEffect, useState } from "react"
import { Button, styled, Typography } from "@material-ui/core"
import { useIsMembers } from "../hooks/useIsMember"
import { useNotification } from "modules/common/hooks/useNotification"
import { Community } from "models/Community"
import { getSignature, hasTokenBalance } from "services/lite/utils"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useCommunityToken } from "../hooks/useCommunityToken"

const CustomButton = styled(Button)(({ theme }) => ({
  "width": 67,
  "height": 34,
  ".MuiButton-containedSecondary:hover": {
    backgroundColor: `${theme.palette.secondary.main} !important`
  }
}))

interface JoinButtonProps {
  account: string
  setIsUpdated?: any
  community: Community | undefined
}

export const JoinButton: React.FC<JoinButtonProps> = ({ account, setIsUpdated, community }) => {
  const isMember = useIsMembers(account, community?.members)
  const [hover, setHover] = useState(false)
  const openNotification = useNotification()
  const { network, wallet } = useTezos()
  const token = useCommunityToken(community?._id)

  const joinCommunity = async () => {
    try {
      if (await hasTokenBalance(network, account, community?.tokenAddress)) {
        if (!wallet) {
          return
        }

        const { signature, payloadBytes } = await getSignature(
          account,
          wallet,
          JSON.stringify({ address: account, dao: community?.name, daoId: community?._id })
        )
        const publicKey = (await wallet?.client.getActiveAccount())?.publicKey
        if (!signature) {
          openNotification({
            message: `Issue with Signature`,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }

        await fetch(`${process.env.REACT_APP_API_URL}/daos/join`, {
          method: "POST",
          body: JSON.stringify({
            signature,
            publicKey,
            payloadBytes
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(resp => {
          if (resp.ok) {
            setIsUpdated(Math.random())
            openNotification({
              message: `You just ${!isMember ? "joined" : "left"} ${community?.name}!`,
              autoHideDuration: 3000,
              variant: "info"
            })
          } else {
            openNotification({
              message: `Something went wrong!!`,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }
        })
      } else {
        openNotification({
          message: `To join ${community?.name} your balance of ${token?.symbol} must be more than zero!`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }
    } catch (error) {
      openNotification({
        message: `Something went wrong!!`,
        autoHideDuration: 3000,
        variant: "error"
      })
      return
    }
  }

  return (
    <CustomButton
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      variant="contained"
      color={!isMember ? "secondary" : "inherit"}
      size="small"
      onClick={e => {
        joinCommunity()
        if (!e) {
          const e = window.event
          if (e) {
            e.cancelBubble = true
          }
        }
        if (e.stopPropagation) e.stopPropagation()
      }}
    >
      {isMember && hover ? "Leave" : isMember && !hover ? "Joined" : !isMember ? "Join" : ""}
    </CustomButton>
  )
}
