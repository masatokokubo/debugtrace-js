// ES2021Example.js
const debugtrace = require('../debugtrace.js')

let a = null
a ||= 1_234
debugtrace.print('a', a)

let str = 'abcdabcdabcd'
str = str.replaceAll('ab', 'AB')
debugtrace.print('str', str)
