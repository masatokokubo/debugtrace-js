// ReadmeExample.js
const debugtrace = require('debugtrace-js') // Use the package.
//const debugtrace = require('../debugtrace.js') // Use the file.

class Contact {
  constructor(id, firstName, lastName, birthday) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.birthday = birthday
  }
}

func1()

function func1() {
  debugtrace.enter() // TODO: Debug
  debugtrace.printMessage('Hello, World!') // TODO: Debug
  func2()
  debugtrace.leave() // TODO: Debug
}

function func2() {
  debugtrace.enter() // TODO: Debug
  let contacts = [
    new Contact(1, 'Akane' , 'Apple', new Date(Date.UTC(1991, 2, 3))),
    new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
  ]
  debugtrace.print('contacts', contacts) // TODO: Debug
  debugtrace.leave() // TODO: Debug
}
