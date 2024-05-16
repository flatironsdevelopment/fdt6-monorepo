'use client'

import React, { Dispatch, SetStateAction, useContext, useState } from 'react'

export type State = {
  sidebarClosed: boolean
  setSidebarClosed: Dispatch<SetStateAction<boolean>>
}

const GeneralDataContext = React.createContext<State>({} as State)

export const GeneralDataContextProvider = ({ children }: any) => {
  const [sidebarClosed, setSidebarClosed] = useState<boolean>(true)

  const value = {
    sidebarClosed,
    setSidebarClosed
  }

  return (
    <GeneralDataContext.Provider value={value}>
      {children}
    </GeneralDataContext.Provider>
  )
}

export const useGeneralData = () => {
  const context = useContext(GeneralDataContext)
  if (typeof context === 'undefined') {
    throw new Error('useGeneralData must be used within a GeneralDataContext')
  }
  return context
}
