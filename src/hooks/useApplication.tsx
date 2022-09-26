import ApplicationContext from 'context/ApplicationContext'
import { useContext } from 'react'

function useApplication() {
  return useContext(ApplicationContext)
}

export default useApplication
