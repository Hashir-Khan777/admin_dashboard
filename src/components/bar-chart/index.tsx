import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface appChartData {
  name: string
  cost: number
  color: string
}

function BarChartComponent({ data }: { data: appChartData[] }) {
  return (
    <div className="w-full my-2 xs:mr-0 tablet:mr-3 p-4 flex justify-between items-center">
      <ResponsiveContainer height={300}>
        <BarChart width={730} height={250} data={data}>
          <XAxis dataKey="name" />
          <YAxis dataKey="cost" />
          <Tooltip />
          <Bar dataKey="cost" fill="#00bfff">
            {data.map((entry: appChartData) => (
              <Cell key={entry.color} fill={entry.color} />
            ))}
          </Bar>
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartComponent
