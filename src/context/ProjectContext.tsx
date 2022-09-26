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
import { Project } from 'services/project.interface'

interface ProjectContextType {
  getAllProjects: CallableFunction
  projects: Project[] | null
  getProjectById: CallableFunction
  project: Project | null
  getProjectApplications: CallableFunction
  projectApplications: application[] | null
  loading: boolean
  getProjectCumulativeCost: CallableFunction
  getProjectHistoricalCost: CallableFunction
}

const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType
)

export function ProjectContextProvider({
  children
}: {
  children: ReactElement
}) {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [projectApplications, setProjectApplications] = useState<
    application[] | null
  >([])
  const [loading, setLoading] = useState<boolean>(true)

  const getAllProjects = useCallback(async () => {
    setLoading(true)
    setProjects([
      {
        _type: 'project',
        id: 1,
        name: 'First Project',
        config: {
          currencyCode: 'DOLLAR'
        },
        links: {
          rel: 'applications',
          href: '1/applications',
          type: 'GET'
        }
      },
      {
        _type: 'project',
        id: 2,
        name: 'Second Project',
        config: {
          currencyCode: 'DOLLAR'
        },
        links: {
          rel: 'applications',
          href: '2/applications',
          type: 'GET'
        }
      }
    ])
    setLoading(false)
  }, [setProjects])

  const getProjectById = useCallback(
    async (projectId: string) => {
      setLoading(true)
      try {
        setProject({
          _type: 'project',
          id: 1,
          name: 'First Project',
          config: {
            currencyCode: 'DOLLAR'
          },
          links: {
            rel: 'applications',
            href: '1/applications',
            type: 'GET'
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
    [setProject]
  )

  const getProjectApplications = useCallback(
    (projectId: string) =>
      new Promise(async (resole) => {
        try {
          const data = [
            {
              _type: 'application',
              id: '1',
              name: 'podinfo1',
              namespace: 'default',
              description: 'Podinfo application',
              environment: 'dev',
              metadata: {
                creationTimestamp: '2022-08-02T14:53:00Z',
                annotations: {
                  'kubectl.kubernetes.io/last-applied-configuration':
                    '{"apiVersion":"core.oam.dev/v1beta1","kind":"Application","metadata":{"annotations":{"description":"Podinfo application","version":"v1.0.1"},"name":"podinfo1","namespace":"default"},"spec":{"components":[{"name":"podinfo1","properties":{"chart":"podinfo","repoType":"helm","url":"https://stefanprodan.github.io/podinfo","values":{"ingress":{"enabled":true,"hosts":[{"host":"podinfo1.localdev.me","paths":[{"path":"/","pathType":"ImplementationSpecific"}]}]},"replicaCount":1,"ui":{"color":"#09A752","message":"Welcome Bart !!!! "}},"version":"6.1.6"},"traits":[{"properties":{"env":"dev"},"type":"labels"}],"type":"helm"}]}}\n',
                  'oam.dev/kubevela-version': 'v1.4.9',
                  version: 'v1.0.1'
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
                  href: '1/components',
                  type: 'GET'
                }
              ]
            },
            {
              _type: 'application',
              id: '2',
              name: 'podinfo2',
              namespace: 'default',
              description: 'Podinfo application',
              environment: 'dev',
              metadata: {
                creationTimestamp: '2022-08-02T14:53:00Z',
                annotations: {
                  'kubectl.kubernetes.io/last-applied-configuration':
                    '{"apiVersion":"core.oam.dev/v1beta1","kind":"Application","metadata":{"annotations":{"description":"Podinfo application","version":"v1.0.1"},"name":"podinfo2","namespace":"default"},"spec":{"components":[{"name":"podinfo2","properties":{"chart":"podinfo","repoType":"helm","url":"https://stefanprodan.github.io/podinfo","values":{"ingress":{"enabled":true,"hosts":[{"host":"podinfo2.localdev.me","paths":[{"path":"/","pathType":"ImplementationSpecific"}]}]},"replicaCount":2,"ui":{"color":"#09A772","message":"Welcome Tom !!!! "}},"version":"6.1.6"},"type":"helm"}]}}\n',
                  'oam.dev/kubevela-version': 'v1.4.9',
                  version: 'v1.0.1'
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
                  href: '2/components',
                  type: 'GET'
                }
              ]
            },
            {
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
              cost: {
                name: 'default/my-wordpress',
                properties: {
                  cluster: 'cluster-one',
                  node: 'lima-rancher-desktop',
                  container: 'wordpress-site',
                  controller: 'wordpress-site',
                  controllerKind: 'deployment',
                  namespace: 'default',
                  providerID: 'k3s://lima-rancher-desktop'
                },
                window: {
                  start: '2022-08-08T08:00:00Z',
                  end: '2022-08-08T14:00:00Z'
                },
                start: '2022-08-08T08:45:00Z',
                end: '2022-08-08T13:09:00Z',
                minutes: 528.0,
                cpuCores: 0.0,
                cpuCoreRequestAverage: 0.0,
                cpuCoreUsageAverage: 0.000812,
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
                ramByteUsageAverage: 91000282.484848,
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
            }
          ]
          const project: Project | undefined = projects?.find(
            (x: Project) => x.id.toString() === projectId.toString()
          )
          if (project) {
            project.applications = data
            setProjects(projects)
          }
          resole(data)
          setProjectApplications(data)
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
    [projects, setProjectApplications]
  )

  const getProjectCumulativeCost = useCallback(
    () =>
      new Promise(async (resolve) => {
        resolve({
          'First Project': {
            name: 'First Project',
            properties: {
              cluster: 'cluster-one',
              node: 'lima-rancher-desktop',
              namespace: 'dome',
              providerID: 'k3s://lima-rancher-desktop',
              labels: {
                kubernetes_io_metadata_name: 'dome'
              },
              annotations: {
                prometheus_io_port: '9898',
                prometheus_io_scrape: 'true'
              }
            },
            window: {
              start: '2022-09-01T00:00:00Z',
              end: '2022-09-04T00:00:00Z'
            },
            start: '2022-09-01T14:01:00Z',
            end: '2022-09-04T14:06:00Z',
            cpuCost: 30,
            cpuEfficiency: 10,
            gpuCost: 20,
            networkCost: 10,
            pvCost: 10,
            ramCost: 40,
            ramEfficiency: 20,
            sharedCost: 10,
            externalCost: 10,
            totalCost: 130,
            totalEfficiency: 30
          },
          'Second Project': {
            name: 'Second Project',
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
              start: '2022-09-01T00:00:00Z',
              end: '2022-09-04T00:00:00Z'
            },
            start: '2022-09-01T13:49:00Z',
            end: '2022-09-04T23:56:00Z',
            cpuCost: 10,
            cpuEfficiency: 10,
            gpuCost: 5,
            networkCost: 5.5,
            pvCost: 0,
            ramCost: 3.5,
            ramEfficiency: 4,
            sharedCost: 5,
            externalCost: 0.5,
            totalCost: 122.5,
            totalEfficiency: 6.66
          }
        })
        setLoading(false)
      }),
    [setProjects, projects]
  )

  const getProjectHistoricalCost = useCallback(
    () =>
      new Promise(async (resolve) => {
        resolve([
          {
            'First Project': {
              name: 'First Project',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop',
                labels: {
                  kubernetes_io_metadata_name: 'dome'
                },
                annotations: {
                  prometheus_io_port: '9898',
                  prometheus_io_scrape: 'true'
                }
              },
              window: {
                start: '2022-09-01T00:00:00Z',
                end: '2022-09-02T00:00:00Z'
              },
              start: '2022-09-01T14:01:00Z',
              end: '2022-09-01T14:06:00Z',
              cpuCost: 2,
              cpuEfficiency: 5,
              gpuCost: 1,
              networkCost: 1,
              pvCost: 1,
              ramCost: 3,
              ramEfficiency: 10,
              sharedCost: 1,
              externalCost: 1,
              totalCost: 100,
              totalEfficiency: 15
            },
            'Second Project': {
              name: 'Second Project',
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
                start: '2022-09-01T00:00:00Z',
                end: '2022-09-02T00:00:00Z'
              },
              start: '2022-09-01T13:49:00Z',
              end: '2022-09-01T23:56:00Z',
              cpuCost: 1,
              cpuEfficiency: 1,
              gpuCost: 0,
              networkCost: 0.5,
              pvCost: 0,
              ramCost: 2.5,
              ramEfficiency: 4,
              sharedCost: 1,
              externalCost: 0,
              totalCost: 23,
              totalEfficiency: 5
            }
          },
          {
            'First Project': {
              name: 'First Project',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop',
                labels: {
                  kubernetes_io_metadata_name: 'dome'
                },
                annotations: {
                  prometheus_io_port: '9898',
                  prometheus_io_scrape: 'true'
                }
              },
              window: {
                start: '2022-09-02T00:00:00Z',
                end: '2022-09-03T00:00:00Z'
              },
              start: '2022-09-02T14:01:00Z',
              end: '2022-09-02T14:06:00Z',
              cpuCost: 4,
              cpuEfficiency: 7.5,
              gpuCost: 2,
              networkCost: 2,
              pvCost: 2,
              ramCost: 6,
              ramEfficiency: 15,
              sharedCost: 2,
              externalCost: 2,
              totalCost: 20,
              totalEfficiency: 22.5
            },
            'Second Project': {
              name: 'Second Project',
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
                start: '2022-09-02T00:00:00Z',
                end: '2022-09-03T00:00:00Z'
              },
              start: '2022-09-02T13:49:00Z',
              end: '2022-09-02T23:56:00Z',
              cpuCost: 2,
              cpuEfficiency: 1,
              gpuCost: 0,
              networkCost: 1.5,
              pvCost: 0,
              ramCost: 3,
              ramEfficiency: 4,
              sharedCost: 1,
              externalCost: 0,
              totalCost: 7.5,
              totalEfficiency: 5
            }
          },
          {
            'First Project': {
              name: 'First Project',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop',
                labels: {
                  kubernetes_io_metadata_name: 'dome'
                },
                annotations: {
                  prometheus_io_port: '9898',
                  prometheus_io_scrape: 'true'
                }
              },
              window: {
                start: '2022-09-03T00:00:00Z',
                end: '2022-09-04T00:00:00Z'
              },
              start: '2022-09-03T14:01:00Z',
              end: '2022-09-03T14:06:00Z',
              cpuCost: 8,
              cpuEfficiency: 10,
              gpuCost: 4,
              networkCost: 4,
              pvCost: 4,
              ramCost: 12,
              ramEfficiency: 20,
              sharedCost: 4,
              externalCost: 4,
              totalCost: 40,
              totalEfficiency: 30
            },
            'Second Project': {
              name: 'Second Project',
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
                start: '2022-09-03T00:00:00Z',
                end: '2022-09-04T00:00:00Z'
              },
              start: '2022-09-03T13:49:00Z',
              end: '2022-09-03T23:56:00Z',
              cpuCost: 8,
              cpuEfficiency: 2,
              gpuCost: 2,
              networkCost: 5,
              pvCost: 0,
              ramCost: 3,
              ramEfficiency: 4,
              sharedCost: 2,
              externalCost: 0,
              totalCost: 20,
              totalEfficiency: 6
            }
          },
          {
            'First Project': {
              name: 'First Project',
              properties: {
                cluster: 'cluster-one',
                node: 'lima-rancher-desktop',
                namespace: 'dome',
                providerID: 'k3s://lima-rancher-desktop',
                labels: {
                  kubernetes_io_metadata_name: 'dome'
                },
                annotations: {
                  prometheus_io_port: '9898',
                  prometheus_io_scrape: 'true'
                }
              },
              window: {
                start: '2022-09-04T00:00:00Z',
                end: '2022-09-05T00:00:00Z'
              },
              start: '2022-09-04T14:01:00Z',
              end: '2022-09-04T14:06:00Z',
              cpuCost: 10,
              cpuEfficiency: 15,
              gpuCost: 6,
              networkCost: 6,
              pvCost: 6,
              ramCost: 15,
              ramEfficiency: 20,
              sharedCost: 6,
              externalCost: 6,
              totalCost: 60,
              totalEfficiency: 35
            },
            'Second Project': {
              name: 'Second Project',
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
                start: '2022-09-03T00:00:00Z',
                end: '2022-09-04T00:00:00Z'
              },
              start: '2022-09-03T13:49:00Z',
              end: '2022-09-03T23:56:00Z',
              cpuCost: 4,
              cpuEfficiency: 4,
              gpuCost: 1,
              networkCost: 2.5,
              pvCost: 0,
              ramCost: 1.5,
              ramEfficiency: 6,
              sharedCost: 1,
              externalCost: 0,
              totalCost: 10,
              totalEfficiency: 10
            }
          }
        ])
        setLoading(false)
      }),
    [projects]
  )

  const value = useMemo<ProjectContextType>(
    () => ({
      getAllProjects,
      project,
      projects,
      projectApplications,
      loading,
      setProject,
      getProjectById,
      getProjectApplications,
      getProjectCumulativeCost,
      getProjectHistoricalCost
    }),
    [
      getAllProjects,
      project,
      projects,
      projectApplications,
      loading,
      setProject,
      getProjectById,
      getProjectApplications,
      getProjectCumulativeCost,
      getProjectHistoricalCost
    ]
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ProjectContext.Provider>
  )
}

export default ProjectContext
