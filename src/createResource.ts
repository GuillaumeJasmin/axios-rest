import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { createAction } from './createAction'
import { Resource, Actions, AxiosRestConfig, ResourceInst } from './types'
import { getDataType } from './helpers'
import { defaultResourcesActions } from './defaultResourcesActions'

export const createResource = (
  axiosInst: AxiosInstance,
  resource: Resource,
  actionRestConfig: AxiosRestConfig,
  rootURI: string = '',
): ResourceInst<Resource, AxiosRestConfig> => {
  const uri = typeof resource.uri === 'function' ? resource.uri() : resource.uri
  const fullResourceURI = `${rootURI}/${uri}`

  const resourcesActions: Actions = {
    ...defaultResourcesActions,
    ...actionRestConfig.defaultResourcesActions,
    ...resource.actions,
  }

  return (id?: string | number) => {
    // eslint-disable-next-line
    const output: any = {}

    Object.entries(resourcesActions).forEach(([actionName, action]) => {
      output[actionName] = (
        // eslint-disable-next-line
        data: any,
        localAxiosRequestConfig?: AxiosRequestConfig,
      ) => {
        const dataType = getDataType(data)
        // eslint-disable-next-line
        let finalData: any
        let finalId: string | number = id

        if (dataType === 'object') {
          const { [actionRestConfig.idKey]: idFromData, ...restData } = data
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

        return createAction(axiosInst, action, finalId, fullResourceURI)(
          finalData,
          localAxiosRequestConfig,
        )
      }
    })

    if (id !== undefined) {
      Object.entries(resource.resources).forEach(
        ([resourceName, subResource]) => {
          output[resourceName] = createResource(
            axiosInst,
            subResource,
            actionRestConfig,
            `${fullResourceURI}/${id}`,
          )
        },
      )
    }

    return output
  }
}
