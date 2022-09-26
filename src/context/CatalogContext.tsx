import {
  createContext,
  ReactElement,
  useCallback,
  useMemo,
  useState
} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CatalogPackage,
  CatalogPackageVersion
} from 'services/catalog.interface'

interface CatalogContextType {
  getCatalogPackages: CallableFunction
  catalogPackages: CatalogPackage[]
  getCatalogPackageVersionDetails: CallableFunction
  catalogPackageVersion: CatalogPackageVersion | null
  loading: boolean
}

const CatalogContext = createContext<CatalogContextType>(
  {} as CatalogContextType
)

export function CatalogContextProvider({
  children
}: {
  children: ReactElement
}) {
  const [catalogPackages, setCatalogPackages] = useState<CatalogPackage[]>([])
  const [catalogPackageVersion, setCatalogPackageVersion] =
    useState<CatalogPackageVersion | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getCatalogPackages = useCallback(
    async (catalogId: string) => {
      setLoading(true)
      try {
        setCatalogPackages([
          {
            applicationName: 'in labore dolore aute',
            versions: ['Lorem aliquip enim dolore', 'occaecat'],
            description: 'laboris eu',
            maintainer: ['a', 'nisi ea aliqua nostrud'],
            license: 'in proident',
            labels: {
              category: 'irure ex in adipisicing'
            },
            logo: {
              src: 'https://cdn-icons-png.flaticon.com/512/59/59137.png',
              type: 'dolore exercitation est',
              size: 'ullamco cupidatat Ut in'
            }
          },
          {
            applicationName: 'elit',
            versions: ['cupidatat do', 'mollit minim'],
            description: 'ea pariatur',
            maintainer: ['commodo aliqua dolore', 'ad incididunt est'],
            license: 'et non qui consectetur',
            labels: {
              category: 'do ea sint nulla'
            },
            logo: {
              src: 'https://cdn-icons-png.flaticon.com/512/59/59137.png',
              type: 'commodo in Duis velit',
              size: 'tempor la'
            }
          }
        ])
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        const error =
          err?.response && err?.response?.data?.Message
            ? err?.response?.data?.Message
            : err.message
        toast.error(`${error}`)
      }
    },
    [setCatalogPackages]
  )

  const getCatalogPackageVersionDetails = useCallback(
    async (catalogId: string, packageName: string, version: string) => {
      setLoading(true)
      try {
        setCatalogPackageVersion({
          applicationName: 'culpa incididunt deserunt qui',
          description: 'commodo occaecat fugiat',
          maintainer: ['ut Lorem enim dolore', 'dolore'],
          license: 'ut Lorem quis',
          labels: {
            category: 'sit proident nostrud dolore sunt'
          },
          version: 'ut officia',
          logo: {
            src: 'https://cdn-icons-png.flaticon.com/512/59/59137.png',
            type: 'ut esse',
            size: 'qui'
          },
          definitions: {
            type: 'object',
            additionalProperties: {
              type: 'string'
            }
          }
        })
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        const error =
          err?.response && err?.response?.data?.Message
            ? err?.response?.data?.Message
            : err.message
        toast.error(`${error}`)
      }
    },
    [setCatalogPackageVersion]
  )

  const value = useMemo<CatalogContextType>(
    () => ({
      getCatalogPackages,
      catalogPackages,
      getCatalogPackageVersionDetails,
      catalogPackageVersion,
      loading
    }),
    [
      getCatalogPackages,
      catalogPackages,
      getCatalogPackageVersionDetails,
      catalogPackageVersion,
      loading
    ]
  )

  return (
    <CatalogContext.Provider value={value}>
      {children}
      <ToastContainer />
    </CatalogContext.Provider>
  )
}

export default CatalogContext
