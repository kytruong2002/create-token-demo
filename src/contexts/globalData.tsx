import React, { useState, createContext, useContext } from 'react'

interface GlobalDataType {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalDataContext = createContext<GlobalDataType | undefined>(undefined)

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <GlobalDataContext.Provider
      value={{
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalDataContext = () => {
  const context = useContext(GlobalDataContext)
  if (!context) {
    throw new Error('useGlobalDataContext must be used within a GlobalDataProvider')
  }
  return context
}
