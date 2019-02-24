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

| method      | URL        | description    | Axios Rest                                    |
| :---------- | :--------- | :------------- | --------------------------------------------- |
| GET         | `/posts`   | fetch all post | `api.posts().fetch()`                         |
| GET         | `/posts/1` | fetch one post | `api.posts(1).fetch()`                        |
| POST        | `/posts`   | create post    | `api.posts().create({ title: 'foo' })`        |
| PATCH / PUT | `/posts/1` | update post    | `api.posts().update({ id: 1, title: 'bar' })` |
| DELETE      | `/posts/1` | delete post    | `api.posts(1).delete()`                       |

## Custom actions

A resource can also have custom actions only available for this resource:

| method | URL                  | description                    |                            |
| :----- | :------------------- | :----------------------------- | -------------------------- |
| POST   | `/comments/1/like`   | add a like to the comment 1    | `api.comments(1).like()`   |
| POST   | `/comments/1/unlike` | remove a like to the comment 1 | `api.comments(1).unlike()` |

A resource can have sub resources

| method | URL                 | description                 | Axios Rest                                        |
| :----- | :------------------ | :-------------------------- | ------------------------------------------------- |
| GET    | `/posts/1/comments` | fetch all comment of post 1 | `api.posts(1).comments().fetch()`                 |
| POST   | `/posts/1/comments` | create a comment of post 1  | `api.posts(1).comments().create({ text: '...' })` |

# What is an action ?

An action is a single endpoint. The most common action is `login`

| method | URL       | description             | Axios Rest                                        |
| :----- | :-------- | :---------------------- | ------------------------------------------------- |
| POST   | `/login`  | login to admin panel    | `api.login({ username: '...', password: '...' })` |
| POST   | `/logout` | logout from admin panel | `api.logout()`                                    |

# createAxiosRest(axiosInst, config)

`createAxiosRest(axiosInst, config)`

- `axiosInst` - Axios Instance - required - create with `axios.create()` . See [Axios documentation](https://github.com/axios/axios#axioscreateconfig)

- `config` - object - required

## Config

- `idKey` - string - optional. Default `id`
- `resources` - object - optional - list of resources

  ```js
  {
    // resource URI
    uri: '',
    // or
    uri: (id, data) => '',

    // sub resources
    resources: {},

    // sub actions
    actions: {},
  }
  ```

- `actions` - object - optional - list of actions

  ```js
  {
    // action URI
    uri: '',
    // or
    uri: (id, data) => '',

    // Axios method property
    method: 'POST',

    // optional.
    // see https://github.com/axios/axios#request-config
    axiosRequestConfig: {}
  }
  ```

- `globalResourceActions` - object -
  Actions available for all resources

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
      uri: 'posts',
      resources: {
        comments: {
          uri: 'comments',
        },
      },
    },
    comments: {
      uri: 'comments',
      actions: {
        like: {
          uri: id => `${id}/like`,
          method: 'POST',
        },
        unlike: {
          uri: id => `${id}/unlike`,
          method: 'POST',
        },
      },
    },
  },
  actions: {
    login: {
      uri: 'login',
      method: 'POST',
    },
    logout: {
      uri: 'logout',
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
api.posts().create({ title: '...' })

// PATCH /posts/1
api.posts().update({ id: 1, title: '...' })
// or
api.posts(1).update({ title: '...' })

// PUT /posts/1
api.posts().update({ id: 1, title: '...' }, { method: 'put' })

// DELETE /posts/1
api.posts(1).delete()
```

### Actions

```js
api.login({ email: '...', password: '...' }).then(res => {
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
  .create({ author: '...', text: 'Amazing article !' })

// POST /comments/1/like
api.comments(1).like()
```

## URL params

```js
const config = {
  actions: (
    myAction: {
      uri: (id, data) => `custom-action/${data.postId}/${data.commentId}`
    }
  )
}

...

api.myAction({ postId: '', commentId: '' })
```

- _Note_: `id` is unused here, because it's an action. Id can only be used with resource: `api.posts(id).anotherAction()`

## Axios request config

You have 2 ways to set axios config for an action:

- globally
- during the action call (override global config with shallow merge)

```js
const config = {
  actions: (
    myAction: {
      uri: 'custom-action',
      method: 'GET',
      axiosRequestConfig: {
        headers: {
          X_CUSTOM_HEADER_NAME: 'foo'
        },
        params: {
          page: 1
        }
      }
    }
  )
}

...

// GET /custom-action&page=1
// with header X_CUSTOM_HEADER_NAME
api.myAction()

// GET /custom-action&page=2&lang=en
// with header X_CUSTOM_HEADER_NAME
api.myAction(null, { params: { page: 2, lang: 'en' } })
```
