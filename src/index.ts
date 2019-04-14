import isFunction from "lodash.isfunction"

import { IStringAnyMap } from "./types"

const noop = () => {}

class TinBinError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TinBinError"
    this.message = message

    const error = new Error()
    const stackTrace = error.stack
    if (stackTrace) {
      const customStackTrace = stackTrace.split("\n")
      customStackTrace.splice(1, 2)
      this.stack = customStackTrace.join("\n")
    } else {
      this.stack = stackTrace
    }
  }
}

type Params = {
  data?: IStringAnyMap
  onChange?: (key: string, value: any) => any
  errorOnMissing?: boolean
}

export default (params: Params = {}) => {
  const { data = {}, onChange = noop, errorOnMissing = true } = params

  const handleChange = (key: string, val: any) => {
    if (onChange !== noop && isFunction(onChange)) {
      onChange(key, val)
    }
  }

  return {
    get: (key: string, def?: any) => {
      if (key in data) {
        return data[key]
      } else if (def) {
        return def
      } else if (errorOnMissing) {
        throw new TinBinError("Missing dependency " + key)
      } else {
        return undefined
      }
    },
    put: (key: string, val: any) => {
      data[key] = val
      handleChange(key, val)
    },
    remove: (key: string) => {
      delete data[key]
      handleChange(key, undefined)
    },
    read: () => data,
  }
}
