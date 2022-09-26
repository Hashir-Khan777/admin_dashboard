import { BarChartComponent, CostBar, LineChartComponent } from 'components'
import useApplication from 'hooks/useApplication'
import useComponent from 'hooks/useComponent'
import useProject from 'hooks/useProject'
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import Skeleton from 'react-loading-skeleton'
import { Link, useParams } from 'react-router-dom'
import {
  Cell, Label, Pie, PieChart, ResponsiveContainer
} from 'recharts'
import { projectCost } from 'services/project.interface'

interface appChartData {
  name: string
  cost: number
  color: string
  timestamp?: string
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
const COLORS = ['#0088FE', '#e6e6e6'];

function CustomLabel({ viewBox, labelText, value }:any) {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fontSize="18"
        fontWeight="600"
      >
        {labelText}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fill="#0088FE"
        fontSize="22"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
}

function ComponentDetails() {
  const { projectId, applicationId, componentId } = useParams()
  const [open, setOpen] = useState(false)
  const [showGraph, setShowGraph] = useState<string>('bar')
  const [state, setState] = useState([
    {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      key: 'selection'
    }
  ])
  const [dateData, setDateData] = useState(`${startDate} / ${endDate}`)
  const [chartData, setChartData] = useState<appChartData[]>([])
  const [pieChartData, setPieChartData] = useState<any[]>([])

  const {
    getComponentById, getCumulativeCostOfComponent, component, loading
  } = useComponent()
  const { getProjectById, project } = useProject()
  const { getApplicationById, applicationComponents, application } = useApplication()

  const getCost = (costType: string): string | undefined => {
    let Cost = 0;
    if (component?.cost) {
      for (let i = 0; i < Object.keys(component?.cost).length; i++) {
        if (Object.keys(component?.cost)[i][costType as keyof projectCost['__idle__'] as any]) {
          Cost += Number(
            Object.keys(component?.cost)[i][costType as keyof projectCost['__idle__'] as any]
          )
        }
      }
    }
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

  useEffect(() => {
    getComponentById(componentId)
    getProjectById(projectId)
    getApplicationById(applicationId)
  }, [
    getComponentById,
    componentId,
    getApplicationById,
    getProjectById,
    projectId,
    applicationId,
    getCumulativeCostOfComponent
  ])
  useEffect(() => {
    getCumulativeCostOfComponent(componentId).then((data: any) => {
      const cost = getCost('cpuCost')
      const ramCost = getCost('ramCost')
      if (component) {
        component.cost = data;
        const date: Date = new Date(
          new Date().setMonth(new Date().getMonth())
        )
        const dataChart = [{
          name: component.name,
          cost: Math.abs(Number(cost)),
          color: '#00bfff',
          timestamp: date.getMonth().toString()
        }]
        setChartData(dataChart)
        const dataPieChart = [
          {
            name: component.name,
            cost: applicationComponents.length ? (
              Math.abs(Number(cost)) / (applicationComponents.length * 100)
            ) * 100 : 0,
            ram: applicationComponents.length ? (
              Math.abs(Number(ramCost)) / (applicationComponents.length * 100)
            ) * 100 : 0,
            color: '#00bfff',
            timestamp: date.getMonth().toString()
          },
          {
            cost: 100,
            ram: 100,
          }
        ]
        setPieChartData(dataPieChart)
      }
    })
  }, [component])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? (
        <Skeleton inline className="w-98 h-7 mb-5" />
      ) : (
        <div className="text-base font-medium text-gray-400 mb-5">
          <Link to="/projects" className="pr-1 hover:underline">
            projects
          </Link>
          <span className="px-1">/</span>
          <Link
            to={`/projects/${projectId}`}
            className="px-1 hover:underline"
          >
            {project?.name}
          </Link>
          <span className="px-1">/</span>
          <Link
            to={`/projects/${projectId}`}
            className="px-1 hover:underline"
          >
            application
          </Link>
          <span className="px-1">/</span>
          <Link
            to={`/projects/${projectId}/applications/${applicationId}`}
            className="px-1 hover:underline"
          >
            {application?.name}
          </Link>
          <span className="px-1">/</span>
          <span className="px-1">component</span>
          <span className="px-1">/</span>
          <span className="pl-1">{componentId}</span>
        </div>
      )}
      <div className="flex justify-end">
        {loading ? (
          <Skeleton inline className="w-80 h-11 mb-3" />
        ) : (
          <div className="flex flex-col relative h-10">
            <input
              value={dateData}
              onClick={() => setOpen(!open)}
              placeholder="Date"
              type="text"
              className="cursor-pointer w-64 shadow-3xl mb-2 px-4 py-2 text-sm rounded-md focus-visible:outline-none focus:border-blue-500 focus:border"
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
        )}
      </div>
      {loading ? <Skeleton height={102} className="mb-1.5" /> : <CostBar getCost={getCost} />}
      <div className="flex justify-between w-full xs:flex-col large:flex-row">
        {loading ? (
          <Skeleton
            height={460}
            containerClassName="large:w-2/8 mt-1"
          />
        ) : (
          <div className="tablet:w-full h-100 large:w-2/8 xs:w-full border border-gray-300 rounded-md my-2 xs:mr-0 tablet:mr-0 large:mr-3 px-4 py-3">
            <div className="flex justify-between">
              <div>
                <span className="text-lg font-medium text-gray-800 pb-3">
                  Historical Cost
                </span>
              </div>
              <div>
                <span className={`text-sm font-medium text-blue-500 pb-3 px-1 uppercase cursor-pointer ${showGraph === 'bar' && 'underline'}`} onClick={() => setShowGraph('bar')}>
                  Bar
                </span>
                <span className="text-sm font-medium text-blue-500 pb-3 px-1 uppercase">
                  |
                </span>
                <span className={`text-sm font-medium text-blue-500 pb-3 px-1 uppercase cursor-pointer ${showGraph === 'line' && 'underline'}`} onClick={() => setShowGraph('line')}>
                  Line
                </span>
              </div>
            </div>
            {showGraph === 'bar' && (
              <div className="flex items-center justify-center">
                <BarChartComponent data={chartData} />
              </div>
            )}
            {showGraph === 'line' && (
              <LineChartComponent data={chartData} />
            )}
          </div>
        )}
        {loading ? (
          <Skeleton
            height={460}
            containerClassName="large:w-2/5 mt-1"
          />
        ) : (
          <div className="tablet:w-full h-100 large:w-2/5 my-2 xs:w-full border border-gray-300 flex flex-col rounded-md xs:mr-0 tablet:mr-0 p-2">
            <div className="flex flex-col items-center justify-center w-full">
              <span className="text-2xl font-bold text-gray-800">
                Cost Efficiency
              </span>
              <span className="text-2xl text-blue-400 font-bold">
                {getCost('cpuEfficiency')}%
              </span>
            </div>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="cost"
                  innerRadius={40}
                  outerRadius={60}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    content={<CustomLabel labelText="CPU" value={`${pieChartData.length && pieChartData[0].cost}%`} />}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="ram"
                  innerRadius={40}
                  outerRadius={60}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    content={<CustomLabel labelText="RAM" value={`${pieChartData.length && pieChartData[0].ram}%`} />}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton
          count={3}
          inline
          width="32%"
          height={160}
          containerClassName="flex justify-between my-3"
        />
      ) : (
        <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 mr-0 px-4 py-3 flex flex-col justify-center items-center hover:bg-gray-100 h-40 savings">
            <p className="xs:text-lg tablet:text-base desktop:text-lg font-bold text-gray-800">
              Monthly CPU Savings
            </p>
            <p className="xs:text-3xl tablet:text-xl desktop:text-3xl font-bold text-blue-400">€{getCost('cpuCost')}</p>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 px-4 py-3 flex justify-between flex-col items-center hover:bg-gray-100 h-40 savings">
            <div className="flex flex-col justify-center items-center xs:py-7 desktop:py-5">
              <p className="xs:text-lg tablet:text-base desktop:text-lg font-bold text-gray-800">
                Total Monthly Savings
              </p>
              <p className="xs:text-3xl tablet:text-xl desktop:text-3xl font-bold text-blue-400">€2.92</p>
            </div>
            <p className="w-full underline text-blue-400 font-semibold text-xs cursor-pointer flex justify-end uppercase">
              Request Sizing
            </p>
          </div>
          <div className="tablet:w-2/9 xs:w-full border border-gray-300 rounded-md my-2 :mr-0 px-4 py-3 flex flex-col justify-center items-center hover:bg-gray-100 h-40 savings">
            <p className="xs:text-lg tablet:text-base desktop:text-lg font-bold text-gray-800">
              Monthly RAM Savings
            </p>
            <p className="xs:text-3xl tablet:text-xl desktop:text-3xl font-bold text-blue-400">€{getCost('ramCost')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComponentDetails
