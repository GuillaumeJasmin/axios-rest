# Axios REST

[![Build Status](https://travis-ci.org/GuillaumeJasmin/axios-rest.svg?branch=master)](https://travis-ci.org/GuillaumeJasmin/axios-rest)
[![Coverage Status](https://coveralls.io/repos/github/GuillaumeJasmin/axios-rest/badge.svg?branch=master&service=github)](https://coveralls.io/github/GuillaumeJasmin/axios-rest?branch=master)
[![npm version](https://img.shields.io/npm/v/@guillaumejasmin/axios-rest.svg)](https://www.npmjs.com/package/@guillaumejasmin/axios-rest)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

Build resources and actions for [axios](https://github.com/axios/axios)

- [Resources](#what-is-a-resource-)
- [Actions](#what-is-an-action-)
- [createAxiosRest()](#createaxiosrest-axiosinst-config-)
- [Examples](#examples)

  - [Basic config](#basic-config)
  - [Basic usage](#basic-usage)
  - [URL params](#url-params)
  - [Axios request config (params, headers...)](#axios-request-config)

# Install

```bash
npm install axios-rest --save
```

# What is a resource ?

A resource is a REST endpoint, with a list of actions.

## Globals resource actions

Globals resource actions are actions available for all resources.

The most common resource actions are CRUD methods: `fetch`, `create`, `update` and `delete`.

Example of `posts` resource:

| method      | URL        | description    | Axios Rest                                              |
| :---------- | :--------- | :------------- | ------------------------------------------------------- |
| GET         | `/posts`   | fetch all post | `api.posts().fetch()`                                   |
| GET         | `/posts/1` | fetch one post | `api.posts(1).fetch()`                                  |
| POST        | `/posts`   | create post    | `api.posts().create({ data: { title: 'foo' } })`        |
| PATCH / PUT | `/posts/1` | update post    | `api.posts().update({ { data: id: 1, title: 'bar' } })` |
| DELETE      | `/posts/1` | delete post    | `api.posts(1).delete()`                                 |

## Custom actions

A resource can also have custom actions only available for this resource:

| method | URL                  | description                    |                            |
| :----- | :------------------- | :----------------------------- | -------------------------- |
| POST   | `/comments/1/like`   | add a like to the comment 1    | `api.comments(1).like()`   |
| POST   | `/comments/1/unlike` | remove a like to the comment 1 | `api.comments(1).unlike()` |

A resource can have sub resources

| method | URL                 | description                 | Axios Rest                                                  |
| :----- | :------------------ | :-------------------------- | ----------------------------------------------------------- |
| GET    | `/posts/1/comments` | fetch all comment of post 1 | `api.posts(1).comments().fetch()`                           |
| POST   | `/posts/1/comments` | create a comment of post 1  | `api.posts(1).comments().create({ data: { text: '...' } })` |

# What is an action ?

An action is a single endpoint. The most common action is `login`

| method | URL       | description             | Axios Rest                                                  |
| :----- | :-------- | :---------------------- | ----------------------------------------------------------- |
| POST   | `/login`  | login to admin panel    | `api.login({ data: { username: '...', password: '...' } })` |
| POST   | `/logout` | logout from admin panel | `api.logout()`                                              |

# createAxiosRest(axiosInst, config)

`createAxiosRest(axiosInst, config)`

- `axiosInst` - Axios Instance - required - create with `axios.create()` . See [Axios documentation](https://github.com/axios/axios#axioscreateconfig)

- `config` - object - required

## Config

```js
{
  idKey: 'id',
  resources: undefined,
  actions: undefined,
  globalResourceActions: undefined // Actions available for all resources
}
```

## Config resources

```js
{
  [resourceName]: {
    url: '',
    resources: undefined // sub resources
    actions: undefined
  }
}
```

## Config actions

```js
{
  [actionName]: {
    // axios request config
  }
}

// or if you need to get resource id
{
  [actionName]: (id, data) => ({
    // axios request config
  })
}
```

# Examples

## Basic config

```js
import axios from 'axios'
import { createAxiosRest, CRUDActions } from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  globalResourceActions: CRUDActions, // use can use predefined CRUD action or build yours
  resources: {
    posts: {
      url: '/posts',
      resources: {
        comments: {
          url: '/comments',
        },
      },
    },
    comments: {
      url: '/comments',
      actions: {
        like: id => ({
          url: `/${id}/like`,
          method: 'POST',
        }),
        unlike: id => ({
          url: `/${id}/unlike`,
          method: 'POST',
        }),
      },
    },
  },
  actions: {
    login: {
      url: '/login',
      method: 'POST',
    },
    logout: {
      url: '/logout',
      method: 'POST',
    },
  },
}

const api = createAxiosRest(axiosInst, config)
```

## Basic usage

### Resources

```js
// GET /posts
api
  .posts()
  .fetch()
  .then(res => console.log(res.data))

// GET /posts/1
api.posts(1).fetch()

// POST /posts
api.posts().create({ data: { title: '...' } })

// PATCH /posts/1
api.posts().update({ data: { id: 1, title: '...' } })
// or
api.posts(1).update({ data: { title: '...' } })

// PUT /posts/1
api.posts().update({ data: { id: 1, title: '...' }, method: 'put' })

// DELETE /posts/1
api.posts(1).delete()
```

### Actions

```js
api.login({ data: { email: '...', password: '...' } }).then(res => {
  // success login
})
```

### Sub resources and actions

```js
// GET /posts/1/comments
api
  .posts(1)
  .comments()
  .fetch()

// POST /posts/1/comments
api
  .posts(1)
  .comments()
  .create({ data: { author: '...', text: 'Amazing article !' } })

// POST /comments/1/like
api.comments(1).like()
```

## URL params

```js
const config = {
  actions: {
    myAction: (id, data) => ({
      url: `custom-action/${data.postId}/${data.commentId}`,
    }),
  },
}

// ...

api.myAction({ data: { postId: '', commentId: '' } })
```

- _Note_: `id` is unused here, because it's an action. Id can only be used with resource: `api.posts(id).anotherAction()`

## Axios request config

You have 2 ways to set axios config for an action:

- globally
- during the action call (override global config with shallow merge)

```js
const config = {
  actions: {
    myAction: {
      url: 'custom-action',
      method: 'GET',
      headers: {
        X_CUSTOM_HEADER: 'foo',
      },
      params: {
        page: 1,
      },
    },
  },
}

// ...

// GET /custom-action&page=1
// with header X_CUSTOM_HEADER
api.myAction()

// GET /custom-action&page=2&lang=en
// with header X_CUSTOM_HEADER
api.myAction({ params: { page: 2, lang: 'en' } })
```
