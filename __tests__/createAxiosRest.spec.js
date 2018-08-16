/* global describe, it, expect, global */

import { createAxiosRest } from '../src/createAxiosRest'

const createAxiosInst = () => ({
  request: jest.fn(data => data),
})

const config = {
  resources: {
    posts: {
      uri: 'post',
      resources: {
        authors: {
          uri: 'authors',
        },
      },
      actions: {
        myCustomAction: {
          uri: 'custom-action',
          method: 'GET',
        },
      },
    },
    comments: {
      uri: 'comments',
    },
  },
  actions: {
    login: {
      uri: 'login',
      method: 'POST',
    },
  },
}

describe('createAxiosRest', () => {
  it('should generate correct resources', () => {
    const api = createAxiosRest(createAxiosInst(), config)

    expect(typeof api.posts).toBe('function')
    expect(typeof api.comments).toBe('function')
    expect(typeof api.posts().fetch).toBe('function')
    expect(typeof api.posts().create).toBe('function')
    expect(typeof api.posts().update).toBe('function')
    expect(typeof api.posts().delete).toBe('function')
  })

  it('should generate correct actions', () => {
    const api = createAxiosRest(createAxiosInst(), config)

    expect(typeof api.login).toBe('function')
  })

  it('should generate correct sub resources', () => {
    const api = createAxiosRest(createAxiosInst(), config)

    expect(typeof api.posts(2).authors).toBe('function')
    expect(typeof api.posts(2).authors().fetch).toBe('function')
    expect(typeof api.posts(2).authors().create).toBe('function')
    expect(typeof api.posts(2).authors().update).toBe('function')
    expect(typeof api.posts(2).authors().delete).toBe('function')
  })

  it('should generate correct sub actions', () => {
    const api = createAxiosRest(createAxiosInst(), config)

    expect(typeof api.posts().myCustomAction).toBe('function')
  })

  it("should throw error if method doesn't correspond to data", () => {
    const api = createAxiosRest(createAxiosInst(), config)

    expect(() => api.posts().create()).toThrowError()
    expect(() => api.posts().update()).toThrowError()
    expect(() => api.posts().delete()).toThrowError()
    expect(() => api.posts(true)).toThrowError()
    expect(() => api.posts({}).fetch()).toThrowError()
    expect(() => api.posts([]).fetch()).toThrowError()
  })

  it('should trigger axios request', () => {
    const axiosInst = createAxiosInst()
    const api = createAxiosRest(axiosInst, config)

    api.posts().fetch()
    api.posts({}).create()
    api.posts({}).update()
    api.posts(2).delete()
    expect(axiosInst.request).toHaveBeenCalledTimes(4)
  })

  it('should trigger axios request with good params', () => {
    const axiosInst = createAxiosInst()
    const api = createAxiosRest(axiosInst, config)

    api.posts().fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/post',
    })

    api.posts(1).fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/post/1',
    })

    api.posts({ name: 'Bob' }).create()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'post',
      url: '/post',
      data: {
        name: 'Bob',
      },
    })

    api.posts({ id: 1, name: 'Bob' }).update()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'patch',
      url: '/post/1',
      data: {
        name: 'Bob',
      },
    })

    api.posts(1).delete()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'delete',
      url: '/post/1',
    })
  })
})
