/* global describe, it, expect, global */

import { createAxiosRest } from '../src/createAxiosRest'

const createAxiosInst = () => ({
  request: jest.fn(data => data),
})

const config = {
  resources: {
    posts: {
      uri: 'posts',
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
    api.posts([]).create()
    api.posts({}).update()
    api.posts([]).update()
    api.posts(2).delete()
    api.posts([]).delete()
    expect(axiosInst.request).toHaveBeenCalledTimes(7)
  })

  it('should trigger axios request with good params', () => {
    const axiosInst = createAxiosInst()
    const api = createAxiosRest(axiosInst, config)

    api.posts().fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts',
    })

    api.posts(1).fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1',
    })

    api.posts({ name: 'Bob' }).create()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'post',
      url: '/posts',
      data: {
        name: 'Bob',
      },
    })

    api.posts({ id: 1, name: 'Bob' }).update()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'patch',
      url: '/posts/1',
      data: {
        name: 'Bob',
      },
    })

    api.posts(1).delete()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'delete',
      url: '/posts/1',
    })

    api
      .posts(1)
      .authors()
      .fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1/authors',
    })

    api.posts().myCustomAction()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/custom-action',
      data: {},
    })

    api.posts(1).myCustomAction()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1/custom-action',
      data: {},
    })
  })

  it('shloud throw an error if we use a reserved action name', () => {
    const axiosInst = createAxiosInst()
    const api = createAxiosRest(axiosInst, {
      resources: {
        posts: {
          resources: {
            fetch: {
              uri: 'fetch',
            },
          },
        },
      },
    })

    expect(() => api.posts('')).toThrowError(
      `axios-rest: fetch is a reserve action, you can't use it as resource name`,
    )
  })
})
