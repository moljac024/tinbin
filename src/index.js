const isFunction = require("lodash.isfunction")

const noop = () => {}

class TinBinError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = message

    const customStackTrace = new Error().stack.split("\n")
    customStackTrace.splice(1, 2)
    this.stack = customStackTrace.join("\n")
  }
}

export default ({
  data = {},
  onChange = noop,
  errorOnMissing = true,
} = {}) => {
  const handleChange = (key, val) => {
    if (onChange !== noop && isFunction(onChange)) {
      onChange(key, val)
    }
  }

  return {
    get: (key, def) => {
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
    put: (key, val) => {
      data[key] = val
      handleChange(key, val)
    },
    remove: key => {
      delete data[key]
      handleChange(key, undefined)
    },
    read: _ => data,
  }
}
