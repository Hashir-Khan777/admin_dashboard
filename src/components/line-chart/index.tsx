import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Title
)

interface appChartData {
  name: string
  cost: number
  color: string
  timestamp?: string
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

function LineChartComponent({ data }: { data: appChartData[] }) {
  const timestamps: string[] = []
  const datasets: any[] = []
  const chartData = data.reduce((acc: any, curr) => {
    if (curr.timestamp) {
      timestamps.push(curr.timestamp)
    }
    const cost = data.reduce((appAcc: any[], appCrr) => {
      if (appCrr.name === curr.name) appAcc.push(appCrr.cost)
      return appAcc
    }, [])
    if (datasets.findIndex((data) => data.label === curr.name) === -1) {
      datasets.push({
        label: curr.name,
        type: 'line',
        data: cost,
        fill: false,
        borderColor: curr.color
      })
    }
    acc = {
      labels: timestamps.filter((v, i, a) => a.indexOf(v) === i),
      datasets
    }
    return acc
  }, {})

  return (
    <div className="w-full my-2 xs:mr-0 tablet:mr-3 p-4 flex justify-between items-center">
      {data.length && <Chart type="line" data={chartData} options={options} />}
    </div>
  )
}

export default LineChartComponent
