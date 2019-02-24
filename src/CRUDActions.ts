import { ID } from './types'

export const CRUDActions = {
  fetch: {
    uri: (id?: ID) => (id !== undefined ? `${id}` : ''),
    method: 'get',
  },
  create: {
    uri: () => '',
    method: 'post',
  },
  update: {
    uri: (id?: ID) => `${id}`,
    method: 'patch',
  },
  delete: {
    uri: (id: ID) => `${id}`,
    method: 'delete',
  },
}
