import { AxiosRestConfig, Actions } from './types'

export const getDefaultResourcesActions = (
  axiosRestConfig: AxiosRestConfig,
): Actions => ({
  fetch: {
    uri: ':?__DATA__',
    method: 'get',
    allowDataType: ['undefined', 'string', 'number'],
  },
  create: {
    uri: '',
    method: 'post',
    allowDataType: ['object'],
  },
  update: {
    uri: `:${axiosRestConfig.idKey}`,
    method: 'patch',
    allowDataType: ['object'],
  },
  delete: {
    uri: `:__DATA__`,
    method: 'delete',
    allowDataType: ['string', 'number'],
  },
})
