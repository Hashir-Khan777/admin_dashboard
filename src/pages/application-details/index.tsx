import {
    BarChartComponent, ComponentModal, LineChartComponent, PieChartComponent, Table
} from 'components'
import useApplication from 'hooks/useApplication'
import useComponent from 'hooks/useComponent'
import useProject from 'hooks/useProject'
import { useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { DateRangePicker } from 'react-date-range'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import Skeleton from 'react-loading-skeleton'
import { Link, useParams } from 'react-router-dom'
import { application } from 'services/application.interface'
import { component, trait } from 'services/component.interface'
import { projectCost } from 'services/project.interface'
import './index.css'

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
interface appChartData {
  name: string
  cost: number
  color: string
}
interface modalData {
  heading: string
  buttonText: string
  fieldSets: fieldSet[]
  type: string
}

const startDate = new Date(
  new Date().setDate(new Date().getDate() - 7)
).toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})
const endDate = new Date().toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})
const componentFieldSets: fieldSet[] = [
  {
    heading: 'Basic Configuration',
    inputs: [
      {
        disabled: false,
        label: 'Name',
        placeholder: 'Name',
        required: true,
        type: 'text',
        value: null,
        key: 'name'
      },
      {
        disabled: false,
        label: 'Type',
        placeholder: 'Type',
        required: true,
        type: 'text',
        value: null,
        key: 'type'
      }
    ]
  },
  {
    heading: 'Properties',
    inputs: [
      {
        disabled: false,
        label: 'Port',
        placeholder: 'Port',
        required: true,
        type: 'text',
        value: null,
        key: 'properties/port'
      },
      {
        disabled: false,
        label: 'Domain',
        placeholder: 'Domain',
        required: true,
        type: 'text',
        value: null,
        key: 'properties/domain'
      },
      {
        disabled: false,
        label: 'HTTP',
        placeholder: 'HTTP',
        required: true,
        type: 'text',
        value: null,
        key: 'properties/http'
      },
      {
        disabled: false,
        label: 'Replicas',
        placeholder: 'Replicas',
        required: true,
        type: 'number',
        value: null,
        key: 'properties/replicas'
      },
      {
        disabled: false,
        label: 'Properties',
        placeholder: 'Properties',
        required: true,
        type: 'text',
        value: null,
        key: 'properties/properties'
      }
    ]
  }
]
const tableHead = ['Name', 'State', 'Cpu', 'Ram', 'Storage', '']
let tableBody: any[] = []
const tableKeys: string[] = ['name', 'state', 'cpu', 'ram', 'storage', 'link']

function ApplicationDetails() {
  const [chartData, setChartData] = useState<appChartData[]>([])
  const [dropdownDownOpen, setDropdownDownOpen] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<modalData>({
    heading: '',
    buttonText: '',
    fieldSets: [
      {
        heading: '',
        inputs: [
          {
            disabled: false,
            label: '',
            placeholder: '',
            required: false,
            type: '',
            value: '',
            key: ''
          }
        ]
      }
    ],
    type: ''
  })
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('overview')
  const [sidebarTab, setSidebarTab] = useState<string>('overviewtab')
  const { projectId, applicationId } = useParams()
  const [treeChartData, setTreeChartData] = useState<any>()
  const [open, setOpen] = useState(false)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [dateData, setDateData] = useState(`${startDate} / ${endDate}`)

  const {
    application, getApplicationById, getApplicationComponents, applicationComponents, loading
  } = useApplication()
  const { getProjectById, project } = useProject()
  const { getCumulativeCostOfComponent } = useComponent()

  const getCost = (costType: string): string | undefined => {
    const Cost: number = applicationComponents?.reduce((acc: number, curr: component) => {
      if (curr.cost) {
        for (let i = 0; i < Object.keys(curr.cost).length; i++) {
          acc += Number(curr.cost[Object.keys(curr.cost)[i]][costType as keyof projectCost['__idle__']])
        }
        return acc;
      }
      return acc;
    }, 0) || 0
    return Cost?.toFixed(2)
  }

  const handleOnChange = (ranges: any) => {
    setDateData(
      `${ranges.selection.startDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} / ${ranges.selection.endDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`
    )

    const { selection } = ranges
    setState([selection] as any)
  }

  const getComponentCost = (costType: string, component: any): string => {
    let Cost = 0;
    if (component.cost) {
      for (let i = 0; i < Object.keys(component.cost).length; i++) {
        Cost += Number(component.cost[Object.keys(component.cost)[i]][costType as keyof projectCost['__idle__']])
      }
    }
    return Number(Cost).toFixed(2)
  }

  const getComponentEffeciency = (effeciencyType: string, component: any): string => {
    let effeciency = 0;
    if (component.cost) {
      for (let i = 0; i < Object.keys(component.cost).length; i++) {
        effeciency += Number(component.cost[Object.keys(component.cost)[i]][effeciencyType as keyof projectCost['__idle__']])
      }
    }
    return Number(effeciency).toFixed(2)
  }

  useEffect(() => {
    getProjectById(projectId)
    getApplicationById(applicationId)
  }, [getApplicationById, applicationId, getProjectById, projectId])
  useEffect(() => {
    if (application) {
      getApplicationComponents(application?.name).then((data: any) => {
        if (data.length) {
          data?.map((component: component) => {
            getCumulativeCostOfComponent(component.name).then((costData: any) => {
              data.map((comp: component, index: number) => {
                if (data.length) data[index].cost = costData
                return data
              })
              if (data) {
                tableBody = data.reduce((acc: any[], curr: application) => {
                  const obj = {
                    name: curr.name,
                    state: curr?.status?.healthy
                      ? 'running'
                      : 'not running',
                    cpu:
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{
        width: `${getComponentEffeciency('cpuEfficiency', curr)}%`
      }}
    />
  </div>,
                    ram:
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{
        width: `${getComponentEffeciency('ramEfficiency', curr)}%`
      }}
    />
  </div>,
                    storage:
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{
        width: `${getComponentEffeciency('ramEfficiency', curr)}%`
      }}
    />
  </div>,
                    link:
  <Link
    className="bg-blue-500 text-white px-4 py-2 rounded-sm"
    to={`/projects/${projectId}/applications/${applicationId}/components/${curr?.name}`}
  >
    Details
  </Link>
                  }
                  acc.push(obj)
                  return acc;
                }, [])
              }
              if (data && data?.length > 1) {
                const dataChart: appChartData[] = data?.reduce((
                  acc: any[],
                  curr: any
                ) => {
                  acc.push({
                    name: curr.name,
                    cost: Math.abs(Number(getComponentCost('totalCost', curr))),
                    color: '#00bfff'
                  })
                  return acc;
                }, [])
                setChartData(dataChart)
              }
              const treeChartChildrens = data.reduce((
                acc: any[],
                curr: component
              ) => {
                const subChildrenData = curr.traits?.reduce((
                  traitAcc: any[],
                  traitCurr: trait
                ) => {
                  traitAcc.push({
                    name: traitCurr.type
                  })
                  return traitAcc;
                }, [])
                acc.push({
                  name: curr.name,
                  children: subChildrenData
                })
                return acc
              }, [])
              const treeChartData = {
                name: application?.name,
                children: treeChartChildrens
              }
              setTreeChartData(treeChartData)
            })
            return data
          })
        }
      })
    }
    setTreeChartData(treeChartData)
  }, [application])
  useEffect(() => {
    if (applicationComponents && applicationComponents?.length > 1) {
      const dataChart: appChartData[] = applicationComponents?.reduce((
        acc: any[],
        curr: any,
        index: number
      ) => {
        const date: Date = new Date(
          new Date().setMonth(new Date().getMonth() - index)
        )
        acc.push({
          name: curr.name,
          cost: Math.abs(Number(getComponentCost('totalCost', curr))),
          color: '#00bfff',
          timestamp: date.getMonth().toString()
        })
        return acc;
      }, [])
      setChartData(dataChart)
    }
  }, [applicationComponents])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? (
        <Skeleton
          inline
          className="w-56 h-7 mb-5"
        />
      ) : (
        <div className="text-base font-medium text-gray-400 mb-5">
          <Link to="/projects" className="pr-1 hover:underline">
            projects
          </Link>
          <span className="px-1">/</span>
          <Link to={`/projects/${projectId}`} className="px-1 hover:underline">
            {project?.name}
          </Link>
          <span className="px-1">/</span>
          <Link to={`/projects/${projectId}`} className="px-1 hover:underline">
            application
          </Link>
          <span className="px-1">/</span>
          <span className="pl-1">{application?.name}</span>
        </div>
      )}
      {loading ? (
        <Skeleton
          count={4}
          inline
          width="24%"
          height={112}
          containerClassName="flex justify-between"
        />
      ) : (
        <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
          <div className="tablet:w-3/12 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-center flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">
                {applicationComponents?.length}
              </p>
              <p className="text-base font-medium text-gray-800">Components</p>
            </div>
          </div>
          <div className="tablet:w-3/12 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-between flex-row items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-3xl font-semibold text-gray-800">
                $ {getCost('totalCost')}
              </p>
              <p className="text-base font-medium text-gray-800">Monthly Cost</p>
            </div>
          </div>
          <div className="tablet:w-3/12 xs:w-full border border-gray-300 rounded-md my-2 px-4 py-3 flex justify-center flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">$ 3</p>
              <p className="text-base font-medium text-gray-800">
                Identified Savings
              </p>
            </div>
          </div>
          <div className="tablet:w-3/12 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-3 px-4 py-3 flex justify-between flex-row items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center flex-1">
              {application?.status?.healthy ? (
                <div className="w-8 h-8 rounded-full bg-green-400 mb-2" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-400 mb-2" />
              )}
              <p className="text-base font-medium text-gray-800">Status</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between large:flex-row xs:flex-col my-5 w-full">
            {loading ? (
              <Skeleton
                height={700}
                containerClassName="w-1/6"
              />
            ) : (
              <div className="large:h-99 flex xs:flex-row large:flex-col xs:w-full xs:h-14 large:w-1/6 border border-gray-300 rounded-md">
                <span
                  onClick={() => setSidebarTab('overviewtab')}
                  className={`py-3 px-4 text-gray-800 font-medium rounded-t-md cursor-pointer ${
                    sidebarTab === 'overviewtab' && 'bg-gray-100'
                  }`}
                >
                  Overview
                </span>
                <span
                  onClick={() => setSidebarTab('workflow')}
                  className={`py-3 px-4 text-gray-800 font-medium cursor-pointer ${
                    sidebarTab === 'workflow' && 'bg-gray-100'
                  }`}
                >
                  Workflow
                </span>
              </div>
            )}
            {loading ? (
              <Skeleton
                height={700}
                containerClassName="w-1/1"
              />
            ) : (
              <div className="h-99 border border-gray-300 rounded-md py-2 px-3 xs:ml-0 xs:mt-3 large:ml-0 large:mt-0 flex flex-col justify-between xs:w-full large:w-1/1 overflow-hidden">
                <div className="h-full">
                  <div className="flex justify-between">
                    <ul className="flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 large:flex xs:hidden">
                      <li>
                        <button
                          type="submit"
                          className={`font-medium text-sm uppercase px-6 py-3 hover:bg-gray-100 rounded-t-md ${
                            tab === 'overview' && 'border-b-2 border-blue-500'
                          }`}
                          onClick={() => setTab('overview')}
                        >
                          Overview
                        </button>
                      </li>
                      <li>
                        <button
                          type="submit"
                          className={`font-medium text-sm uppercase px-6 py-3 hover:bg-gray-100 rounded-t-md ${
                            tab === 'graph' && 'border-b-2 border-blue-500'
                          }`}
                          onClick={() => setTab('graph')}
                        >
                          Graph
                        </button>
                      </li>
                    </ul>
                    <div
                      className="cursor-pointer xs:block large:hidden relative"
                      onClick={() => setDropdownDownOpen(!dropdownDownOpen)}
                    >
                      <BiDotsHorizontalRounded size={20} />
                      <div
                        className={`dropdown-body w-24 absolute border-2 border-gray-200 top-5 left-0 bg-white rounded ${
                          dropdownDownOpen && 'dropdown-open'
                        }`}
                      >
                        <button
                          type="submit"
                          onClick={() => setTab('overview')}
                          className="border-b border-gray-100 hover:bg-gray-50 py-2 px-2"
                        >
                          Overview
                        </button>
                        <button
                          type="submit"
                          onClick={() => setTab('graph')}
                          className="py-2 px-2 hover:bg-gray-50"
                        >
                          Graph
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-full">
                    {sidebarTab === 'overviewtab' && (
                      <>
                        {tab === 'overview' && (
                          <div>
                            <div className="flex flex-wrap items-center justify-between mb-2">
                              <p className="text-base text-gray-700 font-medium">
                                Overview
                              </p>
                              <div>
                                <button
                                  type="submit"
                                  onClick={() => {
                                    setIsEdit(!isEdit)
                                    setModalData({
                                      buttonText: 'Update',
                                      heading: `Edit ${application?.name}`,
                                      type: 'update application',
                                      fieldSets: [
                                        {
                                          heading: 'Basic Configuration',
                                          inputs: [
                                            {
                                              disabled: false,
                                              key: 'name',
                                              label: 'Name',
                                              placeholder: 'Name',
                                              required: true,
                                              type: 'text',
                                              value: application?.name
                                            },
                                            {
                                              disabled: false,
                                              key: 'namespace',
                                              label: 'Name Space',
                                              placeholder: 'Name Space',
                                              required: true,
                                              type: 'text',
                                              value: application?.namespace
                                            }
                                          ]
                                        },
                                        {
                                          heading: 'Meta Data',
                                          inputs: [
                                            {
                                              disabled: false,
                                              key: 'metadata/annotations/version',
                                              label: 'Version',
                                              placeholder: 'Version',
                                              required: true,
                                              type: 'text',
                                              value:
                                                application?.metadata?.annotations
                                                  ?.version
                                            }
                                          ]
                                        }
                                      ]
                                    })
                                  }}
                                  className="bg-blue-500 text-white rounded-md py-2 px-5"
                                >
                                  Edit
                                </button>
                                <button
                                  type="submit"
                                  className="bg-blue-500 text-white rounded-md py-2 px-5 mx-2"
                                >
                                  Refresh
                                </button>
                                <button
                                  type="submit"
                                  onClick={() => {
                                    setIsOpen(!isOpen)
                                    setModalData({
                                      heading: 'Create New Component',
                                      buttonText: 'Save',
                                      fieldSets: componentFieldSets,
                                      type: 'component'
                                    })
                                  }}
                                  className="bg-blue-500 text-white rounded-md py-2 px-5"
                                >
                                  New Component
                                </button>
                              </div>
                            </div>
                            <div className="w-full">
                              <div className="tablet:w-full mb-3 xs:w-full border border-gray-300 rounded-md p-3 hover:bg-gray-100 savings">
                                <div className="flex justify-end w-full -mt-1">
                                  <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded-md py-2 px-5"
                                  >
                                    Service Endpoint
                                  </button>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex flex-row flex-wrap w-full">
                                    <div className="flex">
                                      <p className="text-sm mb-1 text-gray-500 w-36">
                                        Name:
                                      </p>
                                      <p className="w-64 text-sm mb-1 text-gray-800 break-words">
                                        {application?.name}
                                      </p>
                                    </div>
                                    <div className="flex">
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-500">
                                        Version:
                                      </p>
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-800">
                                        {
                                          application?.metadata?.annotations
                                            ?.version
                                        }
                                      </p>
                                    </div>
                                    <div className="flex">
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-500">
                                        Health:
                                      </p>
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-800">
                                        {application?.status?.healthy
                                          ? 'strong'
                                          : 'week'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-row flex-wrap w-full">
                                    <div className="flex">
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-500">
                                        Description:
                                      </p>
                                      <p className="w-64 text-sm mb-1 pt-1 text-blue-700 font-medium break-words">
                                        {application?.description}
                                      </p>
                                    </div>
                                    <div className="flex">
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-500" />
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-800" />
                                    </div>
                                    <div className="flex">
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-500">
                                        Status:
                                      </p>
                                      <p className="w-36 text-sm mb-1 pt-1 text-gray-800">
                                        {application?.status?.status}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between w-full xs:flex-col large:flex-row border border-gray-300 rounded-md">
                              <div className="tablet:w-full large:w-2/7 xs:w-full xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
                                <div className="border-b border-gray-200 my-3 overflow-auto">
                                  <Table
                                    tableHead={tableHead}
                                    tableBody={tableBody}
                                    tableKeys={tableKeys}
                                  />
                                </div>
                              </div>
                              <div className="tablet:w-full large:w-2/7 xs:w-full xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
                                <span className="text-lg font-medium text-gray-800 pb-3">
                                  Component Cost Allocation
                                </span>
                                <div className="flex items-center justify-center">
                                  <PieChartComponent data={chartData} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {tab === 'graph' && <div className="h-full"><Tree translate={{ x: 250, y: 300 }} data={treeChartData} /></div>}
                      </>
                    )}
                    {sidebarTab === 'workflow' && <p>abcd</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <Skeleton
          count={2}
          inline
          width="49%"
          height={380}
          containerClassName="flex justify-between"
        />
      ) : (
        <div className="flex flex-col justify-end items-end">
          <div className="flex justify-between xs:flex-col large:flex-row xs:w-full large:w-full">
            <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
              <span className="text-lg font-medium text-gray-800 pb-3">
                Cumulative cost for last 7 days by component
              </span>
              <div className="flex item s-center justify-center">
                <BarChartComponent data={chartData} />
              </div>
            </div>
            <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800 pb-3">
                  Historical cost by component
                </span>
                <div className="flex flex-col relative">
                  <input
                    value={dateData}
                    onClick={() => setOpen(!open)}
                    placeholder="Date"
                    type="text"
                    className="cursor-pointer w-48 shadow-3xl px-3 py-1.5 text-sm rounded-md focus-visible:outline-none focus:border-blue-500 focus:border"
                  />
                  {open && (
                    <DateRangePicker
                      editableDateInputs
                      ranges={state}
                      onChange={handleOnChange}
                      staticRanges={[]}
                      inputRanges={[]}
                      className="z-50 absolute right-0 top-11 border border-gray-200"
                    />
                  )}
                </div>
              </div>
              <div className="flex item s-center justify-center">
                <LineChartComponent data={chartData} />
              </div>
            </div>
          </div>
        </div>
      )}
      <ComponentModal
        heading={modalData.heading}
        buttonText={modalData.buttonText}
        fieldSets={modalData.fieldSets}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        type={modalData.type}
        id=""
      />
      <ComponentModal
        heading={modalData.heading}
        buttonText={modalData.buttonText}
        fieldSets={modalData.fieldSets}
        isOpen={isEdit}
        setIsOpen={setIsEdit}
        type={modalData.type}
        id={application?.id}
        isYaml
      />
    </div>
  )
}

export default ApplicationDetails
