import isFunction from "lodash.isfunction"
import { IStringAnyMap } from "./types"

const noop = () => {}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

type AsyncGetOptions = {
  default?: any
  timeout?: number
}

export default (params: Params = {}) => {
  const { data = {}, onChange = noop, errorOnMissing = true } = params

  const handleChange = (key: string, val: any) => {
    if (onChange !== noop && isFunction(onChange)) {
      onChange(key, val)
    }
  }

  const get = (key: string, errorOnMissing: boolean, def?: any) => {
    if (key in data) {
      return data[key]
    } else if (def) {
      return def
    } else if (errorOnMissing) {
      throw new TinBinError("Missing dependency " + key)
    } else {
      return undefined
    }
  }

  const asyncGet = async (key: string, options?: AsyncGetOptions) => {
    const { default: def = undefined, timeout = 2000 } = options || {}
    let waited = 0
    let found = false
    let result = def

    if (key in data) {
      return data[key]
    }

    while (!found || waited <= timeout) {
      await sleep(100)
      waited += 100

      if (key in data) {
        found = true
        result = data[key]
      }
    }

    if (!found && errorOnMissing) {
      throw new TinBinError("Missing dependency " + key)
    }

    return result
  }

  return {
    get: (key: string, def?: any) => get(key, errorOnMissing, def),
    asyncGet,
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
