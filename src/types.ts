import { AxiosRequestConfig, AxiosPromise } from 'axios'

export type DataTypeStr = 'string' | 'number' | 'undefined' | 'object' | 'array'
export type DataType =
  | string
  | number
  | undefined
  | object
  | string[]
  | number[]
  | object[]

export interface Action {
  uri: string
  method: string
  allowDataType?: DataTypeStr[]
  axiosRequestConfig?: AxiosRequestConfig
}

export interface Actions {
  [actionName: string]: Action
}

export interface Resource {
  uri: string
  resources?: Resources
  actions?: Actions
}

export interface Resources {
  [resourceName: string]: Resource
}

export interface AxiosRestConfig {
  resources?: Resources
  actions?: Actions
  defaultResourcesActions?: Actions
  idKey?: string
}

// interface CRUDAction<T = void> {
//   (axiosRequestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>>
// }

// interface ResourceInstFetchAll {
//   fetch: CRUDAction<object[]>
// }
// interface ResourceInstFetchOneOrDelete {
//   fetch: CRUDAction<object>
//   delete: CRUDAction
// }
// interface ResourceInstCreateOrUpdate {
//   create: CRUDAction<object>
//   update: CRUDAction<object>
// }

// export type ResourceInst = <T = void>(
//   data?: T,
// ) => T extends string
//   ? ResourceInstFetchOneOrDelete
//   : T extends number
//   ? ResourceInstFetchOneOrDelete
//   : T extends object
//   ? ResourceInstCreateOrUpdate
//   : ResourceInstFetchAll

export interface ActionInst {
  (data?: DataType, localAxiosRequestConfig?: AxiosRequestConfig): AxiosPromise
}

export interface ActionInsts {
  [actionName: string]: ActionInst
}

export type ResourceInst = (
  data?: DataType,
) => ResourceActionInst | ResourceInsts

export type ResourceActionInst = (
  localAxiosRequestConfig: AxiosRequestConfig,
) => AxiosPromise

export interface ResourceActions {
  [key: string]: ResourceActionInst
}

export interface ResourceInsts {
  [resourceName: string]: ResourceInst
}

export interface AxiosRestInst {
  // [resourceAPI: string]: ResourceInst | ActionInst
  [resourceAPI: string]: Function // to improve
}
