# Axios REST

[![Build Status](https://travis-ci.org/GuillaumeJasmin/axios-rest.svg?branch=master)](https://travis-ci.org/GuillaumeJasmin/axios-rest)

Build resources and actions and request it with [axios](https://github.com/axios/axios)

<!-- ## Documentation
* [Install](#install)
* [Resources](#resources)
  * [Format](#format)
  * [Resource example](#resource-example)
  * [Sub resources and actions](#sub-resources-and-actions)
* [Actions](#actions)
  * [Format](#format)
  * [Action example](#action-example) -->


## Install
```bash
npm install @guillaumejasmin/axios-rest --save
```

## Simple example
```js
import axios from 'axios'
import createAxiosRest from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  resources: {
    posts: {
      url: 'posts',
    },
  },
}

const api = createAxiosRest(axiosInst, config)

// GET /posts
api.posts().fetch().then(res => console.log(res.data))

// POST /posts
api.posts({ title: '...' }).create()

```

## createAxiosRest()

`createAxiosRest(axiosInst, config)`

* `axiosInst` - Axios Instance - required - create with `axios.create()` . See [Axios documentation](https://github.com/axios/axios#axioscreateconfig)

* `config` - object - required
  * `resources` - object - optional - list of resources
  * `actions` - object - optional - list of actions
  * `idKey` - string - optional. Default `id`

`createAxiosRest` return an object, with resources and actions. Both are function and take `data` as paramaters

## Resources

### Format

```js
api.resourceName(data).methodName(axiosConfig)
```
* `resourceName` - name of your resource
* `data` object | string | number - body request or id into url path 
* `methodName` - correspond to `fetch`, `create`, `update`, `delete`, or a custom method
* `axiosConfig` object - optional - It correspond to config of `axios.request(config)`. Usefull for header, params, etc.

Each action return the Promise of `axios.request()`

* #### fetch
```js
api.resourceName(data).fetch()
```
data type: `string`, `number`, `undefined`

* #### create
```js
api.resourceName(data).create()
```
data type: `object`, `array`

* #### update
```js
api.resourceName(data).update() // PATCH
api.resourceName(data).update({method: 'put'}) // PUT
```
data type: `object`, `array`


* #### delete
```js
api.resourceName(data).delete()
```
data type: `string`, `number`, `array`

### Resource example

```js
import axios from 'axios'
import createAxiosRest from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  resources: {
    posts: {
      url: 'posts',
    },
  },
}

const api = createAxiosRest(axiosInst, config)

// GET /posts
api.posts().fetch().then(res => console.log(res.data))

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

### Sub resources and actions
Each resources can have sub resources and actions

```js
import axios from 'axios'
import createAxiosRest from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  resources: {
    posts: {
      url: 'posts',
      resources: {
        comments: {
          uri: 'comments'
        }
      },
      actions: {
        fetchMostRead: {
          uri: 'most-read',
          method: 'POST'
        }
      }
    },
  },
}

const api = createAxiosRest(axiosInst, config)

// GET /posts/1/comments
api.posts(1).comments().fetch()

// POST /posts/1/comments
api.posts(1).comments({ author: '...', text: 'Amazing article !' }).create()

// GET /posts/most-read
api.posts().fetchMostRead();

```


## Actions
Actions are like resources, but without CRUD methods. You need to defined a `method` for an action

### Format

```js
api.actionName(data, axiosConfig)
```
* `actionName` - name of your custom action
* `data` object | string | number - body request or id into url path 
* `axiosConfig` object - optional - It correspond to config of `axios.request(config)`. Usefull for header, params, etc.

### Action example

```js
import axios from 'axios'
import createAxiosRest from 'axios-rest'

const axiosInst = axios.create({
  baseURL: 'http://api.website.com',
})

const config = {
  resources: {},
  actions: {
    login: {
      uri: 'login',
      method: 'POST'
    }
  }
}

const api = createAxiosRest(axiosInst, config)

api.login({ email: '...', password: '...' })

```
