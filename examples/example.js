"use strict";

const debugtrace = require('../debugtrace.js')

function func1() {
  debugtrace.enter()
  func2()
  func3()
  debugtrace.leave()
}

function func2() {
  debugtrace.enter()
  debugtrace.leave()
}

function func3() {
  debugtrace.enter()

  const nullValue = null, undefinedValue = undefined
  debugtrace.print("nullValue", nullValue)
  debugtrace.print("undefinedValue", undefinedValue)

  const boolFalse = false, boolTrue = true
  debugtrace.print("boolFalse", boolFalse)
  debugtrace.print("boolTrue", boolTrue)

  const number0 = 0, number1_234 = 1.234
  debugtrace.print("number0", number0)
  debugtrace.print("number1_234", number1_234)

  const stringABC = "AAAAAAAAAAbbbbbbbbbbCCCCCCCCCC"
  debugtrace.print("1 stringABC", stringABC)
  debugtrace.print("2 stringABC", stringABC, {stringLength:true})
  debugtrace.print("3 stringABC", stringABC, {stringLimit:15})
  debugtrace.print("4 stringABC", stringABC, {stringLength:true, stringLimit:15})

  const dateNow = new Date
  debugtrace.print("dateNow", dateNow)

  const error = new Error("This is a error.")
  debugtrace.print("error", error)

  const array = [1, 2, [1.1, 1.2, 1.3]]
  debugtrace.print("array", array)

  const numbers = []
  for (let index = 0; index < 100; ++index) {
    numbers.push(index)
  }
  debugtrace.print("1 numbers", numbers, {arrayLength:false})
  debugtrace.print("2 numbers", numbers, {arrayLength:true})
  debugtrace.print("3 numbers", numbers, {collectionLimit:20})
  debugtrace.print("4 numbers", numbers, {arrayLength:true, collectionLimit:10})

  function add(a, b) {
    return a + b
  }
  debugtrace.print("add", add)

  const d = (function (a, b) {
    debugtrace.enter()
    const c = a + b
    debugtrace.print("c", c)
    debugtrace.leave()
    return c
  })(5, 6)
  debugtrace.print("d", d)

  const object = {a:1, b:2, c:3}
  debugtrace.print("object", object)

  class Point {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
    add(p) {return new Point(this.x + p.x, this.y + p.y)}
    sub(p) {return new Point(this.x - p.x, this.y - p.y)}
    mul(p) {return new Point(this.x * p.x, this.y * p.y)}
    div(p) {return new Point(this.x / p.x, this.y / p.y)}
  }
  debugtrace.print("Point", Point)

  const point1 = new Point(10, 20)
  const point2 = new Point(30, 40)
  const point3 = point1.add(point2).mul(point1.sub(point2))
  debugtrace.print("point1", point1)
  debugtrace.print("point2", point2)
  debugtrace.print("point3", point3)

  debugtrace.leave()
}

func1()
