// ES2021Example.js
const debugtrace = require('debugtrace-js') // Use the package.
//const debugtrace = require('../debugtrace.js') // Use the file.

let a = null
a ||= 1_234
debugtrace.print('a', a)

let str = 'abcdabcdabcd'
str = str.replaceAll('ab', 'AB')
debugtrace.print('str', str)
