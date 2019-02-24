import { Actions } from './types'

export const defaultResourcesActions: Actions = {
  fetch: {
    uri: id => (id !== undefined ? id : ''),
    method: 'get',
  },
  create: {
    uri: () => '',
    method: 'post',
  },
  update: {
    uri: id => `${id}`,
    method: 'patch',
  },
  delete: {
    uri: id => `${id}`,
    method: 'delete',
  },
}
