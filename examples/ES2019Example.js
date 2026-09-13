// ES2019Example.js
const debugtrace = require('debugtrace-js') // Use the package.
//const debugtrace = require('../debugtrace.js') // Use the file.

const str = '   AAA   BBB   '

debugtrace.print('str', str)
debugtrace.print('str.trim()', str.trim())
debugtrace.print('str.trimStart()', str.trimStart())
debugtrace.print('str.trimEnd()', str.trimEnd())

const arr1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
debugtrace.print('arr1', arr1)
debugtrace.print('arr1.flat(2)', arr1.flat(2))

const arr2 = arr1.flat(2)
debugtrace.print('arr2.map(e => [e, e * e])', arr2.map(e => [e, e * e]))
debugtrace.print('arr2.flatMap(e => [e, e * e]', arr2.flatMap(e => [e, e * e]))
