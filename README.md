# Axios REST

[![Build Status](https://travis-ci.org/GuillaumeJasmin/axios-rest.svg?branch=master)](https://travis-ci.org/GuillaumeJasmin/axios-rest)
[![Coverage Status](https://coveralls.io/repos/github/GuillaumeJasmin/axios-rest/badge.svg?branch=master&service=github)](https://coveralls.io/github/GuillaumeJasmin/axios-rest?branch=master)
[![npm version](https://img.shields.io/npm/v/@guillaumejasmin/axios-rest.svg)](https://www.npmjs.com/package/@guillaumejasmin/axios-rest)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

Build resources and actions for [axios](https://github.com/axios/axios)

## What is a resource ?

A resource is a REST endpoint, with CRUD methods, like `fetch`, `create`, `update` and `delete`.
Example of `posts` resource:

| method      | URL        | description    | Axios Rest format                             |
| :---------- | :--------- | :------------- | --------------------------------------------- |
| GET         | `/posts`   | fetch all post | `api.posts().fetch()`                         |
| GET         | `/posts/1` | fetch one post | `api.posts(1).fetch()`                        |
| POST        | `/posts`   | create post    | `api.posts({ title: 'foo' }).create()`        |
| PATCH / PUT | `/posts/1` | update post    | `api.posts({ id: 1, title: 'bar' }).update()` |
| DELETE      | `/posts/1` | delete post    | `api.posts(1).delete()`                       |

A resource can have sub resources

| method | URL                 | description                 | Axios Rest format                                 |
| :----- | :------------------ | :-------------------------- | ------------------------------------------------- |
| GET    | `/posts/1/comments` | fetch all comment of post 1 | `api.posts(1).comments().fetch()`                 |
| POST   | `/posts/1/comments` | create a comment of post 1  | `api.posts(1).comments({ text: '...' }).create()` |

## What is an action ?

An action is a single endpoint. The most common action is `login`

| method | URL       | description             | Axios Rest format                                 |
| :----- | :-------- | :---------------------- | ------------------------------------------------- |
| POST   | `/login`  | login to admin panel    | `api.login({ username: '...', password: '...' })` |
| POST   | `/logout` | logout from admin panel | `api.logout()`                                    |

## Action into resource ?

A resource can also have custom actions

| method | URL                  | description                    |
| :----- | :------------------- | :----------------------------- |
| POST   | `/comments/1/like`   | add a like to the comment 1    |
| POST   | `/comments/1/unlike` | remove a like to the comment 1 |

## How Axios REST can help me ?

Axios REST make possible to build resources and actions, and interact with your back-end through [axios](https://github.com/axios/axios)

## Install

```bash
npm install @guillaumejasmin/axios-rest --save
```

## Config example

```js
import axios from 'axios'
import createAxiosRest from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  // Resources
  resources: {
    post: {
      uri: 'post',
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
          uri: 'like',
          method: 'POST',
        },
        unlike: {
          uri: 'unlike',
          method: 'POST',
        },
      },
    },
  },
  // Actions
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

Then, you can interact with your resources and actions. Each action return `axios.request()`, so it's a `Promise`

## Resources

```js
// GET /posts
api
  .posts()
  .fetch()
  .then(res => console.log(res.data))

// GET /posts/1
api.posts(1).fetch()

// POST /posts
api.posts({ title: '...' }).create()

// PATCH /posts/1
api.posts({ id: 1, title: '...' }).update()

// PUT /posts/1
api.posts({ id: 1, title: '...' }).update({ method: 'put' })

// DELETE /posts/1
api.posts(1).delete()
```

## Actions

```js
api.login({ email: '...', password: '...' }).then(res => {
  // success login
})
```

## Sub resources and actions

```js
// GET /posts/1/comments
api
  .posts(1)
  .comments()
  .fetch()

// POST /posts/1/comments
api
  .posts(1)
  .comments({ author: '...', text: 'Amazing article !' })
  .create()

// GET /comments/1/like
api.comments(1).like()
```

## createAxiosRest(axiosInst, config)

`createAxiosRest(axiosInst, config)`

- `axiosInst` - Axios Instance - required - create with `axios.create()` . See [Axios documentation](https://github.com/axios/axios#axioscreateconfig)

- `config` - object - required

### Config

- `idKey` - string - optional. Default `id`
- `resources` - object - optional - list of resources

  ```js
  {
    // correspond to the chunk of URL
    uri: 'books',

    // sub resources
    resources: {},

    // sub actions
    actions: {},
  }
  ```

- `actions` - object - optional - list of actions

  ```js
  {
    // correspond to the chunk of URL
    uri: 'login',

    // Axios method property
    method: 'POST',

    // defined which data type are allowed for this action
    // 'string' | 'number' | 'object' | 'array' | 'undefined'
    allowDataType: ['object']

    // optional.
    // see https://github.com/axios/axios#request-config
    axiosRequestConfig: {}
  }
  ```

- `defaultResourcesActions` - object

## Data type

Each CRUD action correspond to a data type. For example, you cannot dot this:

```js
api.posts(true).fetch()
```

because post data with `fetch()` must be an id (`string` or `number`) or `undefined`

List of allow data for each actions

| method | data type                       |
| :----- | :------------------------------ |
| fetch  | `string`, `number`, `undefined` |
| create | `object`                        |
| update | `object`                        |
| delete | `string`, `number`,             |
