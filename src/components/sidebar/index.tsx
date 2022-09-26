import useAuth from 'hooks/useAuth'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { GoProject } from 'react-icons/go'
import { GrCatalogOption } from 'react-icons/gr'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import './index.css'

interface childRoute {
  name: string
  path: string
  icon?: ReactElement
}

interface route {
  name: string
  path: string
  icon?: ReactElement
  dropdownIcon?: ReactElement
  children?: childRoute[]
}

const routes: route[] = [
  {
    name: 'Overview',
    path: '/',
    icon: <AiFillHome size={22} className="icon" />
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: <GoProject size={22} className="icon" />
  },
  {
    name: 'Catalog',
    path: '/catalog/1',
    icon: <GrCatalogOption size={22} className="icon" />
  }
]

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState<route | undefined>(undefined)
  const { logout } = useAuth()
  const path = window.location.pathname

  const findInSubs = (eventKey: string) => {
    const routesHaveChildren = routes.filter(
      (item) => item.children !== undefined
    )
    let activeChildMenu: route | undefined
    for (let index = 0; index < routesHaveChildren.length; index += 1) {
      const selectedChildMenu = routesHaveChildren[index].children?.find(
        (item) => item.path === eventKey
      )
      if (selectedChildMenu) {
        activeChildMenu = selectedChildMenu
        break
      }
    }
    return activeChildMenu
  }

  const getActiveMenu = useCallback((path: string) => {
    let activeMenu: route | undefined = routes.find((menu) => {
      if (path === '/' || menu.path === '/') {
        return path === menu.path
      }
      return path.startsWith(menu.path)
    })
    if (!activeMenu) {
      activeMenu = findInSubs(path)
    }
    setActiveMenu(activeMenu)
  }, [])

  const detectMenu = (activeMenu: route, isChild?: boolean): void => {
    if (isChild) {
      getActiveMenu(activeMenu.path)
    } else {
      setActiveMenu(activeMenu)
    }
  }

  useEffect(() => {
    getActiveMenu(path)
  }, [getActiveMenu, path])

  return (
    <div className="flex flex-col justify-between h-full w-64 bg-gray-100">
      <div>
        <div className="flex justify-center items-center pt-3">
          Logo
        </div>
        <ul className="mt-3 px-3">
          {routes?.map(
            (menu): ReactElement => (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => detectMenu(menu)}
              >
                <li
                  className={`sidebar_nav rounded-md flex items-center cursor-pointer text-gray-800 px-4 py-3 hover:bg-gray-300 ${
                    activeMenu === menu && 'bg-gray-300 text-blue-600'
                  }`}
                >
                  <div
                    className={`pr-4 hover:text-blue-600 text-gray-800 ${
                      activeMenu === menu && 'text-blue-600'
                    }`}
                  >
                    {menu.icon}
                  </div>
                  {menu.name}
                </li>
              </Link>
            )
          )}
        </ul>
      </div>
      <div className="my-3 px-3 phone:hidden">
        <div
          className="flex items-center hover:bg-gray-300 sidebar_nav rounded-md px-4 py-3 cursor-pointer text-gray-800"
          onClick={() => logout()}
        >
          <div className="pr-4 text-gray-800">
            <RiLogoutCircleRLine size={22} />
          </div>
          <div className="flex justify-between items-center w-full">Logout</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
