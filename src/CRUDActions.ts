import { ResourceID } from './types'

export const CRUDActions = {
  fetch: (id: ResourceID) => ({
    url: id !== undefined ? `/${id}` : '',
    method: 'get',
  }),
  create: () => ({
    url: '',
    method: 'post',
  }),
  update: (id?: ResourceID) => ({
    url: `/${id}`,
    method: 'patch',
  }),
  delete: (id: ResourceID) => ({
    url: `/${id}`,
    method: 'delete',
  }),
}
