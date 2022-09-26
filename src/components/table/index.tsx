import { useNavigate } from 'react-router-dom'

type TablePropsType = {
  tableHead: string[]
  tableBody: any
  tableKeys: string[]
}

function Table({ tableHead, tableBody, tableKeys }: TablePropsType) {
  const navigate = useNavigate()
  const handleTableRowClick = (to: string) => {
    navigate(to)
  }

  return (
    <table>
      <thead className="bg-blue-400 w-full py-4">
        <tr>
          {tableHead.map((head: string, index: number) => (
            <th
              key={`table-head-${index}`}
              className="px-2 border-r border-white py-4 w-48 text-left text-xs font-bold text-white uppercase tracking-wider default_color"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto block h-60 border border-gray-200">
        {tableBody?.map((data: any, index: number) => (
          <tr
            key={`table-body-${index}`}
            className="hover:bg-gray-100 border-b border-gray-200 border-solid cursor-pointer"
            onClick={() => handleTableRowClick(data.link.props.to)}
          >
            {tableKeys.map((key, keyIndex) => (
              <td key={`table-key-${keyIndex}`} className="px-4 py-2 whitespace-nowrap w-36 text-gray-800">
                {data[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
