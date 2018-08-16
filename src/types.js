// @flow

import { methods } from './methods'

export type Action = {|
  uri: string,
  method: $Keys<typeof methods>,
|}

export type Actions = {
  [actionName: string]: Action,
}

export type Resource = {|
  uri: string,
  resources?: {
    [resourceName: string]: Resource,
  },
  actions?: Actions,
|}

export type Resources = {
  [resourceName: string]: Resource,
}

export type Config = {
  resources?: Resources,
  actions?: Actions,
  idKey: string,
}
