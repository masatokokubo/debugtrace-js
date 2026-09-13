// ReadmeExample.ts
import debugtrace from 'debugtrace-js' // Use the package.
//import debugtrace from '../debugtrace.js' // Use the file.

class Contact {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public birthday: Date
  ) {}
}

func1()

function func1(): void {
  debugtrace.enter() // TODO: Debug
  debugtrace.printMessage('Hello, World!') // TODO: Debug
  func2()
  debugtrace.leave() // TODO: Debug
}

function func2(): void {
  debugtrace.enter() // TODO: Debug
  const contacts: Contact[] = [
    new Contact(1, 'Akane', 'Apple', new Date(Date.UTC(1991, 2, 3))),
    new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
  ]
  debugtrace.print('contacts', contacts) // TODO: Debug
  debugtrace.leave() // TODO: Debug
}
