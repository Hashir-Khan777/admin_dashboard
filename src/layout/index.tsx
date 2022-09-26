import { Sidebar } from 'components'
import TopBar from 'components/top-bar'
import useAuth from 'hooks/useAuth'
import { ReactElement, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

function Layout({ children }: { children: ReactElement }) {
  const [toggleIconStatus, setToggleIconStatus] = useState<boolean>(false)
  const { authenticated } = useAuth()

  return (
    <div>
      <div className="flex xs:flex-col desktopMini:flex-row h-screen">
        {authenticated && (
          <>
            <div className={`${toggleIconStatus ? 'open' : ''} sidebar`}>
              <Sidebar />
            </div>
            {toggleIconStatus && (
              <div
                className="backdrop"
                onClick={() => setToggleIconStatus(false)}
              />
            )}
          </>
        )}
        <main className="flex flex-1 flex-col overflow-x-auto">
          {authenticated && (
            <>
              <div className="toggle_icon p-4">
                <GiHamburgerMenu
                  className="cursor-pointer"
                  size={18}
                  onClick={() => setToggleIconStatus(!toggleIconStatus)}
                />
              </div>
              <TopBar />
            </>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
