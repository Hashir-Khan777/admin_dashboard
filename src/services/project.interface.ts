import { application } from './application.interface'

export type config = {
  currencyCode: string
}

export type projectProperties = {
  cluster?: string
  node?: string
  container?: string
  controller?: string
  controllerKind?: string
  pod?: string,
  services?: string[],
  namespace?: string
  providerID?: string
  labels?: {
    app_kubernetes_io_name?: string,
    kubernetes_io_metadata_name?: string,
    pod_template_hash?: string
  }
  annotations?: {
    prometheus_io_port: string,
    prometheus_io_scrape: string
  }
}

export type projectCostWindow = {
  start?: string,
  end?: string
}

export type projectCost = {
  __idle__: {
    properties?: projectProperties,
    window?: projectCostWindow,
    name?: string,
    start?: string,
    end?: string,
    minutes?: number,
    cpuCores?: number,
    cpuCoreRequestAverage?: number,
    cpuCoreUsageAverage?: number,
    cpuCoreHours?: number,
    cpuCost?: number,
    cpuCostAdjustment?: number,
    cpuEfficiency?: number,
    gpuCount?: number,
    gpuHours?: number,
    gpuCost?: number,
    gpuCostAdjustment?: number,
    networkTransferBytes?: number,
    networkReceiveBytes?: number,
    networkCost?: number,
    networkCostAdjustment?: number,
    loadBalancerCost?: number,
    loadBalancerCostAdjustment?: number,
    pvBytes?: number,
    pvByteHours?: number,
    pvCost?: number,
    pvs?: number | null,
    pvCostAdjustment?: number,
    ramBytes?: number,
    ramByteRequestAverage?: number,
    ramByteUsageAverage?: number,
    ramByteHours?: number,
    ramCost?: number,
    ramCostAdjustment?: number,
    ramEfficiency?: number,
    sharedCost?: number,
    externalCost?: number,
    totalCost?: number,
    totalEfficiency?: number,
    rawAllocationOnly?: {
      cpuCoreUsageMax?: number,
      ramByteUsageMax?: number
    } | null
  },
  [key: string]: {
    properties?: projectProperties,
    window?: projectCostWindow,
    name?: string,
    start?: string,
    end?: string,
    minutes?: number,
    cpuCores?: number,
    cpuCoreRequestAverage?: number,
    cpuCoreUsageAverage?: number,
    cpuCoreHours?: number,
    cpuCost?: number,
    cpuCostAdjustment?: number,
    cpuEfficiency?: number,
    gpuCount?: number,
    gpuHours?: number,
    gpuCost?: number,
    gpuCostAdjustment?: number,
    networkTransferBytes?: number,
    networkReceiveBytes?: number,
    networkCost?: number,
    networkCostAdjustment?: number,
    loadBalancerCost?: number,
    loadBalancerCostAdjustment?: number,
    pvBytes?: number,
    pvByteHours?: number,
    pvCost?: number,
    pvs?: number | null,
    pvCostAdjustment?: number,
    ramBytes?: number,
    ramByteRequestAverage?: number,
    ramByteUsageAverage?: number,
    ramByteHours?: number,
    ramCost?: number,
    ramCostAdjustment?: number,
    ramEfficiency?: number,
    sharedCost?: number,
    externalCost?: number,
    totalCost?: number,
    totalEfficiency?: number,
    rawAllocationOnly?: {
      cpuCoreUsageMax?: number,
      ramByteUsageMax?: number
    } | null
  },
}

export type projectLinks = {
  rel: string
  href: string
  type: string
}

export type Project = {
  _type: string
  id: number
  name: string
  config: config
  cost?: projectCost
  historyCost?: projectCost[]
  links: projectLinks
  applications?: application[]
}
