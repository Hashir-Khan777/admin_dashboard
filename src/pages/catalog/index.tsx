import useCatalog from 'hooks/useCatalog'
import { ChangeEvent, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import { Link, useParams } from 'react-router-dom'
import { CatalogPackage } from 'services/catalog.interface'

function Catalog() {
  const [filteredData, setFilteredData] = useState<CatalogPackage[] | null>(
    null
  )

  const { getCatalogPackages, catalogPackages, loading } = useCatalog()
  const { catalogId } = useParams()

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredData: CatalogPackage[] = catalogPackages?.filter(
      (catalogPackage: CatalogPackage) => catalogPackage?.applicationName
        .toLocaleLowerCase()
        .match(e.target.value.toLowerCase())
    )
    setFilteredData(filteredData)
  }

  useEffect(() => {
    getCatalogPackages(catalogId)
  }, [getCatalogPackages, catalogId])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? (
        <Skeleton
          height={40}
          containerClassName="w-full"
        />
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-xl font-medium w-48">Catalog</p>
          <div className="relative text-gray-600 xs:px-0 large:px-3">
            <input
              className="border border-gray-300 bg-white h-10 px-5 pr-16 xs:w-56 tablet:w-96 rounded-lg text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search Application"
              onChange={change}
            />
            <button type="submit" className="absolute right-0 top-0 mt-2.5 mr-7">
              <BsSearch size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}
      <div className="flex w-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between large:flex-row xs:flex-col my-5 w-full">
            {loading ? (
              <Skeleton
                width={320}
                height={700}
              />
            ) : (
              <div className="large:h-99 flex xs:flex-col xs:w-full xs:h-auto large:w-80 border border-gray-300 rounded-md">
                <div className="flex justify-between items-center py-3 px-4">
                  <div className="text-gray-800 text-lg font-medium">Filters</div>
                  <div className="text-blue-500 font-medium" role="button">
                    Clear All
                  </div>
                </div>
                <div className="flex xs:items-center large:items-start large:flex-col flex-wrap xs:pb-3 large:pb-0 xs:px-4 large:px-0">
                  <div className="large:py-3 xs:py-0 px-4 text-gray-800 font-medium">
                    Category
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="application-server"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="application-server"
                      />
                      Application server
                    </label>
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="database"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="database"
                      />
                      Database
                    </label>
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="scm"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="scm"
                      />
                      SCM
                    </label>
                  </div>
                </div>
                <div className="flex large:flex-col xs:pb-3 large:pb-0 xs:px-4 large:px-0 flex-wrap">
                  <div className="large:py-3 xs:py-0 px-4 text-gray-800 font-medium">
                    Others Filters
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="option1"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="option1"
                      />
                      Option 1
                    </label>
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="option2"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="option2"
                      />
                      Option 2
                    </label>
                  </div>
                  <div className="large:px-7 xs:px-4 large:pb-2 xs:pb-0 xs:pt-1">
                    <label
                      className="pl-1.5 text-sm flex items-center cursor-pointer"
                      htmlFor="option3"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-4 h-4 mr-2 cursor-pointer"
                        id="option3"
                      />
                      Option 3
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className="pb-2 large:px-3 xs:px-0 xs:ml-0 xs:mt-3 large:ml-0 large:mt-0 overflow-hidden w-full flex self-start justify-between flex-wrap">
              {filteredData && filteredData?.length > 0 ? (
                filteredData?.map((catalogPackage: CatalogPackage, index: number) => (
                  loading ? (
                    <Skeleton
                      key={`skeleton-loading-${index}`}
                      height={224}
                      containerClassName="xl:w-2/9 tablet:w-2/7"
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md xl:w-2/9 tablet:w-2/7 h-56 p-2 mb-5" key={`filtered-data-${index}`}>
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex flex-row">
                          <img
                            src={catalogPackage?.logo?.src ? catalogPackage?.logo?.src : '/images/image1.jpg'}
                            alt={catalogPackage?.applicationName}
                            className="w-20 h-20 object-cover rounded-sm"
                          />
                          <div className="pl-3 flex justify-between flex-col">
                            <div>
                              <Link
                                to={`/catalog/${catalogId}/packages/${catalogPackage?.applicationName}/${catalogPackage?.versions[0]}`}
                                className="text-base uppercase font-medium text-blue-600"
                              >
                                {catalogPackage?.applicationName}
                              </Link>
                              <p className="text-xs font-medium text-gray-800 mt-2">
                                Details
                              </p>
                              <p className="text-xs text-gray-500 pr-1">
                                {catalogPackage?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end items-center pb-1">
                          {catalogPackage?.versions?.map((version: string) => (
                            <span className="mx-1 flex flex-wrap justify-between items-center text-xs bg-gray-200 hover:bg-gray-300 rounded-md px-2.5 py-1.5 font-bold text-gray-700 cursor-pointer">
                              {version}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )))
                : (
                  catalogPackages?.map((catalogPackage: CatalogPackage, index: number) => (
                    loading ? (
                      <Skeleton
                        key={`catalog-skeleton-loading-${index}`}
                        height={224}
                        containerClassName="xl:w-2/9 tablet:w-2/7"
                      />
                    ) : (
                      <div className="border border-gray-300 rounded-md xl:w-2/9 tablet:w-2/7 h-56 p-2 mb-5" key={`catalog-package-${index}`}>
                        <div className="flex flex-col h-full justify-between">
                          <div className="flex flex-row">
                            <img
                              src={catalogPackage?.logo?.src ? catalogPackage?.logo?.src : '/images/image1.jpg'}
                              alt={catalogPackage?.applicationName}
                              className="w-20 h-20 object-cover rounded-sm"
                            />
                            <div className="pl-3 flex justify-between flex-col">
                              <div>
                                <Link
                                  to={`/catalog/${catalogId}/packages/${catalogPackage?.applicationName}/${catalogPackage?.versions[0]}`}
                                  className="text-base uppercase font-medium text-blue-600"
                                >
                                  {catalogPackage?.applicationName}
                                </Link>
                                <p className="text-xs font-medium text-gray-800 mt-2">
                                  Details
                                </p>
                                <p className="text-xs text-gray-500 pr-1">
                                  {catalogPackage?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end items-center pb-1">
                            {catalogPackage?.versions?.map((version: string, index: number) => (
                              <span
                                key={`catalog-package-version-${index}`}
                                className="mx-1 flex flex-wrap justify-between items-center text-xs bg-gray-200 hover:bg-gray-300 rounded-md px-2.5 py-1.5 font-bold text-gray-700 cursor-pointer"
                              >
                                {version}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog
