import { MouseEventHandler } from 'react'
import { BsForward } from 'react-icons/bs'
import { Link, To } from 'react-router-dom'

interface cardProps {
  name: string | undefined
  type: string | undefined
  link: To
  onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

function Card({
  name, type, link, onClick
}: cardProps) {
  return (
    <div className="border border-gray-300 rounded-md hover:bg-gray-100 mb-2">
      <div className="bg-gray-100 p-3 rounded-tl-md rounded-tr-md flex justify-between">
        <span onClick={onClick} className="cursor-pointer text-blue-600 font-medium">{name}</span>
        <Link to={link}>
          <BsForward size={24} className="text-blue-600 cursor-pointer" />
        </Link>
      </div>
      <div className="p-3">
        <div className="pb-2">
          <span className="text-gray-700 font-medium">Type:</span>
          <span className="pl-2 text-gray-500 font-normal">{type}</span>
        </div>
      </div>
    </div>
  )
}

export default Card
