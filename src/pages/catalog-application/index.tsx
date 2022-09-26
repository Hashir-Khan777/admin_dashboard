import Editor from '@monaco-editor/react'
import useCatalog from 'hooks/useCatalog'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import YAML from 'yaml'

interface input {
  label: string
  placeholder: string
  type: string
  required: boolean
  disabled: boolean
  value?: string | null
  key: string
}
interface fieldSet {
  heading: string
  inputs: input[]
}

const obj: any = {
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
        replicas: 3,
        http: {
          '/': 8080
        }
      },
      type: 'ingress'
    },
    {
      properties: {
        replicas: 1,
        domain: '6000',
        http: {
          '/': 6000
        }
      },
      type: 'scaler'
    }
  ],
  status: {
    status: 'Running',
    healthy: true,
    message: 'Ready:1/1',
    event: ''
  },
  cost: {
    name: 'vela-system/wordpress-site-58c6c4f54-mt9jj',
    properties: {
      cluster: 'cluster-one',
      node: 'lima-rancher-desktop',
      container: 'wordpress-site',
      controller: 'wordpress-site',
      controllerKind: 'deployment',
      namespace: 'vela-system',
      pod: 'wordpress-site-58c6c4f54-mt9jj',
      providerID: 'k3s://lima-rancher-desktop'
    },
    window: {
      start: '2022-08-08T08:00:00Z',
      end: '2022-08-08T14:00:00Z'
    },
    start: '2022-08-08T08:45:00Z',
    end: '2022-08-08T13:09:00Z',
    minutes: 264.0,
    cpuCores: 0.0,
    cpuCoreRequestAverage: 0.0,
    cpuCoreUsageAverage: 0.000404,
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
    ramByteUsageAverage: 87077872.484848,
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

function CatalogApplication() {
  const [tab, setTab] = useState<string>('1')
  // const [fieldSets, setFieldSets] = useState<fieldSet[]>([])

  const { getCatalogPackageVersionDetails, catalogPackageVersion, loading } = useCatalog()
  const { catalogId, packageName, version } = useParams()

  useEffect(() => {
    getCatalogPackageVersionDetails(catalogId, packageName, version)
  }, [getCatalogPackageVersionDetails, catalogId, packageName, version])

  const modifyObject = (obj: any) => Object.keys(obj).map((key: string) => ({
    disabled: false,
    label: key,
    placeholder: key,
    required: false,
    type: 'text',
    value: obj[key],
    key
  }))[0]

  // const modifyFieldset = (heading: string, obj: any) => ({
  //   heading,
  //   inputs: [modifyObject(obj)]
  // })

  const inputs: any[] = []
  const fieldSets: fieldSet[] = []
  function getUpdatedObject(obj: any) {
    Object.keys(obj).map((key: string) => {
      if (obj[key] && typeof obj[key] !== 'object') {
        inputs.push(modifyObject({ [key]: obj[key] }))
      } else if (obj[key] && typeof obj[key] === 'object') {
        getUpdatedObject(obj[key])
        fieldSets.push({ heading: key, inputs })
      }
      return obj
    })
  }

  getUpdatedObject(obj)

  return (
    <div className="main xs:p-4 tablet:p-10">
      <div className="flex items-start justify-start">
        {loading ? (
          <Skeleton height={144} width="144px" containerClassName="pr-2 pb-1" />
        ) : (
          <div className="w-36 h-36 mr-2">
            <img
              src={
                catalogPackageVersion?.logo?.src
                  ? catalogPackageVersion?.logo?.src
                  : '/images/image1.jpg'
              }
              alt={catalogPackageVersion?.applicationName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {loading ? (
          <Skeleton height={36} width="400px" />
        ) : (
          <p className="font-bold text-xl">
            {catalogPackageVersion?.applicationName}
          </p>
        )}
      </div>
      {loading ? (
        <Skeleton height={38} width="500px" />
      ) : (
        <div className="flex items-center justify-start mt-3">
          <div className="mr-2">
            <p className="font-bold text-lg">Versions:</p>
          </div>
          <div className="flex justify-center items-center">
            {catalogPackageVersion?.maintainer?.map((version: string) => (
              <span className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300">
                {version}
              </span>
            ))}
          </div>
        </div>
      )}
      {loading ? (
        <Skeleton height={150} />
      ) : (
        <div className="flex flex-wrap items-center justify-start mt-3">
          <div className="large:flex-0.3 xs:flex-1">
            <p className="font-bold text-lg">Description:</p>
            <p className="mt-1 text-gray-700 text-base w-full">
              {catalogPackageVersion?.description}
            </p>
          </div>
          <div className="flex-0.6">
            <p>
              Maintainers:{' '}
              {catalogPackageVersion?.maintainer?.map(
                (maintainer) => `${maintainer}, `
              )}
            </p>
            <p className="my-5">License: {catalogPackageVersion?.license}</p>
            <p>Labels: {catalogPackageVersion?.labels?.category}</p>
          </div>
        </div>
      )}
      <div className="mt-5">
        {loading ? (
          <Skeleton height={36} width="400px" />
        ) : (
          <div className="my-3">
            <p className="font-bold text-lg">Components:</p>
          </div>
        )}
        <div>
          {loading ? (
            <Skeleton height={43} containerClassName="my-4" />
          ) : (
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                <li className="mr-2" role="presentation">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      tab === '1'
                        ? 'border-b-2 border-blue-600 hover:border-blue-600 text-blue-600'
                        : 'hover:border-b-2 hover:border-gray-300'
                    }`}
                    type="button"
                    role="tab"
                    onClick={() => setTab('1')}
                  >
                    Component 1
                  </button>
                </li>
                <li className="mr-2" role="presentation">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      tab === '2'
                        ? 'border-b-2 border-blue-600 hover:border-blue-600 text-blue-600'
                        : 'hover:border-b-2 hover:border-gray-300'
                    }`}
                    type="button"
                    role="tab"
                    onClick={() => setTab('2')}
                  >
                    Component 2
                  </button>
                </li>
                <li className="mr-2" role="presentation">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      tab === '3'
                        ? 'border-b-2 border-blue-600 hover:border-blue-600 text-blue-600'
                        : 'hover:border-b-2 hover:border-gray-300'
                    }`}
                    type="button"
                    role="tab"
                    onClick={() => setTab('3')}
                  >
                    Component 3
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      tab === '4'
                        ? 'border-b-2 border-blue-600 hover:border-blue-600 text-blue-600'
                        : 'hover:border-b-2 hover:border-gray-300'
                    }`}
                    type="button"
                    role="tab"
                    onClick={() => setTab('4')}
                  >
                    Component 4
                  </button>
                </li>
              </ul>
            </div>
          )}
          {loading ? (
            <Skeleton height={600} />
          ) : (
            <div className="pt-2">
              <div
                className={`${
                  tab === '1' ? 'block' : 'hidden'
                } p-4 bg-gray-50 rounded-lg dark:bg-gray-800`}
              >
                <p className="mb-5 text-center tablet:w-2/8 xs:w-full">
                  Click to edit the definition in YAML {'</>'}
                </p>
                <div className="flex flex-wrap">
                  <div className="large:w-2/9">
                    {fieldSets.map((fieldset: fieldSet, index: number) => (
                      <div
                        key={fieldset.heading}
                        className={`border border-gray-400 rounded flex flex-col justify-between w-full p-3 ${
                          (index + 1) % 2 === 0 && 'my-5'
                        }`}
                      >
                        <p className="text-base text-gray-600 font-medium pb-2">
                          {fieldset.heading}
                        </p>
                        <div className="flex justify-between flex-wrap">
                          {fieldset.inputs.map((input: input) => (
                            <div
                              key={input.label}
                              className="flex flex-col xs:w-full tablet:w-2/7"
                            >
                              <label
                                className="text-gray-500 font-normal"
                                htmlFor={input.label}
                              >
                                {input.label}
                                :
                                <input
                                  // onChange={(
                                  //   e: ChangeEvent<HTMLInputElement>
                                  // ) => {
                                  //   setForm({
                                  //     ...form,
                                  //     [input.key]: e.target.value
                                  //   })
                                  // }}
                                  id={input.label}
                                  type={input.type}
                                  value={input.value ?? ''}
                                  className="border border-gray-300 rounded p-3 mt-0.5 mb-3 h-12 w-full focus-visible:outline-none focus:border-blue-500 focus:border"
                                  placeholder={input.placeholder}
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="large:w-2/10 xs:w-full ml-3">
                    <Editor
                      defaultLanguage="yaml"
                      height="500px"
                      language="yaml"
                      theme="vs-dark"
                      defaultValue={YAML.stringify(obj)}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`${
                  tab === '2' ? 'block' : 'hidden'
                } p-4 bg-gray-50 rounded-lg dark:bg-gray-800`}
              >
                2
              </div>
              <div
                className={`${
                  tab === '3' ? 'block' : 'hidden'
                } p-4 bg-gray-50 rounded-lg dark:bg-gray-800`}
              >
                3
              </div>
              <div
                className={`${
                  tab === '4' ? 'block' : 'hidden'
                } p-4 bg-gray-50 rounded-lg dark:bg-gray-800`}
              >
                4
              </div>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <Skeleton
          height={44}
          width="300px"
          containerClassName="flex justify-end items-end mt-2"
        />
      ) : (
        <div className="flex justify-end items-end my-3">
          <button
            type="button"
            className="bg-blue-500 text-white font-medium rounded-md py-2.5 px-7"
          >
            Deploy Application
          </button>
        </div>
      )}
    </div>
  )
}

export default CatalogApplication
