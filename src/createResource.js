// @flow
import { isPlainObject } from 'lodash'
import createAction from './createAction'
import { CRUDActions, createCRUDMethods } from './createCRUDMethods'
import type { Resource, Config } from './types'

const createResource = (
  axiosInst: Object,
  resource: Resource,
  actionRestConfig: Config,
  rootURI: string = '',
) => {
  const fullResourceURI = `${rootURI}/${resource.uri}`
  let itemId: string | number = ''

  return (data: any) => {
    const output = createCRUDMethods({
      fetchAll: (data, config) => {
        return axiosInst.request({
          method: 'get',
          url: fullResourceURI,
          ...config,
        })
      },
      fetchOne: (data, config) => {
        return axiosInst.request({
          method: 'get',
          url: `${fullResourceURI}/${data}`,
          ...config,
        })
      },
      create: (data, config) => {
        return axiosInst.request({
          method: 'post',
          data,
          url: `${fullResourceURI}`,
          ...config,
        })
      },
      update: (data, config) => {
        let outputData
        let isBatch = false
        if (isPlainObject(data)) {
          const { [actionRestConfig.idKey]: __itemId, ...restData } = data
          itemId = __itemId
          outputData = restData
        } else if (Array.isArray(data)) {
          // then it's an array
          isBatch = true
          outputData = data
        } else {
          // it can't be other type of data
        }

        const url = isBatch ? fullResourceURI : `${fullResourceURI}/${itemId}`

        return axiosInst.request({
          method: 'patch',
          data: outputData,
          url,
          ...config,
        })
      },
      delete: (data, config) => {
        const isBatch = Array.isArray(data)

        let requestParam

        if (isBatch) {
          requestParam = {
            method: 'post',
            url: fullResourceURI,
            data,
            ...config,
          }
        } else {
          requestParam = {
            method: 'delete',
            url: `${fullResourceURI}/${data}`,
            ...config,
          }
        }

        return axiosInst.request(requestParam)
      },
    })(data)

    // sub resources
    if (resource.resources && ['string', 'number'].includes(typeof data)) {
      const { resources } = resource
      Object.keys(resource.resources).forEach(resourceName => {
        if (CRUDActions.includes(resourceName)) {
          throw new Error(
            `axios-rest: ${resourceName} is a reserve action, you can't use it as resource name`,
          )
        }
        const resource = resources[resourceName]
        output[resourceName] = createResource(
          axiosInst,
          resource,
          actionRestConfig,
          `${fullResourceURI}/${data}`,
        )
      })
    }

    // actions
    if (
      resource.actions &&
      ['string', 'number', 'undefined'].includes(typeof data)
    ) {
      const { actions } = resource
      Object.keys(actions).forEach(actionName => {
        const action = actions[actionName]
        const baseURI = data ? `${fullResourceURI}/${data}` : fullResourceURI
        output[actionName] = createAction(axiosInst, action, baseURI)
      })
    }

    return output
  }
}

export default createResource
