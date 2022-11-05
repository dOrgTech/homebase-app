import React from "react"
import { BottomSheet as SpringBottomSheet, BottomSheetProps } from "react-spring-bottom-sheet"
import "react-spring-bottom-sheet/dist/style.css"

export const BottomSheet: React.FC<BottomSheetProps> = ({ children, ...props }) => {
  return (
    <SpringBottomSheet
      snapPoints={({ minHeight }) => {
        return minHeight
      }}
      {...props}
    >
      {children}
    </SpringBottomSheet>
  )
}
