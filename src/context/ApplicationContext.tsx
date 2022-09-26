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
import { application } from 'services/application.interface'
import { component } from 'services/component.interface'

interface ApplicationContextType {
  getApplicationById: CallableFunction
  application: application | null
  getApplicationComponents: CallableFunction
  applicationComponents: any[]
  applicationYamlFile: any
  getApplicationYamlFile: CallableFunction
  updateApplicationYamlFile: CallableFunction
  getCostOfApplication: CallableFunction
  applicationCost: any[]
  loading: boolean
  getHistoricalCostOfApplication: CallableFunction
}

const ApplicationContext = createContext<ApplicationContextType>(
  {} as ApplicationContextType
)

export function ApplicationContextProvider({
  children
}: {
  children: ReactElement
}) {
  const [application, setApplication] = useState<application | null>(null)
  const [applicationComponents, setApplicationComponents] = useState<
    component[]
  >([])
  const [applicationYamlFile, setApplicationYamlFile] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [applicationCost, setApplicationCost] = useState<any[]>([])

  const getApplicationById = useCallback(
    async (applicationName: string) => {
      setLoading(true)
      try {
        setApplication({
          _type: 'application',
          id: '3',
          name: 'my-wordpress',
          namespace: 'default',
          description: 'Customized version of wordpress-mysql',
          environment: 'dev',
          metadata: {
            creationTimestamp: '2022-08-02T15:11:28Z',
            annotations: {
              'kubectl.kubernetes.io/last-applied-configuration':
                '{"apiVersion":"core.oam.dev/v1beta1","kind":"Application","metadata":{"annotations":{"description":"Customized version of wordpress-mysql","version":"v1.0.0"},"name":"my-wordpress","namespace":"vela-system"},"spec":{"components":[{"name":"mysql-db","properties":{"image":"mysql:5.7"},"scopes":{"healthscopes.core.oam.dev":"wp-health-check"},"type":"mysql"},{"name":"wordpress-site","properties":{"image":"bitnami/wordpress:5.8.1","port":8080},"scopes":{"healthscopes.core.oam.dev":"wp-health-check"},"traits":[{"properties":{"domain":"localhost","http":{"/":8080}},"type":"ingress"},{"properties":{"replicas":1},"type":"scaler"}],"type":"wordpress"}]}}\n',
              'oam.dev/kubevela-version': 'v1.4.9',
              version: 'v1.0.0'
            },
            labels: {}
          },
          status: {
            status: 'running',
            healthy: true,
            message: '',
            event: ''
          },
          links: [
            {
              rel: 'components',
              href: '3/components',
              type: 'GET'
            }
          ]
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
    [setApplication]
  )

  const getApplicationYamlFile = useCallback(
    async (applicationId: string) => {
      setLoading(true)
      try {
        const { data } = await Axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/applications/${applicationId}/yaml`,
          {
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY || ''
            }
          }
        )
        setApplicationYamlFile(data)
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        // const error = err?.response && err?.response?.data?.Message
        //   ? err?.response?.data?.Message
        //   : err.message
        // toast.error(`${error}`)
      }
    },
    [setApplicationYamlFile]
  )

  const updateApplicationYamlFile = useCallback(
    async (applicationId: string) => {
      setLoading(true)
      try {
        const { data } = await Axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/applications/${applicationId}/yaml`,
          {
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY || ''
            }
          }
        )
        setApplicationYamlFile(data)
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        // const error = err?.response && err?.response?.data?.Message
        //   ? err?.response?.data?.Message
        //   : err.message
        // toast.error(`${error}`)
      }
    },
    [setApplicationYamlFile]
  )

  const getApplicationComponents = useCallback(
    async (applicationName: string) =>
      new Promise(async (resolve) => {
        try {
          const data = [
            {
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
            },
            {
              _type: 'component',
              componentType: 'mysql',
              id: 'mysql-db',
              name: 'mysql-db',
              properties: {
                image: 'mysql:5.7'
              },
              status: {
                status: 'Running',
                healthy: true,
                message: 'Ready:1/1',
                event: ''
              }
            }
          ]
          resolve(data)
          setApplicationComponents(data)
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
    [setApplicationComponents]
  )

  const getCostOfApplication = useCallback(
    (projectId: string) =>
      new Promise(async (resolve) => {
        try {
          resolve({
            __idle__: {
              name: '__idle__',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                providerID: 'lima-rancher-desktop'
              },
              window: {
                start: '2022-08-23T00:00:00Z',
                end: '2022-08-30T00:00:00Z'
              },
              start: '2022-08-23T00:00:00Z',
              end: '2022-08-29T12:57:00Z',
              minutes: 9417,
              cpuCores: 0,
              cpuCoreRequestAverage: 0,
              cpuCoreUsageAverage: 0,
              cpuCoreHours: 0,
              cpuCost: 0.001799,
              cpuCostAdjustment: 0,
              cpuEfficiency: 0,
              gpuCount: 0,
              gpuHours: 0,
              gpuCost: 0,
              gpuCostAdjustment: 0,
              networkTransferBytes: 0,
              networkReceiveBytes: 0,
              networkCost: 0,
              networkCostAdjustment: 0,
              loadBalancerCost: 0,
              loadBalancerCostAdjustment: 0,
              pvBytes: 0,
              pvByteHours: 0,
              pvCost: 0,
              pvs: null,
              pvCostAdjustment: 0,
              ramBytes: 0,
              ramByteRequestAverage: 0,
              ramByteUsageAverage: 0,
              ramByteHours: 0,
              ramCost: 0.043461,
              ramCostAdjustment: 0,
              ramEfficiency: 0,
              sharedCost: 0,
              externalCost: 0,
              totalCost: 0.04526,
              totalEfficiency: 0,
              rawAllocationOnly: null
            },
            __unallocated__: {
              name: '__unallocated__',
              properties: {
                cluster: 'cluster-one',
                namespace: 'dome'
              },
              window: {
                start: '2022-08-23T00:00:00Z',
                end: '2022-08-30T00:00:00Z'
              },
              start: '2022-08-27T16:42:00Z',
              end: '2022-08-27T17:00:00Z',
              minutes: 18,
              cpuCores: 0,
              cpuCoreRequestAverage: 0,
              cpuCoreUsageAverage: 0,
              cpuCoreHours: 0,
              cpuCost: 0,
              cpuCostAdjustment: 0,
              cpuEfficiency: 0,
              gpuCount: 0,
              gpuHours: 0,
              gpuCost: 0,
              gpuCostAdjustment: 0,
              networkTransferBytes: 0,
              networkReceiveBytes: 0,
              networkCost: 0,
              networkCostAdjustment: 0,
              loadBalancerCost: 0,
              loadBalancerCostAdjustment: 0,
              pvBytes: 0,
              pvByteHours: 0,
              pvCost: 0,
              pvs: null,
              pvCostAdjustment: 0,
              ramBytes: 0,
              ramByteRequestAverage: 0,
              ramByteUsageAverage: 573296640,
              ramByteHours: 0,
              ramCost: 0,
              ramCostAdjustment: 0,
              ramEfficiency: 0,
              sharedCost: 0,
              externalCost: 0,
              totalCost: 0,
              totalEfficiency: 0,
              rawAllocationOnly: null
            },
            'my-wordpress': {
              name: 'my-wordpress',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop'
              },
              window: {
                start: '2022-08-23T00:00:00Z',
                end: '2022-08-30T00:00:00Z'
              },
              start: '2022-08-26T12:06:00Z',
              end: '2022-08-29T12:57:00Z',
              minutes: 4371,
              cpuCores: 0,
              cpuCoreRequestAverage: 0,
              cpuCoreUsageAverage: 0.002066,
              cpuCoreHours: 0,
              cpuCost: 0,
              cpuCostAdjustment: 0,
              cpuEfficiency: 0,
              gpuCount: 0,
              gpuHours: 0,
              gpuCost: 0,
              gpuCostAdjustment: 0,
              networkTransferBytes: 0,
              networkReceiveBytes: 0,
              networkCost: 0,
              networkCostAdjustment: 0,
              loadBalancerCost: 0,
              loadBalancerCostAdjustment: 0,
              pvBytes: 0,
              pvByteHours: 0,
              pvCost: 0,
              pvs: null,
              pvCostAdjustment: 0,
              ramBytes: 0,
              ramByteRequestAverage: 0,
              ramByteUsageAverage: 232507385.03067,
              ramByteHours: 0,
              ramCost: 0,
              ramCostAdjustment: 0,
              ramEfficiency: 0,
              sharedCost: 0,
              externalCost: 0,
              totalCost: 0,
              totalEfficiency: 0,
              rawAllocationOnly: null
            },
            podinfo1: {
              name: 'podinfo1',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                container: 'podinfo',
                controller: 'podinfo1',
                namespace: 'dome'
              },
              window: {
                start: '2022-08-23T00:00:00Z',
                end: '2022-08-30T00:00:00Z'
              },
              start: '2022-08-25T14:01:00Z',
              end: '2022-08-29T12:57:00Z',
              minutes: 5696,
              cpuCores: 0.000623,
              cpuCoreRequestAverage: 0.000623,
              cpuCoreUsageAverage: 0.002006,
              cpuCoreHours: 0.059167,
              cpuCost: 0.00187,
              cpuCostAdjustment: 0,
              cpuEfficiency: 3.218387,
              gpuCount: 0,
              gpuHours: 0,
              gpuCost: 0,
              gpuCostAdjustment: 0,
              networkTransferBytes: 0,
              networkReceiveBytes: 0,
              networkCost: 0,
              networkCostAdjustment: 0,
              loadBalancerCost: 0,
              loadBalancerCostAdjustment: 0,
              pvBytes: 0,
              pvByteHours: 0,
              pvCost: 0,
              pvs: null,
              pvCostAdjustment: 0,
              ramBytes: 10456305.617978,
              ramByteRequestAverage: 10456305.617978,
              ramByteUsageAverage: 15864311.485757,
              ramByteHours: 992651946.666667,
              ramCost: 0.003917,
              ramCostAdjustment: 0,
              ramEfficiency: 1.5172,
              sharedCost: 0,
              externalCost: 0,
              totalCost: 0.005787,
              totalEfficiency: 2.06698,
              rawAllocationOnly: null
            },
            podinfo2: {
              name: 'podinfo2',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                container: 'podinfo',
                controller: 'podinfo2',
                namespace: 'dome'
              },
              window: {
                start: '2022-08-23T00:00:00Z',
                end: '2022-08-30T00:00:00Z'
              },
              start: '2022-08-26T12:06:00Z',
              end: '2022-08-29T12:57:00Z',
              minutes: 4371,
              cpuCores: 0.001622,
              cpuCoreRequestAverage: 0.001622,
              cpuCoreUsageAverage: 0.004897,
              cpuCoreHours: 0.118167,
              cpuCost: 0.003735,
              cpuCostAdjustment: 0,
              cpuEfficiency: 3.019261,
              gpuCount: 0,
              gpuHours: 0,
              gpuCost: 0,
              gpuCostAdjustment: 0,
              networkTransferBytes: 0,
              networkReceiveBytes: 0,
              networkCost: 0,
              networkCostAdjustment: 0,
              loadBalancerCost: 0,
              loadBalancerCostAdjustment: 0,
              pvBytes: 0,
              pvByteHours: 0,
              pvCost: 0,
              pvs: null,
              pvCostAdjustment: 0,
              ramBytes: 27213557.867765,
              ramByteRequestAverage: 27213557.867765,
              ramByteUsageAverage: 41408706.091311,
              ramByteHours: 1982507690.666667,
              ramCost: 0.007823,
              ramCostAdjustment: 0,
              ramEfficiency: 1.52162,
              sharedCost: 0,
              externalCost: 0,
              totalCost: 0.011558,
              totalEfficiency: 2.005619,
              rawAllocationOnly: null
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
      }),
    [setApplicationCost]
  )

  const getHistoricalCostOfApplication = useCallback(
    (projectId: string) =>
      new Promise(async (resolve) => {
        try {
          resolve([
            {},
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-25T00:00:00Z',
                  end: '2022-08-26T00:00:00Z'
                },
                start: '2022-08-25T11:54:00Z',
                end: '2022-08-25T23:57:00Z',
                minutes: 723,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0.000001,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.000023,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.000024,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-g9bkz',
                  services: ['podinfo1'],
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-25T00:00:00Z',
                  end: '2022-08-26T00:00:00Z'
                },
                start: '2022-08-25T14:01:00Z',
                end: '2022-08-25T14:06:00Z',
                minutes: 5,
                cpuCores: 0.001,
                cpuCoreRequestAverage: 0.001,
                cpuCoreUsageAverage: 0.000012,
                cpuCoreHours: 0.000083,
                cpuCost: 0.000003,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0.011692,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 16777216,
                ramByteRequestAverage: 16777216,
                ramByteUsageAverage: 23194009.6,
                ramByteHours: 1398101.333333,
                ramCost: 0.000006,
                ramCostAdjustment: 0,
                ramEfficiency: 1.382471,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.000008,
                totalEfficiency: 0.93947,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.000011691615123456788,
                  ramByteUsageMax: 27750400
                }
              }
            },
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-26T00:00:00Z',
                  end: '2022-08-27T00:00:00Z'
                },
                start: '2022-08-26T00:11:00Z',
                end: '2022-08-26T22:59:00Z',
                minutes: 1368,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0.000408,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.00923,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.009638,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              'my-wordpress': {
                name: 'my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    kubernetes_io_metadata_name: 'dome'
                  }
                },
                window: {
                  start: '2022-08-26T00:00:00Z',
                  end: '2022-08-27T00:00:00Z'
                },
                start: '2022-08-26T12:06:00Z',
                end: '2022-08-26T23:56:00Z',
                minutes: 710,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.004243,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 314308960.376471,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.0012425116915678928,
                  ramByteUsageMax: 215961600
                }
              },
              'mysql-db2': {
                name: 'mysql-db2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'mysql-db2',
                  controller: 'mysql-db2',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  pod: 'mysql-db2-7566578f88-m4w4j',
                  services: ['mysql-db2'],
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    app_oam_dev_component: 'mysql-db2',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '7566578f88'
                  }
                },
                window: {
                  start: '2022-08-26T00:00:00Z',
                  end: '2022-08-27T00:00:00Z'
                },
                start: '2022-08-26T13:49:00Z',
                end: '2022-08-26T23:56:00Z',
                minutes: 607,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.001054,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 202538779.28934,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.001054358962599209,
                  ramByteUsageMax: 204922880
                }
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-xgprk',
                  services: ['podinfo1'],
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-26T00:00:00Z',
                  end: '2022-08-27T00:00:00Z'
                },
                start: '2022-08-26T12:06:00Z',
                end: '2022-08-26T23:56:00Z',
                minutes: 710,
                cpuCores: 0.001,
                cpuCoreRequestAverage: 0.001,
                cpuCoreUsageAverage: 0.001354,
                cpuCoreHours: 0.011833,
                cpuCost: 0.000374,
                cpuCostAdjustment: 0,
                cpuEfficiency: 1.353827,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 16777216,
                ramByteRequestAverage: 16777216,
                ramByteUsageAverage: 25667410.324097,
                ramByteHours: 198530389.333333,
                ramCost: 0.000783,
                ramCostAdjustment: 0,
                ramEfficiency: 1.529897,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.001157,
                totalEfficiency: 1.472996,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.001353827128849688,
                  ramByteUsageMax: 28643328
                }
              },
              podinfo2: {
                name: 'podinfo2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo2',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-26T00:00:00Z',
                  end: '2022-08-27T00:00:00Z'
                },
                start: '2022-08-26T12:06:00Z',
                end: '2022-08-26T23:56:00Z',
                minutes: 710,
                cpuCores: 0.002,
                cpuCoreRequestAverage: 0.002,
                cpuCoreUsageAverage: 0.002866,
                cpuCoreHours: 0.023667,
                cpuCost: 0.000748,
                cpuCostAdjustment: 0,
                cpuEfficiency: 1.433142,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 33554432,
                ramByteRequestAverage: 33554432,
                ramByteUsageAverage: 51560448,
                ramByteHours: 397060778.666667,
                ramCost: 0.001567,
                ramCostAdjustment: 0,
                ramEfficiency: 1.536621,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.002315,
                totalEfficiency: 1.503179,
                rawAllocationOnly: null
              }
            },
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-27T00:00:00Z',
                  end: '2022-08-28T00:00:00Z'
                },
                start: '2022-08-27T03:01:00Z',
                end: '2022-08-28T00:00:00Z',
                minutes: 1259,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: -0.000056,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.00474,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.004684,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              __unallocated__: {
                name: '__unallocated__',
                properties: {
                  cluster: 'cluster-one',
                  namespace: 'dome'
                },
                window: {
                  start: '2022-08-27T00:00:00Z',
                  end: '2022-08-28T00:00:00Z'
                },
                start: '2022-08-27T16:42:00Z',
                end: '2022-08-27T17:00:00Z',
                minutes: 18,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 573296640,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              'my-wordpress': {
                name: 'my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {}
                },
                window: {
                  start: '2022-08-27T00:00:00Z',
                  end: '2022-08-28T00:00:00Z'
                },
                start: '2022-08-27T03:00:00Z',
                end: '2022-08-28T00:00:00Z',
                minutes: 1260,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.000767,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 90472630.747319,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.0031542195306594346,
                  ramByteUsageMax: 213446656
                }
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-xgprk',
                  services: ['podinfo1'],
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-27T00:00:00Z',
                  end: '2022-08-28T00:00:00Z'
                },
                start: '2022-08-27T00:07:00Z',
                end: '2022-08-28T00:00:00Z',
                minutes: 1433,
                cpuCores: 0.000431,
                cpuCoreRequestAverage: 0.000431,
                cpuCoreUsageAverage: 0.00109,
                cpuCoreHours: 0.0103,
                cpuCost: 0.000326,
                cpuCostAdjustment: 0,
                cpuEfficiency: 2.526984,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 7235393.920447,
                ramByteRequestAverage: 7235393.920447,
                ramByteUsageAverage: 10055059.394891,
                ramByteHours: 172805324.8,
                ramCost: 0.000682,
                ramCostAdjustment: 0,
                ramEfficiency: 1.389704,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.001007,
                totalEfficiency: 1.757244,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.0042134736394250655,
                  ramByteUsageMax: 28708864
                }
              },
              podinfo2: {
                name: 'podinfo2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo2',
                  namespace: 'dome'
                },
                window: {
                  start: '2022-08-27T00:00:00Z',
                  end: '2022-08-28T00:00:00Z'
                },
                start: '2022-08-27T00:07:00Z',
                end: '2022-08-28T00:00:00Z',
                minutes: 1433,
                cpuCores: 0.000863,
                cpuCoreRequestAverage: 0.000863,
                cpuCoreUsageAverage: 0.002181,
                cpuCoreHours: 0.0206,
                cpuCost: 0.000651,
                cpuCostAdjustment: 0,
                cpuEfficiency: 2.528695,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 14470787.840893,
                ramByteRequestAverage: 14470787.840893,
                ramByteUsageAverage: 20240331.837928,
                ramByteHours: 345610649.6,
                ramCost: 0.001364,
                ramCostAdjustment: 0,
                ramEfficiency: 1.398703,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.002015,
                totalEfficiency: 1.763887,
                rawAllocationOnly: null
              }
            },
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-28T00:00:00Z',
                  end: '2022-08-29T00:00:00Z'
                },
                start: '2022-08-28T00:00:00Z',
                end: '2022-08-29T00:00:00Z',
                minutes: 1440,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0.000939,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.01914,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.020079,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-xgprk',
                  services: ['podinfo1'],
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-28T00:00:00Z',
                  end: '2022-08-29T00:00:00Z'
                },
                start: '2022-08-28T00:00:00Z',
                end: '2022-08-29T00:00:00Z',
                minutes: 1440,
                cpuCores: 0.001,
                cpuCoreRequestAverage: 0.001,
                cpuCoreUsageAverage: 0.004077,
                cpuCoreHours: 0.024,
                cpuCost: 0.000759,
                cpuCostAdjustment: 0,
                cpuEfficiency: 4.077452,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 16777216,
                ramByteRequestAverage: 16777216,
                ramByteUsageAverage: 25973196.8,
                ramByteHours: 402653184,
                ramCost: 0.001589,
                ramCostAdjustment: 0,
                ramEfficiency: 1.548123,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.002348,
                totalEfficiency: 2.365537,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.004350444990081723,
                  ramByteUsageMax: 28827648
                }
              },
              podinfo2: {
                name: 'podinfo2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo2',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-28T00:00:00Z',
                  end: '2022-08-29T00:00:00Z'
                },
                start: '2022-08-28T00:00:00Z',
                end: '2022-08-29T00:00:00Z',
                minutes: 1440,
                cpuCores: 0.002,
                cpuCoreRequestAverage: 0.002,
                cpuCoreUsageAverage: 0.00743,
                cpuCoreHours: 0.048,
                cpuCost: 0.001517,
                cpuCostAdjustment: 0,
                cpuEfficiency: 3.715183,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 33554432,
                ramByteRequestAverage: 33554432,
                ramByteUsageAverage: 52013414.4,
                ramByteHours: 805306368,
                ramCost: 0.003178,
                ramCostAdjustment: 0,
                ramEfficiency: 1.550121,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.004695,
                totalEfficiency: 2.249813,
                rawAllocationOnly: null
              },
              'my-wordpress': {
                name: 'my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  namespace: 'dome',
                  pod: 'wordpress-site-58c6c4f54-2sxtb',
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    kubernetes_io_metadata_name: 'dome'
                  }
                },
                window: {
                  start: '2022-08-28T00:00:00Z',
                  end: '2022-08-29T00:00:00Z'
                },
                start: '2022-08-28T00:00:00Z',
                end: '2022-08-29T00:00:00Z',
                minutes: 1440,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.000196,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 78616295.822222,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.00020337637311401767,
                  ramByteUsageMax: 81309696
                }
              }
            },
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-29T00:00:00Z',
                  end: '2022-08-30T00:00:00Z'
                },
                start: '2022-08-29T00:00:00Z',
                end: '2022-08-30T00:00:00Z',
                minutes: 1440,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0.000939,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.01914,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.020079,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-xgprk',
                  services: ['podinfo1'],
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-29T00:00:00Z',
                  end: '2022-08-30T00:00:00Z'
                },
                start: '2022-08-29T00:00:00Z',
                end: '2022-08-30T00:00:00Z',
                minutes: 1440,
                cpuCores: 0.001,
                cpuCoreRequestAverage: 0.001,
                cpuCoreUsageAverage: 0.003905,
                cpuCoreHours: 0.024,
                cpuCost: 0.000759,
                cpuCostAdjustment: 0,
                cpuEfficiency: 3.905306,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 16777216,
                ramByteRequestAverage: 16777216,
                ramByteUsageAverage: 26019434.666667,
                ramByteHours: 402653184,
                ramCost: 0.001589,
                ramCostAdjustment: 0,
                ramEfficiency: 1.550879,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.002348,
                totalEfficiency: 2.311769,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.00421992954457399,
                  ramByteUsageMax: 28856320
                }
              },
              podinfo2: {
                name: 'podinfo2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo2',
                  controllerKind: 'deployment',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-29T00:00:00Z',
                  end: '2022-08-30T00:00:00Z'
                },
                start: '2022-08-29T00:00:00Z',
                end: '2022-08-30T00:00:00Z',
                minutes: 1440,
                cpuCores: 0.002,
                cpuCoreRequestAverage: 0.002,
                cpuCoreUsageAverage: 0.007157,
                cpuCoreHours: 0.048,
                cpuCost: 0.001517,
                cpuCostAdjustment: 0,
                cpuEfficiency: 3.578638,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 33554432,
                ramByteRequestAverage: 33554432,
                ramByteUsageAverage: 52146191.644444,
                ramByteHours: 805306368,
                ramCost: 0.003178,
                ramCostAdjustment: 0,
                ramEfficiency: 1.554078,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.004695,
                totalEfficiency: 2.208363,
                rawAllocationOnly: null
              },
              'my-wordpress': {
                name: 'my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  namespace: 'dome',
                  pod: 'wordpress-site-58c6c4f54-2sxtb',
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    kubernetes_io_metadata_name: 'dome'
                  }
                },
                window: {
                  start: '2022-08-29T00:00:00Z',
                  end: '2022-08-30T00:00:00Z'
                },
                start: '2022-08-29T00:00:00Z',
                end: '2022-08-30T00:00:00Z',
                minutes: 1440,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.000182,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 75900188.444444,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.00020159115952823135,
                  ramByteUsageMax: 76914688
                }
              }
            },
            {
              __idle__: {
                name: '__idle__',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  providerID: 'lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-30T00:00:00Z',
                  end: '2022-08-31T00:00:00Z'
                },
                start: '2022-08-30T00:00:00Z',
                end: '2022-08-30T14:36:00Z',
                minutes: 876,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0,
                cpuCoreHours: 0,
                cpuCost: 0.000445,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 0,
                ramByteHours: 0,
                ramCost: 0.007977,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.008422,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              __unallocated__: {
                name: '__unallocated__',
                properties: {
                  cluster: 'cluster-one',
                  namespace: 'dome'
                },
                window: {
                  start: '2022-08-30T00:00:00Z',
                  end: '2022-08-31T00:00:00Z'
                },
                start: '2022-08-30T10:09:00Z',
                end: '2022-08-30T11:45:00Z',
                minutes: 96,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.000105,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 409623424,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: null
              },
              podinfo1: {
                name: 'podinfo1',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo1',
                  namespace: 'dome',
                  pod: 'podinfo1-5bdf9bf547-xgprk',
                  services: ['podinfo1'],
                  labels: {
                    app_kubernetes_io_name: 'podinfo1',
                    kubernetes_io_metadata_name: 'dome',
                    pod_template_hash: '5bdf9bf547'
                  },
                  annotations: {
                    prometheus_io_port: '9898',
                    prometheus_io_scrape: 'true'
                  }
                },
                window: {
                  start: '2022-08-30T00:00:00Z',
                  end: '2022-08-31T00:00:00Z'
                },
                start: '2022-08-30T00:00:00Z',
                end: '2022-08-30T14:30:00Z',
                minutes: 870,
                cpuCores: 0.000638,
                cpuCoreRequestAverage: 0.000638,
                cpuCoreUsageAverage: 0.001703,
                cpuCoreHours: 0.00925,
                cpuCost: 0.000292,
                cpuCostAdjustment: 0,
                cpuEfficiency: 2.669449,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 10702706.758621,
                ramByteRequestAverage: 10702706.758621,
                ramByteUsageAverage: 16588838.705759,
                ramByteHours: 155189248,
                ramCost: 0.000612,
                ramCostAdjustment: 0,
                ramEfficiency: 1.549967,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.000905,
                totalEfficiency: 1.911754,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.003984611359447597,
                  ramByteUsageMax: 28884992
                }
              },
              podinfo2: {
                name: 'podinfo2',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'podinfo',
                  controller: 'podinfo2',
                  namespace: 'dome'
                },
                window: {
                  start: '2022-08-30T00:00:00Z',
                  end: '2022-08-31T00:00:00Z'
                },
                start: '2022-08-30T00:00:00Z',
                end: '2022-08-30T14:30:00Z',
                minutes: 870,
                cpuCores: 0.001276,
                cpuCoreRequestAverage: 0.001276,
                cpuCoreUsageAverage: 0.003237,
                cpuCoreHours: 0.0185,
                cpuCost: 0.000585,
                cpuCostAdjustment: 0,
                cpuEfficiency: 2.537265,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 21405413.517241,
                ramByteRequestAverage: 21405413.517241,
                ramByteUsageAverage: 33324020.496638,
                ramByteHours: 310378496,
                ramCost: 0.001225,
                ramCostAdjustment: 0,
                ramEfficiency: 1.556803,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0.00181,
                totalEfficiency: 1.873663,
                rawAllocationOnly: null
              },
              'my-wordpress': {
                name: 'my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  namespace: 'dome',
                  providerID: 'k3s://lima-rancher-desktop',
                  labels: {
                    kubernetes_io_metadata_name: 'dome'
                  }
                },
                window: {
                  start: '2022-08-30T00:00:00Z',
                  end: '2022-08-31T00:00:00Z'
                },
                start: '2022-08-30T00:00:00Z',
                end: '2022-08-30T14:30:00Z',
                minutes: 870,
                cpuCores: 0,
                cpuCoreRequestAverage: 0,
                cpuCoreUsageAverage: 0.000078,
                cpuCoreHours: 0,
                cpuCost: 0,
                cpuCostAdjustment: 0,
                cpuEfficiency: 0,
                gpuCount: 0,
                gpuHours: 0,
                gpuCost: 0,
                gpuCostAdjustment: 0,
                networkTransferBytes: 0,
                networkReceiveBytes: 0,
                networkCost: 0,
                networkCostAdjustment: 0,
                loadBalancerCost: 0,
                loadBalancerCostAdjustment: 0,
                pvBytes: 0,
                pvByteHours: 0,
                pvCost: 0,
                pvs: null,
                pvCostAdjustment: 0,
                ramBytes: 0,
                ramByteRequestAverage: 0,
                ramByteUsageAverage: 41665406.528736,
                ramByteHours: 0,
                ramCost: 0,
                ramCostAdjustment: 0,
                ramEfficiency: 0,
                sharedCost: 0,
                externalCost: 0,
                totalCost: 0,
                totalEfficiency: 0,
                rawAllocationOnly: {
                  cpuCoreUsageMax: 0.00019102823663602974,
                  ramByteUsageMax: 74936320
                }
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
      }),
    []
  )

  const value = useMemo<ApplicationContextType>(
    () => ({
      getApplicationById,
      application,
      getApplicationComponents,
      applicationComponents,
      getApplicationYamlFile,
      applicationYamlFile,
      updateApplicationYamlFile,
      getCostOfApplication,
      applicationCost,
      getHistoricalCostOfApplication,
      loading
    }),
    [
      getApplicationById,
      application,
      getApplicationComponents,
      applicationComponents,
      getApplicationYamlFile,
      applicationYamlFile,
      updateApplicationYamlFile,
      getCostOfApplication,
      applicationCost,
      getHistoricalCostOfApplication,
      loading
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ApplicationContext.Provider>
  )
}

export default ApplicationContext
