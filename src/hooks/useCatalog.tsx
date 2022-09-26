import CatalogContext from 'context/CatalogContext'
import { useContext } from 'react'

function useCatalog() {
  return useContext(CatalogContext)
}

export default useCatalog
