// ES2020Example.js
const debugtrace = require('debugtrace-js') // Use the package.
//const debugtrace = require('../debugtrace.js') // Use the file.

const bigInt1 = 100000001n
debugtrace.print('bigInt1', bigInt1)

const bigInt2 = bigInt1 * bigInt1
debugtrace.print('bigInt2', bigInt2)

const bigInt3 = bigInt2 * bigInt2
debugtrace.print('bigInt3', bigInt3)

const bigInt4 = bigInt3 * bigInt3
debugtrace.print('bigInt4', bigInt4)

const bigInt5 = bigInt4 * bigInt4
debugtrace.print('bigInt5', bigInt5)

const bigInt6 = bigInt5 * bigInt5
debugtrace.print('bigInt6', bigInt6)

const obj = {c: 'C', b: 'B', a: 'A'}
debugtrace.print('obj', obj)
for (let element in obj)
    debugtrace.print('element', element)
