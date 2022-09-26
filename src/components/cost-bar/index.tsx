function CostBar({ getCost }: { getCost: CallableFunction }) {
  return (
    <div className="w-full border border-gray-300 rounded-md my-2 p-1 flex justify-around items-center hover:bg-gray-100 savings flex-wrap">
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-lg font-medium mb-1 text-gray-800">
          Total cost
          <span className="text-gray-500 px-1">(7d)</span>
        </p>
        <p className="text-3xl text-blue-800 font-medium">
          {`€${getCost('totalCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">CPU</p>
        <p className="text-3xl text-blue-400 font-medium">
          {`€${getCost('cpuCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">RAM</p>
        <p className="text-3xl text-orange-700 font-medium">
          {`€${getCost('ramCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">Network</p>
        <p className="text-3xl text-green-700 font-medium">
          {`€${getCost('networkCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">LB</p>
        <p className="text-3xl text-yellow-400 font-medium">
          {`€${getCost('ramCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">External</p>
        <p className="text-3xl text-teal-400 font-medium">
          {`€${getCost('externalCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">PV</p>
        <p className="text-3xl text-violet-500 font-medium">
          {`€${getCost('pvCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">Shared</p>
        <p className="text-3xl text-yellow-500 font-medium">
          {`€${getCost('sharedCost')}`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center xs:p-2.5 tablet:p-3">
        <p className="text-base font-medium mb-1 text-gray-700">GPU</p>
        <p className="text-3xl text-cyan-400 font-medium">
          {`€${getCost('gpuCost')}`}
        </p>
      </div>
    </div>
  )
}

export default CostBar
