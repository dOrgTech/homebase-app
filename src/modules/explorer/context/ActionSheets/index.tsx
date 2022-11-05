import React, { useCallback, useContext, useEffect } from "react"
import { createContext, useState } from "react"
import { UserMenuSheet } from "../../components/UserMenuSheet"
import { NetworkSheet } from "../../components/NetworkSheet"

export enum ActionSheet {
  None,
  UserMenu,
  Network
}

interface ActionSheetContextState {
  openedModal: ActionSheet
  setOpenedModal: React.Dispatch<React.SetStateAction<ActionSheet>>
  onClose: () => void
}

export const ActionSheetContext = createContext<ActionSheetContextState>(null as any)

export const ActionSheetProvider: React.FC = ({ children }) => {
  const [openedModal, setOpenedModal] = useState<ActionSheet>(ActionSheet.None)
  const onClose = useCallback(() => {
    setOpenedModal(ActionSheet.None)
  }, [])

  useEffect(() => {
    if (openedModal === ActionSheet.None) {
      console.log("ALL CLOSED")
    }
  }, [openedModal])

  return (
    <ActionSheetContext.Provider value={{ openedModal, setOpenedModal, onClose }}>
      {children}
      <UserMenuSheet open={ActionSheet.UserMenu === openedModal} onClose={onClose} />
      <NetworkSheet open={ActionSheet.Network === openedModal} onClose={onClose} />
    </ActionSheetContext.Provider>
  )
}

export const useActionSheet = (actionSheet: ActionSheet) => {
  const contextValue = useContext(ActionSheetContext)

  return {
    open: () => contextValue.setOpenedModal(actionSheet),
    close: contextValue.onClose
  }
}
