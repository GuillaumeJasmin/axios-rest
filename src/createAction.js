// @flow
import type { Action } from './types'
import replaceURLWithData from './replaceURLWithData'
import { methods } from './methods'

const createAction = (
  axiosInst: Object,
  action: Action,
  rootURI: string = '',
) => (data: Object = {}, axiosConfig: Object = {}) => {
  const { url, data: outputData } = replaceURLWithData(
    `${rootURI}/${action.uri}`,
    data,
    true,
  )

  if (!methods[action.method]) {
    throw new Error(
      `axios-rest: methods ${action.method} doesn't exist.
      Allowed methods: ${Object.keys(methods).join(',')}`,
    )
  }

  return axiosInst.request({
    ...axiosConfig,
    method: action.method.toLowerCase(),
    data: outputData,
    url,
  })
}

export default createAction
