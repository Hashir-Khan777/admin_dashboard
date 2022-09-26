import {
    BarChartComponent, LineChartComponent, PieChartComponent, Table
} from 'components'
import useProject from 'hooks/useProject'
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import { BsTable } from 'react-icons/bs'
import { TiArrowUpThick } from 'react-icons/ti'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom'
import { Project } from 'services/project.interface'
import './index.css'

interface appChartData {
  name: string
  cost: number
  color: string
}

const tableHead = ['Name', 'Application', 'Cost', 'Efficiency', 'Budget', '']
let tableBody: any[] = []
const tableKeys: string[] = ['name', 'apps', 'cost', 'effeciency', 'budget', 'link']
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

function Home() {
  const [chartData, setChartData] = useState<appChartData[]>([])
  const [historyChart, setHistoryChartData] = useState<appChartData[]>([])
  const [totalCost, setTotalCost] = useState<number>(0)
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
    getAllProjects,
    projects,
    loading,
    getProjectCumulativeCost,
    getProjectHistoricalCost,
  } = useProject()

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
    getAllProjects()
  }, [getAllProjects])
  useEffect(() => {
    getProjectCumulativeCost().then((data: any) => {
      let cost = 0;
      if (projects && projects?.length > 1) {
        const dataChart: appChartData[] = projects?.reduce((acc: any[], curr: Project) => {
          cost += data[curr.name].totalCost
          setTotalCost(cost)
          acc.push({
            name: curr.name,
            cost: data[curr.name].totalCost,
            color: '#00bfff'
          })
          tableBody = projects.reduce((acc: any[], curr: Project) => {
            const obj = {
              name: curr.name,
              apps: 3,
              cost: `$${data[curr.name].totalCost.toFixed(2)}`,
              effeciency: `${data[curr.name].totalEfficiency.toFixed(2)}%`,
              budget: '',
              link: <Link className="bg-blue-500 text-white px-4 py-2 rounded-sm" to={`/projects/${curr.id}`}>Details</Link>
            }
            acc.push(obj)
            return acc;
          }, [])
          return acc;
        }, []) || []
        setChartData(dataChart)
      }
    })
  }, [projects, getProjectCumulativeCost])
  useEffect(() => {
    getProjectHistoricalCost().then((data: any) => {
      let Cost = 0;
      const historyChartData: appChartData[] = projects?.reduce((acc: any[], curr: Project) => {
        data.reduce((dataAcc: any, dataCurr: any) => {
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
          return dataAcc;
        }, {})
        return acc;
      }, []) || []
      setHistoryChartData(historyChartData)
    })
  }, [projects, getProjectHistoricalCost])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? <Skeleton className="text-xl font-medium w-48" /> : <p className="text-xl font-medium">Dashboard</p>}
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
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-between flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">
                {projects?.length}
              </p>
              <p className="text-base font-medium text-gray-800">Projects</p>
            </div>
            <Link to="/projects" className="w-full">
              <p className="w-full underline text-blue-500 text-xs cursor-pointer flex justify-end">
                Go to projects
              </p>
            </Link>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-3 px-4 py-3 flex justify-between flex-row items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-3xl font-semibold text-gray-800">
                $ {totalCost}
              </p>
              <p className="text-base font-medium text-gray-800">Monthly Cost</p>
            </div>
            <p className="text-lime-600 text-3xl cursor-pointer flex justify-end">
              <TiArrowUpThick />
            </p>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 px-4 py-3 flex justify-between flex-col items-center hover:bg-gray-100 h-28 savings">
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl font-semibold text-gray-800">$ 32</p>
              <p className="text-base font-medium text-gray-800">
                Identified Savings
              </p>
            </div>
            <p className="w-full underline text-blue-500 text-xs cursor-pointer flex justify-end">
              View savings
            </p>
          </div>
        </div>
      )}
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
                  Projects
                </span>
              </div>
              <div>
                <div className="border-b border-gray-200 my-3 overflow-auto">
                  <Table tableHead={tableHead} tableBody={tableBody} tableKeys={tableKeys} />
                </div>
              </div>
            </div>
            <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
              <span className="text-lg font-medium text-gray-800 pb-3">
                Project Cost Allocation
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
        <div className="flex justify-between w-full xs:flex-col large:flex-row">
          <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
            <span className="text-lg font-medium text-gray-800 pb-3">
              Cumulative cost for last 7 days by project
            </span>
            <div className="flex item s-center justify-center">
              <BarChartComponent data={chartData} />
            </div>
          </div>
          <div className="tablet:w-full large:w-2/7 xs:w-full border border-gray-300 rounded-md my-2 xs:ml-0 tablet:ml-0 large:ml-3 px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800 pb-3">
                Historical cost by project
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
              <LineChartComponent data={historyChart} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
