export type CatalogPackageLabel = {
  category: string
}

export type CatalogPackageLogo = {
  src?: string
  type?: string
  size?: string
}

export type CatalogPackage = {
  applicationName: string
  versions: string[]
  description: string
  maintainer: string[]
  license: string
  labels: CatalogPackageLabel
  logo: CatalogPackageLogo
}

export type CatalogPackageVersionAdditionalProperties = {
  type: string
}

export type CatalogPackageVersionDefination = {
  [key: string]: any
}

export type CatalogPackageVersion = {
  applicationName: string
  description: string
  maintainer: string[]
  license: string
  labels: CatalogPackageLabel
  logo: CatalogPackageLogo
  definitions: CatalogPackageVersionDefination
  version: string
}
