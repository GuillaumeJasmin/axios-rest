import { createAxiosRest, CRUDActions } from '../src/index'

const createAxiosInst = () => ({
  baseURL: 'http://website.com',
  request: jest.fn(data => data),
})

const config = {
  globalResourceActions: {
    ...CRUDActions,
    exist: (id: any) => ({
      url: `/${id}/exist`,
      method: 'get',
    }),
  },
  resources: {
    posts: {
      url: '/posts',
      resources: {
        authors: {
          url: '/authors',
        },
      },
      actions: {
        myCustomAction: {
          url: '/custom-action',
          method: 'get',
        },
        myNextCustomAction: (id: any) => ({
          url: `/${id}/next-custom-action`,
          method: 'get',
        }),
      },
    },
    comments: {
      url: '/comments',
    },
  },
  actions: {
    login: {
      url: '/login',
      method: 'post',
    },
    customAction: (id: any, { data: { arg1, arg2 } }: any): any => ({
      url: `/customAction/${arg1}/${arg2}`,
      method: 'post',
      data: undefined,
    }),
  },
}

const createAPI = () => {
  const axiosInst = createAxiosInst() as any
  const api = createAxiosRest(axiosInst, config)
  // const api = AxiosRest.create(axiosInst, config)
  return { api, axiosInst }
}

describe('createAxiosRest', () => {
  it('should generate correct resources', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)
    // const api = AxiosRest.create(createAxiosInst() as any, config)

    expect(typeof api.posts).toEqual('function')
    expect(typeof api.comments).toEqual('function')
    expect(typeof api.posts().fetch).toEqual('function')
    expect(typeof api.posts().create).toEqual('function')
    expect(typeof api.posts().update).toEqual('function')
    expect(typeof api.posts().delete).toEqual('function')
  })

  it('should generate correct actions', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)
    // const api = AxiosRest.create(createAxiosInst() as any, config)

    expect(typeof api.login).toEqual('function')
  })

  it('should generate correct sub resources', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)
    // const api = AxiosRest.create(createAxiosInst() as any, config)

    expect(typeof api.posts(2).authors).toEqual('function')
    expect(typeof api.posts(2).authors().fetch).toEqual('function')
    expect(typeof api.posts(2).authors().create).toEqual('function')
    expect(typeof api.posts(2).authors().update).toEqual('function')
    expect(typeof api.posts(2).authors().delete).toEqual('function')
  })

  it('should generate correct sub actions', () => {
    const api = createAxiosRest(createAxiosInst() as any, config)
    // const api = AxiosRest.create(createAxiosInst() as any, config)

    expect(typeof api.posts().myCustomAction).toEqual('function')
  })

  it('should throw error with bad id', () => {
    const { api } = createAPI()

    expect(() => api.posts(1).update({ data: { id: 2, name: 'Bob' } })).toThrow(
      'id not match',
    )
  })

  it('should have globalResourceActions', () => {
    const { axiosInst, api } = createAPI()

    api.posts(6).exist()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/6/exist',
    })
  })

  it('should trigger axios request', () => {
    const axiosInst = createAxiosInst() as any
    const api = createAxiosRest(axiosInst, config)
    // const api = AxiosRest.create(axiosInst, config)
    api.posts().fetch()
    api.posts(2).fetch()
    api.posts().create({})
    api.posts().update({ data: { id: '...' } })
    api.posts(2).delete()
    api.login()
    expect(axiosInst.request).toHaveBeenCalledTimes(6)
  })

  it('should trigger axios request: fetch all ', () => {
    const { axiosInst, api } = createAPI()

    api.posts().fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts',
    })
  })

  it('should trigger axios request: fetch one', () => {
    const { axiosInst, api } = createAPI()

    api.posts(1).fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1',
    })
  })

  it('should trigger axios request: create', () => {
    const { axiosInst, api } = createAPI()

    api.posts().create({ data: { name: 'Bob' } })
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'post',
      url: '/posts',
      data: {
        name: 'Bob',
      },
    })
  })

  it('should trigger axios request: update', () => {
    const { axiosInst, api } = createAPI()

    api.posts().update({ data: { id: 1, name: 'Bob' } })
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'patch',
      url: '/posts/1',
      data: {
        name: 'Bob',
      },
    })
  })

  it('should trigger axios request: update', () => {
    const { axiosInst, api } = createAPI()

    api.posts(2).update({ data: { name: 'Max' } })
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'patch',
      url: '/posts/2',
      data: {
        name: 'Max',
      },
    })
  })

  it('should trigger axios request: delete', () => {
    const { axiosInst, api } = createAPI()

    api.posts(1).delete()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'delete',
      url: '/posts/1',
    })
  })

  it('should trigger axios request: fetch sub resources', () => {
    const { axiosInst, api } = createAPI()

    api
      .posts(1)
      .authors()
      .fetch()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1/authors',
    })
  })

  it('should trigger axios request: custom action without id', () => {
    const { axiosInst, api } = createAPI()

    api.posts().myCustomAction()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/custom-action',
    })
  })

  it('should trigger axios request: custom action with id', () => {
    const { axiosInst, api } = createAPI()

    api.posts(1).myNextCustomAction()
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'get',
      url: '/posts/1/next-custom-action',
    })
  })

  it('should trigger axios request: custom action with multiple params', () => {
    const { axiosInst, api } = createAPI()

    api.customAction({ data: { arg1: 'a', arg2: 'b' } })
    expect(axiosInst.request).toHaveReturnedWith({
      method: 'post',
      url: '/customAction/a/b',
    })
  })
})
