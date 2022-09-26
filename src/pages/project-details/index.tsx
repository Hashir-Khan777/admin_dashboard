import {
    BarChartComponent,
    ComponentModal,
    LineChartComponent,
    PieChartComponent,
    Table
} from 'components'
import useApplication from 'hooks/useApplication'
import useProject from 'hooks/useProject'
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsTable } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import { Link, useParams } from 'react-router-dom'
import { application } from 'services/application.interface'
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
interface modalData {
  heading: string
  buttonText: string
  fieldSets: fieldSet[]
  type: string
}
interface appChartData {
  name: string
  cost: number
  color: string
  timestamp?: string
}

const applicationFieldSets: fieldSet[] = [
  {
    heading: 'Basic Configuration',
    inputs: [
      {
        disabled: false,
        label: 'Name',
        placeholder: 'Name',
        required: true,
        type: 'text',
        key: 'name',
        value: ''
      },
      {
        disabled: false,
        label: 'Name space',
        placeholder: 'Name space',
        required: true,
        type: 'text',
        key: 'namespace',
        value: ''
      },
      {
        disabled: false,
        label: 'Resource Version',
        placeholder: 'Resource Version',
        required: true,
        type: 'number',
        key: 'resourceVersion',
        value: ''
      }
    ]
  },
  {
    heading: 'Meta Data',
    inputs: [
      {
        disabled: false,
        label: 'Description',
        placeholder: 'Description',
        required: true,
        type: 'text',
        key: 'metadata/annotations/description',
        value: ''
      },
      {
        disabled: false,
        label: 'Version',
        placeholder: 'Version',
        required: true,
        type: 'number',
        key: 'metadata/annotations/version',
        value: ''
      }
    ]
  }
]
const tableHead = ['Name', 'Environment', 'Cost', 'Efficiency', 'Health', '']
const tableKeys: string[] = [
  'name',
  'env',
  'cost',
  'effeciency',
  'health',
  'link'
]
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

function ProjectDetails() {
  const [chartData, setChartData] = useState<appChartData[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [tableBody, setTableBody] = useState<any[]>([])
  const [historyChartData, setHistoryChartData] = useState<any[]>([])
  const [applicationsLength, setApplicationsLength] = useState<number>(0)
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
  const [open, setOpen] = useState(false)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [dateData, setDateData] = useState(`${startDate} / ${endDate}`)
  const [totalCost, setTotalCost] = useState<number>(0)

  const {
    getProjectById,
    getProjectApplications,
    project,
    loading,
  } = useProject()
  const { getCostOfApplication, getHistoricalCostOfApplication } = useApplication()
  const { projectId } = useParams()

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

  useEffect(() => {
    getProjectById(projectId)
  }, [getProjectById, projectId])
  useEffect(() => {
    let cost = 0;
    getProjectApplications(projectId).then((data: any) => {
      setApplicationsLength(data.length)
      getCostOfApplication(projectId).then((costData: any) => {
        const table = data.reduce(
          (acc: any[], curr: application) => {
            cost += costData[curr.name].totalCost
            setTotalCost(Number(cost.toFixed(2)))
            const obj = {
              name: curr.name,
              env: 'dev',
              cost: `$${costData[curr.name].totalCost.toFixed(2)}`,
              effeciency: `${costData[curr.name].totalEfficiency.toFixed(2)}%`,
              health: curr.status?.healthy ? (
                <div className="flex items-center justify-center w-6 h-6 bg-green-400 rounded-full" />
              ) : (
                <div className="flex items-center justify-center w-6 h-6 bg-red-400 rounded-full" />
              ),
              link: (
                <Link
                  className="bg-blue-500 text-white px-4 py-2 rounded-sm"
                  to={`/projects/${projectId}/applications/${curr.name}`}
                >
                  Details
                </Link>
              )
            }
            acc.push(obj)
            return acc
          },
          []
        )
        setTableBody(table)
        const dataChart: appChartData[] = data.reduce(
          (acc: appChartData[], curr: application, index: number) => {
            const date: Date = new Date(
              new Date().setMonth(new Date().getMonth() - index)
            )
            acc.push({
              name: curr.name || '',
              cost: costData[curr.name].totalCost,
              color: '#00bfff',
              timestamp: date.getMonth().toString()
            })
            return acc
          },
          []
        )
        setChartData(dataChart)
      })
      getHistoricalCostOfApplication(projectId).then((historyCostData: any) => {
        let Cost = 0;
        const historyChartData: appChartData[] = data.reduce((acc: any[], curr: any) => {
          historyCostData.reduce((dataAcc: any, dataCurr: any) => {
            if (Object.keys(dataCurr).length > 0 && dataCurr[curr.name]) {
              Cost += dataCurr[curr.name].totalCost
              const obj = {
                name: dataCurr[curr.name].name,
                timestamp: new Date(dataCurr[curr.name].end).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  year: 'numeric'
                }),
                cost: Cost,
                color: '#00bfff'
              }
              acc.push(obj)
            }
            return dataAcc;
          }, {})
          return acc;
        }, []) || []
        setHistoryChartData(historyChartData)
      })
    })
  }, [getProjectApplications, projectId])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? (
        <Skeleton
          count={2}
          inline
          className="w-48 h-7"
          containerClassName="flex justify-between my-3 text-xl font-medium"
        />
      ) : (
        <div className="flex xs:flex-col desktopMini:flex-row items-start justify-between mb-5 w-full">
          <p className="text-xl font-medium xs:pb-3">{project?.name}</p>
          <div className="flex xs:justify-end xs:self-end desktopMini:justify-between">
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen)
                setModalData({
                  heading: `Edit Project ${project?.name}`,
                  buttonText: 'Update',
                  fieldSets: [
                    {
                      heading: 'Basic Configuration',
                      inputs: [
                        {
                          disabled: false,
                          label: 'Name',
                          placeholder: 'Name',
                          required: true,
                          type: 'text',
                          key: 'name',
                          value: project?.name
                        }
                      ]
                    }
                  ],
                  type: 'update project'
                })
              }}
              className="bg-blue-500 text-white rounded-md py-2.5 px-7 mr-2"
            >
              Edit Project
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen)
                setModalData({
                  heading: 'Create New Application',
                  buttonText: 'Save',
                  fieldSets: applicationFieldSets,
                  type: 'application'
                })
              }}
              className="bg-blue-500 text-white rounded-md py-2.5 px-7 ml-2"
            >
              Create Application
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <Skeleton
          count={3}
          inline
          width="32%"
          height={112}
          containerClassName="flex justify-between my-3"
        />
      ) : (
        <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-center flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">
                {applicationsLength}
              </p>
              <p className="text-base font-medium text-gray-800">
                Applications
              </p>
            </div>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-between flex-row items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-3xl font-semibold text-gray-800">
                $ {totalCost}
              </p>
              <p className="text-base font-medium text-gray-800">
                Monthly Cost
              </p>
            </div>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 px-4 py-3 flex justify-center flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">$ 32</p>
              <p className="text-base font-medium text-gray-800">
                Identified Savings
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        {loading ? (
          <Skeleton
            count={2}
            inline
            width="49%"
            height={360}
            containerClassName="flex justify-between my-3"
          />
        ) : (
          <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
            <div className="flex justify-between w-full xs:flex-col large:flex-row">
              <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
                <div className="w-full flex items-center pb-3">
                  <BsTable size={24} />
                  <span className="text-lg font-medium text-gray-800 px-4">
                    Applications
                  </span>
                </div>
                <div>
                  <div className="border-b border-gray-200 my-3 overflow-auto">
                    <Table
                      tableHead={tableHead}
                      tableBody={tableBody}
                      tableKeys={tableKeys}
                    />
                  </div>
                </div>
              </div>
              <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
                <span className="text-lg font-medium text-gray-800 pb-3">
                  Application Cost Allocation
                </span>
                <div className="flex items-center justify-center">
                  <PieChartComponent data={chartData} />
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton
            count={2}
            inline
            width="49%"
            height={380}
            containerClassName="flex justify-between my-3"
          />
        ) : (
          <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
            <div className="flex justify-between w-full xs:flex-col large:flex-row">
              <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
                <span className="text-lg font-medium text-gray-800 pb-3">
                  Cumulative cost for last 7 days of application
                </span>
                <div className="flex item s-center justify-center">
                  <BarChartComponent data={chartData} />
                </div>
              </div>
              <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800 pb-3">
                    Historical cost by application
                  </span>
                  <div className="flex flex-col relative">
                    <input
                      value={dateData}
                      onClick={() => setOpen(!open)}
                      placeholder="Date"
                      type="text"
                      className="cursor-pointer w-48 shadow-3xl px-3 py-1.5 text-sm rounded-md focus-visible:outline-none focus:border-blue-500 focus:border"
                      readOnly
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
                  <LineChartComponent data={historyChartData} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ComponentModal
        heading={modalData.heading}
        buttonText={modalData.buttonText}
        fieldSets={modalData.fieldSets}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        type={modalData.type}
        id={projectId}
      />
    </div>
  )
}

export default ProjectDetails
