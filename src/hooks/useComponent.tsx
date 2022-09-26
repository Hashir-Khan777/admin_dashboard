import ComponentContext from 'context/ComponentContext'
import { useContext } from 'react'

function useComponent() {
  return useContext(ComponentContext)
}

export default useComponent
