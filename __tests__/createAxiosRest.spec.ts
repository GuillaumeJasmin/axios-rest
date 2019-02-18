import { AxiosRestConfig } from '../src/types'
import { createAxiosRest } from '../src/createAxiosRest'

const createAxiosInst = () => ({
  request: jest.fn(data => data),
})

const config: AxiosRestConfig = {
  defaultResourcesActions: {
    exist: {
      uri: ':__DATA__/exist',
      method: 'get',
      allowDataType: ['string', 'number'],
    },
  },
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
          method: 'get',
          allowDataType: ['undefined'],
        },
        myNextCustomAction: {
          uri: ':__DATA__/next-custom-action',
          method: 'get',
          allowDataType: ['string', 'number'],
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
      method: 'post',
    },
  },
}

describe('createAxiosRest', () => {
  it('should generate correct resources', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)

    expect(typeof api.posts).toEqual('function')
    expect(typeof api.comments).toEqual('function')
    expect(typeof api.posts().fetch).toEqual('function')
    expect(typeof api.posts().create).toEqual('function')
    expect(typeof api.posts().update).toEqual('function')
    expect(typeof api.posts().delete).toEqual('function')
  })

  it('should generate correct actions', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)

    expect(typeof api.login).toEqual('function')
  })

  it('should generate correct sub resources', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)

    expect(typeof api.posts(2).authors).toEqual('function')
    expect(typeof api.posts(2).authors().fetch).toEqual('function')
    expect(typeof api.posts(2).authors().create).toEqual('function')
    expect(typeof api.posts(2).authors().update).toEqual('function')
    expect(typeof api.posts(2).authors().delete).toEqual('function')
  })

  it('should generate correct sub actions', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)

    expect(typeof api.posts().myCustomAction).toEqual('function')
  })

  it("should throw error if method doesn't correspond to data", () => {
    const api = createAxiosRest(createAxiosInst() as any, config)

    expect(() => api.posts().create()).toThrow()
    expect(() => api.posts().update()).toThrow()
    expect(() => api.posts().delete()).toThrow()
    expect(() => api.posts({}).fetch()).toThrow()
    expect(() => api.posts([]).fetch()).toThrow()
    expect(() => api.posts({}).exist()).toThrow()
  })

  it('should have defaultResourcesActions', () => {
    const axiosInst = createAxiosInst() as any
    const api = createAxiosRest(axiosInst, config)

    api.posts(6).exist()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/6/exist',
    })
  })

  it('should trigger axios request', () => {
    const axiosInst = createAxiosInst() as any
    const api = createAxiosRest(axiosInst, config)
    api.posts().fetch()
    api.posts(2).fetch()
    api.posts({}).create()
    api.posts({ id: '...' }).update()
    api.posts(2).delete()
    api.login()
    expect(axiosInst.request).toHaveBeenCalledTimes(6)
  })

  it('should trigger axios request with good params', () => {
    const axiosInst = createAxiosInst() as any
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
    })

    api.posts(1).myNextCustomAction()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1/next-custom-action',
    })
  })
})
