import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

function InfrastructureHealth({ value, maxValue = 100 }: { value: number, maxValue?: number}) {
  return (
    <div className="tablet:w-2/7 min-h-440 border border-gray-300 h-full xs:w-full my-2 xs:mr-0 tablet:mr-3 p-4 flex justify-center items-center hover:bg-gray-100">
      <div className="flex justify-center items-start tablet:w-2/3 desktop:w-2/8 relative">
        <CircularProgressbar
          value={value}
          strokeWidth={14}
          text={value.toString()}
          circleRatio={0.6}
          maxValue={maxValue}
          className="w-full"
          styles={buildStyles({
            rotation: 1 / 2 + 1.6 / 8,
            strokeLinecap: 'butt',
            trailColor: '#eee',
            pathColor: 'green',
            textColor: 'green'
          })}
        />
        <p className="absolute text-xs mt-2" style={{ top: '57%' }}>
          Your health score is
          <span className="text-green-700"> GOOD</span>
        </p>
      </div>
    </div>
  )
}

export default InfrastructureHealth
