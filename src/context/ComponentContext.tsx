import Axios from 'axios'
import {
  createContext,
  ReactElement,
  useCallback,
  useMemo,
  useState
} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { component } from 'services/component.interface'

interface ComponentContextType {
  getComponentById: CallableFunction
  component: component | null
  getComponentYamlFile: CallableFunction
  componentYamlFile: any
  updateComponentYamlFile: CallableFunction
  loading: boolean
  getCumulativeCostOfComponent: CallableFunction
  componentCost: any[]
}

const ComponentContext = createContext<ComponentContextType>(
  {} as ComponentContextType
)

export function ComponentContextProvider({
  children
}: {
  children: ReactElement
}) {
  const [component, setComponent] = useState<component | null>(null)
  const [componentYamlFile, setComponentYamlFile] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [componentCost, setComponentCost] = useState<any>({})

  const getComponentById = useCallback(
    async (componentId: string) => {
      setLoading(true)
      try {
        setComponent({
          _type: 'component',
          componentType: 'wordpress',
          id: 'wordpress-site',
          name: 'wordpress-site',
          properties: {
            image: 'bitnami/wordpress:5.8.1',
            port: 8080
          },
          traits: [
            {
              properties: {
                domain: 'localhost',
                http: {
                  '/': 8080
                }
              },
              type: 'ingress'
            },
            {
              properties: {
                replicas: 1
              },
              type: 'scaler'
            }
          ],
          status: {
            status: 'Running',
            healthy: true,
            message: 'Ready:1/1',
            event: ''
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
    [setComponent]
  )

  const getComponentYamlFile = useCallback(
    async (componentId: string) => {
      setLoading(true)
      try {
        const { data } = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/components/${componentId}/yaml`,
          {
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY || ''
            }
          }
        )
        setComponentYamlFile(data)
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        // const error = err?.response && err?.response?.data?.Message
        //   ? err?.response?.data?.Message
        //   : err.message
        // toast.error(`${error}`)
      }
    },
    [setComponentYamlFile]
  )

  const updateComponentYamlFile = useCallback(
    async (componentId: string) => {
      setLoading(true)
      try {
        const { data } = await Axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/components/${componentId}/yaml`,
          {
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY || ''
            }
          }
        )
        setLoading(false)
        setComponentYamlFile(data)
      } catch (err: any) {
        setLoading(false)
        // const error = err?.response && err?.response?.data?.Message
        //   ? err?.response?.data?.Message
        //   : err.message
        // toast.error(`${error}`)
      }
    },
    [setComponentYamlFile]
  )

  const getCumulativeCostOfComponent = useCallback(
    (componentName: string) =>
      new Promise(async (resolve) => {
        try {
          const data = {
            __idle__: {
              name: '__idle__',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                providerID: 'lima-rancher-desktop'
              },
              window: {
                start: '2022-08-25T00:00:00Z',
                end: '2022-08-31T00:00:00Z'
              },
              start: '2022-08-25T11:54:00Z',
              end: '2022-08-30T15:06:00Z',
              minutes: 7392.0,
              cpuCores: 0.0,
              cpuCoreRequestAverage: 0.0,
              cpuCoreUsageAverage: 0.0,
              cpuCoreHours: 0.0,
              cpuCost: 0.0,
              cpuCostAdjustment: 0.0,
              cpuEfficiency: 0.0,
              gpuCount: 0.0,
              gpuHours: 0.0,
              gpuCost: 0.0,
              gpuCostAdjustment: 0.0,
              networkTransferBytes: 0.0,
              networkReceiveBytes: 0.0,
              networkCost: 0.0,
              networkCostAdjustment: 0.0,
              loadBalancerCost: 0.0,
              loadBalancerCostAdjustment: 0.0,
              pvBytes: 0.0,
              pvByteHours: 0.0,
              pvCost: 0.0,
              pvs: null,
              pvCostAdjustment: 0.0,
              ramBytes: 0.0,
              ramByteRequestAverage: 0.0,
              ramByteUsageAverage: 0.0,
              ramByteHours: 0.0,
              ramCost: 0.0,
              ramCostAdjustment: 0.0,
              ramEfficiency: 0.0,
              sharedCost: 0.0,
              externalCost: 0.0,
              totalCost: 0.0,
              totalEfficiency: 0.0,
              rawAllocationOnly: null
            },
            'wordpress-site': {
              name: 'wordpress-site',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                container: 'wordpress-site',
                controller: 'wordpress-site',
                controllerKind: 'deployment',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop'
              },
              window: {
                start: '2022-08-25T00:00:00Z',
                end: '2022-08-31T00:00:00Z'
              },
              start: '2022-08-26T12:06:00Z',
              end: '2022-08-30T15:00:00Z',
              minutes: 5934.0,
              cpuCores: 0.0,
              cpuCoreRequestAverage: 0.0,
              cpuCoreUsageAverage: 0.000124,
              cpuCoreHours: 0.0,
              cpuCost: 0.0,
              cpuCostAdjustment: 0.0,
              cpuEfficiency: 0.0,
              gpuCount: 0.0,
              gpuHours: 0.0,
              gpuCost: 0.0,
              gpuCostAdjustment: 0.0,
              networkTransferBytes: 0.0,
              networkReceiveBytes: 0.0,
              networkCost: 0.0,
              networkCostAdjustment: 0.0,
              loadBalancerCost: 0.0,
              loadBalancerCostAdjustment: 0.0,
              pvBytes: 0.0,
              pvByteHours: 0.0,
              pvCost: 0.0,
              pvs: null,
              pvCostAdjustment: 0.0,
              ramBytes: 0.0,
              ramByteRequestAverage: 0.0,
              ramByteUsageAverage: 62238905.511897,
              ramByteHours: 0.0,
              ramCost: 0.0,
              ramCostAdjustment: 0.0,
              ramEfficiency: 0.0,
              sharedCost: 0.0,
              externalCost: 0.0,
              totalCost: 0.0,
              totalEfficiency: 0.0,
              rawAllocationOnly: null
            }
          }
          resolve(data)
          setComponentCost(data)
          setLoading(false)
        } catch (err: any) {
          setLoading(false)
          const error =
            err?.response && err?.response?.data?.Message
              ? err?.response?.data?.Message
              : err.message
          toast.error(`${error}`)
        }
      }),
    [setComponentCost]
  )

  const value = useMemo<ComponentContextType>(
    () => ({
      getComponentById,
      component,
      getComponentYamlFile,
      componentYamlFile,
      updateComponentYamlFile,
      loading,
      getCumulativeCostOfComponent,
      componentCost
    }),
    [
      getComponentById,
      component,
      getComponentYamlFile,
      componentYamlFile,
      updateComponentYamlFile,
      loading,
      getCumulativeCostOfComponent,
      componentCost
    ]
  )

  return (
    <ComponentContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ComponentContext.Provider>
  )
}

export default ComponentContext
