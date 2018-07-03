Very simple data bag.

You can put into and grab stuff from it. It's original use-case was to be a
simple DI Container that can be used for run-time dynamic dependencies. It is a
mutable container (and a thin wrapper around a simple object) so please use it
with care.

### Install

```console
$ npm install tinbin
```

### Usage

```js
const Tinbin = require("tinbin")

const container = Tinbin({
  errorOnMissing: false,
})

container.put("foo", "bar")

container.get("foo") // bar
container.get("baz") // undefined
container.remove("foo")
container.get("foo") // undefined
```

## API

### Tinbin([options])

Returns a container instance.

#### options

Type: `Object`

##### errorOnMissing

Type: `boolean`<br>
Default: `true`

When true, will throw error on requesting a key with no value. Otherwise returns undefined.

#### onChange

Type: `Function`

Function to be invoked when data in container is changed (either put or remove
is called). Function is called with two parameters - (key, value). If key was
removed, value is undefined.

## Instance API

### container.get(key)

Returns the value for key. If key does not
exist in container and it was made with `({errorOnMissing: true})` this function
will throw an error. Otherwise it will return undefined.

#### key

Type: `String`

Key must be a string, as it needs to be valid key for object. In a future
version container might move to using Map instead of object under the hood,
which should allow for arbitrary keys.

### container.put(key, value)

Store value under `key`. Successive get calls will see this value.

#### key

Type: `String`

#### value

Type: `Any`

### container.remove(key)

Remove the key and value associated it with it from the container.

#### key

Type: `String`
