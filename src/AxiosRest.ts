import { AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  AxiosRestConfig,
  AxiosRestInst,
  ResourceConfig,
  ResourceInst,
  ActionConfig,
  ActionInst,
  ListActionsConfig,
  DataType,
  ID,
} from './types'
import { getDataType } from './helpers'

export class AxiosRest<AI extends AxiosInstance, ARC extends AxiosRestConfig> {
  public static create<AI extends AxiosInstance, ARC extends AxiosRestConfig>(
    axiosInst: AI,
    config: ARC,
  ): AxiosRestInst<ARC> {
    const inst = new AxiosRest(axiosInst, config)
    return inst.api
  }

  public axiosInst: AI

  public config: ARC

  private api: AxiosRestInst<ARC>

  public constructor(axiosInst: AI, config: ARC) {
    this.axiosInst = axiosInst
    this.config = {
      idKey: 'id',
      ...config,
    }

    const { resources, actions } = this.config

    // eslint-disable-next-line
    this.api = {} as any

    if (resources) {
      Object.keys(resources).forEach(resourceName => {
        const resource = resources[resourceName]
        // @ts-ignore
        this.api[resourceName] = this.createResource(resource)
      })
    }

    if (actions) {
      Object.keys(actions).forEach(actionName => {
        const action = actions[actionName]
        // @ts-ignore
        this.api[actionName] = this.createAction(action)
      })
    }
  }

  private createResource = (
    resource: ResourceConfig,
    rootURI: string = '',
  ): ResourceInst<ResourceConfig, ARC> => {
    const uri =
      typeof resource.uri === 'function' ? resource.uri() : resource.uri
    const fullResourceURI = `${rootURI}/${uri}`

    const resourcesActions: ListActionsConfig = {
      ...this.config.globalResourceActions,
      ...resource.actions,
    }

    return (id?: ID) => {
      // eslint-disable-next-line
      const output: any = {}

      Object.entries(resourcesActions).forEach(([actionName, action]) => {
        output[actionName] = (
          // eslint-disable-next-line
          data: any,
          localAxiosRequestConfig?: AxiosRequestConfig,
        ) => {
          const dataType = getDataType(data)
          let finalData: typeof data
          let finalId: string | number = id

          if (dataType === 'object') {
            const { [this.config.idKey]: idFromData, ...restData } = data
            finalData = restData

            if (idFromData !== undefined) {
              if (
                id !== undefined &&
                idFromData !== undefined &&
                id !== idFromData
              ) {
                throw new Error('id not match')
              }

              finalId = idFromData
            }
          }

          return this.createAction(action, finalId, fullResourceURI)(
            finalData,
            localAxiosRequestConfig,
          )
        }
      })

      if (id !== undefined) {
        Object.entries(resource.resources).forEach(
          ([resourceName, subResource]) => {
            output[resourceName] = this.createResource(
              subResource,
              `${fullResourceURI}/${id}`,
            )
          },
        )
      }

      return output
    }
  }

  private createAction = (
    action: ActionConfig,
    id?: ID,
    rootURI: string = '',
  ): ActionInst => {
    return (data?: DataType, localAxiosRequestConfig?: AxiosRequestConfig) => {
      // prettier-ignore
      const uri = typeof action.uri === 'function'
        ? action.uri(id, data)
        : action.uri

      const baseURL = uri ? `${rootURI}/${uri}` : rootURI

      const requestConfig: AxiosRequestConfig = {
        method: action.method,
        url: baseURL,
        data,
        ...action.axiosRequestConfig,
        ...localAxiosRequestConfig,
      }

      return this.axiosInst.request(requestConfig)
    }
  }
}
