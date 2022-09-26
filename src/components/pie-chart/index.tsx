import {
  Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer
} from 'recharts'

interface appChartData {
  name: string
  cost: number
  color: string
}

function PieChartComponent({ data }: { data: appChartData[]}) {
  return (
    <div className="w-full my-2 xs:mr-0 tablet:mr-3 p-4 flex justify-between items-center">
      <ResponsiveContainer height={300}>
        <PieChart width={730} height={250}>
          <Pie
            data={data}
            dataKey="cost"
            nameKey="name"
            innerRadius={0}
            outerRadius={100}
            fill="#82ca9d"
          >
            <LabelList dataKey="cost" position="inside" />
            {data.map((entry) => (
              <Cell key={entry.color} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartComponent
