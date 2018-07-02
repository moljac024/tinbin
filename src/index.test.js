const Container = require("./index")

test("throws on missing data without default value", () => {
  const container = Container()

  expect(_ => {
    container.get("foo")
  }).toThrow()
})

test("provides default value when data missing", () => {
  const container = Container()

  expect(container.get("foo", "bar")).toEqual("bar")
})

test("calls onChange correctly", () => {
  const onChange = jest.fn()
  const container = Container({
    onChange,
  })

  container.put("foo", "bar")

  expect(onChange).toBeCalledWith("foo", "bar")

  container.remove("foo")

  expect(onChange).toBeCalledWith("foo", undefined)
})

test("does not throw if errorOnMissing === false", () => {
  const container = Container({
    errorOnMissing: false,
  })

  expect(container.get("foo")).toEqual(undefined)
})

test("can initialize data", () => {
  const container = Container({
    data: {
      foo: 1,
    },
  })

  expect(container.get("foo")).toEqual(1)
})
