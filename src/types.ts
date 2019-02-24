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

type URI = string | ((id?: string | number, data?: DataType) => string | number)

export interface Action {
  uri: URI
  method: string
  allowDataType?: DataTypeStr[]
  axiosRequestConfig?: AxiosRequestConfig
}

export interface Actions {
  [actionName: string]: Action
}

export interface Resource {
  uri: URI
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

export type ResourceInst<R extends Resource, C extends AxiosRestConfig> = (
  data?: DataType,
) => ResourcesListInst<R['resources'], C> &
  ActionsResourceInst<R['actions']> &
  ActionsResourceInst<C['defaultResourcesActions']>

export type ResourcesListInst<
  R extends Resources,
  C extends AxiosRestConfig
> = { [X in keyof R]: ResourceInst<R[X], C> }

export type ActionsResourceInst<A extends Actions> = {
  [X in keyof A]: (config?: AxiosRequestConfig) => AxiosPromise
}

export type ActionsListInst<A extends Actions> = { [X in keyof A]: ActionInst }

export type AxiosRestInst<Config extends AxiosRestConfig> = ResourcesListInst<
  Config['resources'],
  Config
> &
  ActionsListInst<Config['actions']>
