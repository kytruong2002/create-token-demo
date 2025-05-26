import React, { useState, createContext, useContext } from 'react'

interface GlobalDataType {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
}

const GlobalDataContext = createContext<GlobalDataType | undefined>(undefined)

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  return (
    <GlobalDataContext.Provider
      value={{
        isLoading,
        setIsLoading,
        title,
        setTitle
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
