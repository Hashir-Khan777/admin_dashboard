import useAuth from 'hooks/useAuth'
import { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import './index.css'

function TopBar() {
  const [isOpen, setOpen] = useState(false)
  const toggleDropdown = () => setOpen(!isOpen)
  const { logout } = useAuth()

  const user = JSON.parse(localStorage.getItem('user') || '')

  return (
    <div className="flex phone:justify-between items-center w-full border-b-2 border-gray-200 p-4 phone:py-4 phone:px-5 tablet:px-10 bg-white">
      <div></div>
      <div className="flex items-center justify-between phone:justify-center w-full phone:w-auto">
        <div className="relative phone:mx-auto text-gray-600 tablet:px-3 w-full">
          <input
            className="border border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
            type="search"
            name="search"
            placeholder="Search"
          />
          <button
            type="submit"
            style={{
              marginRight: 10
            }}
            className="absolute right-3 tablet:right-6 top-1/2 -translate-y-2/4"
          >
            <BsSearch size={20} className="text-gray-400" />
          </button>
        </div>
        <div
          onClick={() => logout()}
          className="phone:flex px-3 flex-col items-center cursor-pointer"
        >
          <RiLogoutCircleRLine size={30} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Logout</span>
        </div>
        <div
          className="pl-3 phone:px-3 flex flex-col items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="w-8 h-8 object-contain border border-gray-400 rounded-full">
            <FaUser size={22} className="mt-1 ml-1 text-gray-400" />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {user?.user?.name}
          </span>
          <div
            className={`dropdown-body w-24 absolute border-2 border-gray-200 top-20 right-5 bg-white rounded z-10 ${
              isOpen && 'dropdown-open'
            }`}
          >
            <p className="border-b border-gray-100 hover:bg-gray-50 py-2 px-2">
              Profile
            </p>
            <p className="py-2 px-2 hover:bg-gray-50">Setting</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
