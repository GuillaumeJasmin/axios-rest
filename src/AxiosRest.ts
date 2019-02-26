import { AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  AxiosRestConfig,
  AxiosRestInst,
  ResourceConfig,
  ResourceInst,
  ActionConfig,
  ActionInst,
  ListActionsConfig,
  ResourceID,
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
    const { url } = resource
    const fullResourceURI = `${rootURI}${url}`

    const resourcesActions: ListActionsConfig = {
      ...this.config.globalResourceActions,
      ...resource.actions,
    }

    return (id?: ResourceID) => {
      // eslint-disable-next-line
      const output: any = {}

      Object.entries(resourcesActions).forEach(([actionName, action]) => {
        output[actionName] = (
          localAxiosRequestConfig: AxiosRequestConfig = {},
        ) => {
          const {
            data,
            ...restLocalAxiosRequestConfig
          } = localAxiosRequestConfig
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

          const config: AxiosRequestConfig = restLocalAxiosRequestConfig
          if (finalData) {
            config.data = finalData
          }

          return this.createAction(action, finalId, fullResourceURI)(config)
        }
      })

      if (resource.resources && id !== undefined) {
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
    id?: ResourceID,
    rootURI: string = '',
  ): ActionInst => {
    return (axiosRequestConfig: AxiosRequestConfig = {}) => {
      const { url, ...actionRest } =
        typeof action === 'function' ? action(id, axiosRequestConfig) : action

      const requestConfig: AxiosRequestConfig = {
        url: `${rootURI}${url}`,
        ...axiosRequestConfig,
        ...actionRest,
      }

      return this.axiosInst.request(requestConfig)
    }
  }
}
