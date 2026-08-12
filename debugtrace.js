/**
 * @file debugtrace.js
 * @copyright 2015 Masato Kokubo
 * @license MIT
 */
"use strict";

(function(root, factory) {
  const debugtrace = factory(root)

  if (typeof module === 'object' && module.exports) {
    module.exports = debugtrace
  }

  if (root) {
    root.debugtrace = debugtrace
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
class LogBuffer {
  constructor(maximumDataOutputWidth) {
    this._maximumDataOutputWidth = maximumDataOutputWidth
    this._nestLevel = 0
    this._appendNestLevel = 0
    this._lines = []
    this._lastLine = ''
  }

  lineFeed() {
    this._lines.push([this._nestLevel + this._appendNestLevel, this._lastLine.replace(/ +$/, '')])
    this._appendNestLevel = 0
    this._lastLine = ''
  }

  upNest() {
    ++this._nestLevel
  }

  downNest() {
    --this._nestLevel
  }

  append(value, nestLevel = 0, noBreak = false) {
    const str = value.toString()
    if (!noBreak && this.length > 0 && this.length + str.length > this._maximumDataOutputWidth)
      this.lineFeed()
    this._appendNestLevel = nestLevel
    this._lastLine += str
    return this
  }

  noBreakAppend(value) {
    return this.append(value, 0, true)
  }

  appendBuffer(separator, buff) {
    if (separator != null)
      this.append(separator, 0, true)
    let index = 0
    for (const line of buff.lines) {
      if (index > 0)
        this.lineFeed()
      this.append(line[1], line[0], index == 0 && separator != null)
      ++index
    }
    return this
  }

  get length() {
    return this._lastLine.length
  }

  get isMultiLines() {
    return this._lines.length > 1 || this._lines.length == 1 && this.length > 0
  }

  get lines() {
    let lines = []
    lines.push(...this._lines)
    if (this.length > 0)
      lines.push([this._nestLevel, this._lastLine])
    return lines
  }
}

/** @private */
let nestLevel     = 0 // Nest Level
let previousNestLevel = 0 // Previous Nest Level

// Array of indent strings
const indentStrings = []

// Array of data indent strings
const dataIndentStrings = []

// Array of times at enter
const enterTimes = []

// version
const version = '3.0.0'

// Reflected object array
let reflectedObjects = []

let reflectionNest = 0

let initialized = false

/**
 * Returns a string corresponding to the current indent.
 * @private
 * @param {number} dataNestLevel the data nest level
 * @return {string} a indent string
 */
const getIndentString = (dataNestLevel = 0) => {
  // make indentStrings if necessary
  if (indentStrings.length < 2 || indentStrings[1] != debugtrace.indentString) {
    indentStrings.splice(0, indentStrings.length) // initializes the array
    indentStrings.push('')
    for (let index = 1; index < 32; ++index)
      indentStrings.push(indentStrings[indentStrings.length - 1] + debugtrace.indentString)
  }

  // make dataIndentStrings if necessary
  if (dataIndentStrings.length < 2 || dataIndentStrings[1] != debugtrace.dataIndentString) {
    dataIndentStrings.splice(0, dataIndentStrings.length) // initializes the array
    dataIndentStrings.push('')
    for (let index = 1; index < 32; ++index)
      dataIndentStrings.push(dataIndentStrings[dataIndentStrings.length - 1] + debugtrace.dataIndentString)
  }

    return indentStrings[
      nestLevel < 0 ? 0 :
      nestLevel >= indentStrings.length ? indentStrings.length - 1
        : nestLevel]
    + dataIndentStrings[
      dataNestLevel < 0 ? 0 :
      dataNestLevel >= dataIndentStrings.length ? dataIndentStrings.length - 1
        : dataNestLevel]
}

/**
 * Increases the nest level.
 * @private
 */
const upNest = () => {
  previousNestLevel = nestLevel
  ++nestLevel
}

/**
 * Decreases the nesting level.
 * @private
 */
const downNest = () => {
  previousNestLevel = nestLevel
  --nestLevel
}

/**
 * Returns a caller stack trace element.
 * @private
 * @return a caller stack trace element
 */
const getCallerInfo = () => {
  const myModuleName = /debugtrace\.js$/

  const stack = new Error('').stack
  const callerInfos = (typeof stack == 'string' ? stack.split('\n') : [])
    .map(line => {
      // V8/Node: "at functionName (file:line:column)"
      // Firefox:  "functionName@file:line:column"
      const v8Match = line.match(/^\s*at\s+(?:(.*?)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/)
      const firefoxMatch = line.match(/^(.*?)@(.+?):(\d+):(\d+)\s*$/)
      const match = v8Match || firefoxMatch
      if (!match)
        return undefined

      const functionName = match[1] || ''
      let fileName = match[2]
      let delimIndex = fileName.lastIndexOf('/')
      if (delimIndex >= 0)
        fileName = fileName.substring(delimIndex + 1)
      else {
        let delimIndex = fileName.lastIndexOf('\\')
        if (delimIndex >= 0)
          fileName = fileName.substring(delimIndex + 1)
      }
      return {
        functionName : functionName,
        fileName: fileName,
        lineNumber: match[3],
        columnNumber: match[4]
      }
    })
    .filter(element => element && !myModuleName.test(element.fileName))

  return callerInfos[0] || {
    functionName: '',
    fileName: '',
    lineNumber: '',
    columnNumber: ''
  }
}

/**
 * Returns the type name of the value.
 * @private
 * @param {string} message the message to output
 * @param {boolean} withCallerInfo - true if outputs the caller information, false otherwise
 */
const getTypeName = (value, printOptions) => {
  let typeName = ''
  try {typeName = value.constructor.name} catch {}
  
  if (typeName == 'String') {
    typeName = ''
    if (printOptions.stringLength)
      typeName = debugtrace.formatLength(value.length)
  } else {
    if (typeName == 'Array')
      typeName = ''
    if (printOptions.arrayLength) {
      if (value.length >= 0) {
        if (typeName.length > 0)
          typeName += ' '
        typeName += debugtrace.formatLength(value.length)
      }
    } else if (printOptions.size) {
      if (value.size >= 0) {
        if (typeName.length > 0)
          typeName += ' '
        typeName += debugtrace.formatSize(value.size)
      }
    }
  }

  if (typeName.length > 0)
    typeName = '(' + typeName + ')'
  return typeName
}

/**
 * Outputs the log.
 * @private
 * @param {string} message the message to output
 * @return {string} the browser name and version
 */
const getEnvironment = () => {
  if (typeof globalThis.Deno !== 'undefined' && globalThis.Deno?.version?.deno)
    return `Deno ${globalThis.Deno.version.deno}`

  if (typeof globalThis.Bun !== 'undefined' && globalThis.Bun?.version)
    return `Bun ${globalThis.Bun.version}`

  if (typeof globalThis.process !== 'undefined' && globalThis.process?.versions?.electron)
    return `Electron ${globalThis.process.versions.electron} (Node.js ${globalThis.process.versions.node})`

  if (typeof globalThis.process !== 'undefined' && globalThis.process?.versions?.nw)
    return `NW.js ${globalThis.process.versions.nw} (Node.js ${globalThis.process.versions.node})`

  if (typeof globalThis.process !== 'undefined' && globalThis.process?.versions?.node)
    return `Node.js ${globalThis.process.versions.node}`

  if (typeof globalThis.navigator !== 'undefined' && globalThis.navigator?.userAgent) {
    // Browser
    const userAgent = globalThis.navigator.userAgent
    let match;

    match = userAgent.match(/Edg(?:A|iOS)?\/([\d.]+)/)
    if (match) return `Microsoft Edge ${match[1]}`

    match = userAgent.match(/OPR\/([\d.]+)/)
    if (match) return `Opera ${match[1]}`

    match = userAgent.match(/Vivaldi\/([\d.]+)/)
    if (match) return `Vivaldi ${match[1]}`

    match = userAgent.match(/SamsungBrowser\/([\d.]+)/)
    if (match) return `Samsung Internet ${match[1]}`

    match = userAgent.match(/FxiOS\/([\d.]+)/)
    if (match) return `Firefox ${match[1]}`

    match = userAgent.match(/Firefox\/([\d.]+)/)
    if (match) return `Firefox ${match[1]}`

    match = userAgent.match(/CriOS\/([\d.]+)/)
    if (match) return `Chrome ${match[1]}`

    match = userAgent.match(/Chrome\/([\d.]+)/)
    if (match) return `Chrome ${match[1]}`

    match = userAgent.match(/Chromium\/([\d.]+)/)
    if (match) return `Chromium ${match[1]}`

    match = userAgent.match(/Version\/([\d.]+).*Safari/)
    if (match) return `Safari ${match[1]}`
  }

  return 'Unknown';
}

/**
 * Outputs the log.
 * @private
 * @param {string} message the message to output
 */
const printSub = message => {
  if (!initialized) {
    initialized = true
    printSub('debugtrace-js ' + version + ' on ' + getEnvironment())
    printSub('')
  }

  reflectedObjects = []
  const logString = debugtrace.formatLogDate(new Date()) + ' ' + message
  debugtrace.basicPrint(logString)
}

/**
 * Returns a string representation of the message and the value.
 * @private
 * @param {*} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toString = (value, printOptions) => {
  let buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  if (value === undefined)
    buff.append('undefined')
  else if (value === null)
    buff.append('null')
  else {
    const type = Object.prototype.toString.call(value).slice(8, -1)
    switch (type) {
    case 'Boolean' :
    case 'Symbol'  :
    case 'Number'  :
    case 'BigInt'  :
    case 'Error'   :
    case 'RegExp'  : buff.append(value); break
    case 'Date'    : buff.append(debugtrace.formatDate(value)); break
    case 'String'  : buff = toStringString(value, printOptions); break
    case 'Function': buff = toStringFunction(value, printOptions); break
    default:
      if (reflectedObjects.findIndex(element => element === value) >= 0)
        buff.noBreakAppend(debugtrace.cyclicReferenceString)
      else {
        reflectedObjects.push(value)
        if (type.endsWith('Array'))
          buff = toStringArray(value, printOptions)
        else {
          switch (type) {
          case 'Map': buff = toStringMap(value, printOptions); break
          case 'Set': buff = toStringArray(value, printOptions); break
          default:
            if (reflectionNest >= printOptions.reflectionNestLimit) {
              buff.noBreakAppend(debugtrace.limitString)
            } else {
              ++reflectionNest
              buff = toStringObject(value, printOptions)
              --reflectionNest
            }
            break
          }
        }
        reflectedObjects.pop()
      }
      break
    }
  }

  return buff
}

/**
 * Returns a string representation of the array as a LogBuffer.
 * @private
 * @param {Array} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringArray = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.noBreakAppend(getTypeName(value, printOptions))
  buff.noBreakAppend('[')

  const bodyBuff = toStringArrayBody(value, printOptions)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth;

  if (isMultiLines) {
    buff.lineFeed();
    buff.upNest();
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    buff.lineFeed();
    buff.downNest();
  }

  buff.noBreakAppend(']');

  return buff;
}

const toStringArrayBody = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0
  let wasMultiLines = false;
  for (let element of value) {
    if (index > 0)
      buff.noBreakAppend(', ')

    if (index >= printOptions.collectionLimit) {
      buff.append(debugtrace.limitString)
      break
    }

    const elementBuff = toString(element, printOptions)
    if (index > 0 && (wasMultiLines|| elementBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, elementBuff)

    ++index
    wasMultiLines = elementBuff.isMultiLines
  }

  return buff
}

/**
 * Returns a string representation of the string as a LogBuffer.
 * @private
 * @param {string} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringString = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)
  buff.noBreakAppend(getTypeName(value, printOptions))
  buff.noBreakAppend('\'')
  let index = 0
  for (let ch of value) {
    if (index >= printOptions.stringLimit) {
      buff.noBreakAppend(debugtrace.limitString)
      break
    }
    switch (ch) {
    case '\0': buff.noBreakAppend('\\0' ); break; // 00 NUL
    case '\b': buff.noBreakAppend('\\b' ); break; // 08 BS
    case '\t': buff.noBreakAppend('\\t' ); break; // 09 HT
    case '\n': buff.noBreakAppend('\\n' ); break; // 0A LF
    case '\v': buff.noBreakAppend('\\v' ); break; // 0B VT
    case '\f': buff.noBreakAppend('\\f' ); break; // 0C FF
    case '\r': buff.noBreakAppend('\\r' ); break; // 0D CR
    case '\'': buff.noBreakAppend('\\\'' ); break; // '
    case '\\': buff.noBreakAppend('\\\\'); break; // \
    default:
      if (ch < ' ' || ch == '\u007F')
        buff.noBreakAppend('\\x')
          .noBreakAppend(('0' + ch.charCodeAt(0).toString(16)).slice(-2).toUpperCase());
      else
        buff.noBreakAppend(ch);
      break;
    }
    ++index
  }
  buff.noBreakAppend('\'')
  return buff
}

/**
 * Returns a string representation of the function as a LogBuffer.
 * @private
 * @param {Function} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringFunction = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  const lines = ('' + value).split('\n')
  buff.noBreakAppend(lines[0])
  if (lines.length >= 2)
    buff.noBreakAppend(debugtrace.limitString)

  return buff
}

/**
 * Returns a string representation of the object as a LogBuffer.
 * @private
 * @param {object} value the value to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringObject = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.append(getTypeName(value, printOptions))

  const bodyBuff = toStringObjectBody(value, printOptions)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth
  buff.noBreakAppend('{')

  if (isMultiLines) {
    buff.lineFeed()
    buff.upNest()
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    if (buff.length > 0)
      buff.lineFeed()
    buff.downNest()
  }

  buff.noBreakAppend('}')

  return buff
}

const toStringObjectBody = (value, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0 
  let wasMultiLines = false;
  for (const propertyName in value) {
    if (index > 0)
      buff.noBreakAppend(', ')

    const memberBuff = new LogBuffer(debugtrace.maximumDataOutputWidth)
    memberBuff.append(propertyName)
    memberBuff.appendBuffer(debugtrace.keyValueSeparator, toString(value[propertyName], printOptions))

    if (index > 0 && (wasMultiLines || memberBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, memberBuff)

    wasMultiLines = memberBuff.isMultiLines
    ++index
  }

  return buff
}

/**
 * Returns a string representation of the array as a LogBuffer.
 * @private
 * @param {Map} map the map to output
 * @return {LogBuffer} a LogBuffer
 */
const toStringMap = (map, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  buff.noBreakAppend(getTypeName(map, printOptions))
  buff.noBreakAppend('{')

  const bodyBuff = toStringMapBody(map, printOptions)

  const isMultiLines = bodyBuff.isMultiLines || buff.length + bodyBuff.length > debugtrace.maximumDataOutputWidth;

  if (isMultiLines) {
    buff.lineFeed();
    buff.upNest();
  }

  buff.appendBuffer(null, bodyBuff);

  if (isMultiLines) {
    buff.lineFeed();
    buff.downNest();
  }

  buff.noBreakAppend('}');

  return buff;
}

const toStringMapBody = (map, printOptions) => {
  const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)

  let index = 0
  let wasMultiLines = false;
  for (let key of map.keys()) {
    if (index > 0)
      buff.noBreakAppend(', ')

    if (index >= printOptions.collectionLimit) {
      buff.append(debugtrace.limitString)
      break
    }

    const elementBuff = toString(key, printOptions)
    elementBuff.appendBuffer(debugtrace.keyValueSeparator, toString(map.get(key), printOptions))
    if (index > 0 && (wasMultiLines|| elementBuff.isMultiLines))
      buff.lineFeed()
    buff.appendBuffer(null, elementBuff)

    ++index
    wasMultiLines = elementBuff.isMultiLines
  }

  return buff
}

const debugtrace = {}

/**
 * @namespace debugtrace
 */
const debugtraceApi = (function() {
  /**
   * Formatting function of log output when entering methods.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @return {string} a formatted string
   */
  debugtrace.formatEnter = (name, fileName, lineNumber) =>
    `Enter ${name} (${fileName}:${lineNumber})`

  /**
   * Formatting function of log output when leaving methods.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @param {string} duration the duration since invoking the corresponding `enter` method
   * @return {string} a formatted string
   */
  debugtrace.formatLeave = (name, fileName, lineNumber, duration) =>
    `Leave ${name} (${fileName}:${lineNumber}) duration: ${duration}`

  /**
   * Indentation string for code.
   * @type {string}
   */
  debugtrace.indentString = '| '

  /**
   * Indentation string for data.
   * @type {string}
   */
  debugtrace.dataIndentString = '  '

  /**
   * String to represent that it has exceeded the limit.
   * @type {string}
   */
  debugtrace.limitString = '...'

  /**
   * String to be output instead of not outputting value.
   * @type {string}
   */
  debugtrace.nonOutputString = '***' // Does not use

  /**
   * String to represent that the cyclic reference occurs.
   * @type {string}
   */
  debugtrace.cyclicReferenceString = '*** cyclic reference ***'

  /**
   * Separator string between the variable name and value.
   * @type {string}
   */
  debugtrace.varNameValueSeparator = ' = '

  /**
   * Separator string between the key and value of Map object.
   * @type {string}
   */
  debugtrace.keyValueSeparator = ': '

  /**
   * Formatting function of print method suffix.
   * @type {function}
   * @param {string} name the function or method name
   * @param {string} fileName the file name
   * @param {string} lineNumber the line number
   * @return {string} a formatted string
   */
  debugtrace.formatPrintSuffix = (name, fileName, lineNumber) => ` (${fileName}:${lineNumber})`

  /**
   * Formatting function of the length of array and string.
   * @type {function}
   * @param {number} length the length
   */
  debugtrace.formatLength = length => `length:${length}`

  /**
   * Formatting function of the size of Map and Set.
   * @type {function}
   * @param {string} size the size
   */
  debugtrace.formatSize = size => `size:${size}`

  /**
   * Formatting function of Date.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatDate = date => {
    let timezoneOffset = date.getTimezoneOffset()
    const offsetSign = timezoneOffset < 0 ? '+' : '-'
    if (timezoneOffset < 0)
      timezoneOffset = -timezoneOffset
    const str =  date.getFullYear() + '-' +
      ('0'  + (date.getMonth  () + 1 )).slice(-2) + '-' +
      ('0'  +  date.getDate   ()      ).slice(-2) + ' ' +
      ('0'  +  date.getHours  ()      ).slice(-2) + ':' +
      ('0'  +  date.getMinutes()      ).slice(-2) + ':' +
      ('0'  +  date.getSeconds()      ).slice(-2) + '.' +
      ('00' +  date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'  +  Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'  +  timezoneOffset % 60).slice(-2)
    return str
  }

  /**
   *The format function for duration of formatLeave.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatTime = date =>
    ('0'  +  date.getUTCHours  ()     ).slice(-2) + ':' +
    ('0'  +  date.getUTCMinutes()     ).slice(-2) + ':' +
    ('0'  +  date.getUTCSeconds()     ).slice(-2) + '.' +
    ('00' +  date.getUTCMilliseconds()).slice(-3)

  /**
   * The format function for the log date and time.
   * @type {function}
   * @param {Date} date the date
   * @return {string} a formatted string
   */
  debugtrace.formatLogDate = date => {
    let timezoneOffset = date.getTimezoneOffset()
    const offsetSign = timezoneOffset < 0 ? '+' : '-'
    if (timezoneOffset < 0)
      timezoneOffset = -timezoneOffset
    const str =  date.getFullYear() + '-' +
      ('0'  + (date.getMonth  () + 1 )).slice(-2) + '-' +
      ('0'  +  date.getDate   ()      ).slice(-2) + ' ' +
      ('0'  +  date.getHours  ()      ).slice(-2) + ':' +
      ('0'  +  date.getMinutes()      ).slice(-2) + ':' +
      ('0'  +  date.getSeconds()      ).slice(-2) + '.' +
      ('00' +  date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'  +  Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'  +  timezoneOffset % 60).slice(-2)
    return str
  }

  /**
   * The minimum value to output the length of string.
   * @type {number}
   */
  debugtrace.maximumDataOutputWidth = 70

  /**
   * Limit value of elements for array, Map and Set to output.
   * @type {number}
   */
  debugtrace.collectionLimit = 128 // <- 512 since 2.2.0

  /**
   * Limit value of characters for string to output.
   * @type {number}
   */
  debugtrace.stringLimit = 256 // <- 8192 since 2.2.0

  /**
   * The limit value for reflection nesting.
   * @type {number}
   */
  debugtrace.reflectionNestLimit = 4

  /**
   * Definition of basic print function.
   * @type {function}
   * @since 2.1.0
   */
  debugtrace.basicPrint = (typeof console !== 'undefined' && console.log)
    ? console.log.bind(console)
    : () => {}

  /**
   * Outputs a log when entering function.
   */
  debugtrace.enter = () => {
    if (previousNestLevel > nestLevel)
      printSub(getIndentString()) // Empty Line
    const callerInfo = getCallerInfo()
    debugtrace.lastLog = getIndentString() +
      debugtrace.formatEnter(
        callerInfo.functionName,
        callerInfo.fileName,
        callerInfo.lineNumber
      )
    printSub(debugtrace.lastLog)
    upNest()
    enterTimes.push(Date.now())
  }

  /**
   * Outputs a log when leaving function.
   */
  debugtrace.leave = () => {
    const now = Date.now()
    const duration = now - (enterTimes.length > 0 ? enterTimes.pop() : now)
    downNest()
    const callerInfo = getCallerInfo()
    debugtrace.lastLog = getIndentString() +
      debugtrace.formatLeave(
        callerInfo.functionName,
        callerInfo.fileName,
        callerInfo.lineNumber,
        debugtrace.formatTime(new Date(duration))
      )
    printSub(debugtrace.lastLog)
  }

  debugtrace.lastLog = ''

  /**
   * Outputs the message to the log.
   * @param {string} message the message
   * @return {*} the message
   */
  debugtrace.printMessage = message => {
    const callerInfo = getCallerInfo()
    const printSuffix = debugtrace.formatPrintSuffix(
      callerInfo.functionName,
      callerInfo.fileName,
      callerInfo.lineNumber
    )

    debugtrace.lastLog = getIndentString() + message + printSuffix
    printSub(debugtrace.lastLog)
    return message
  }

  /**
   * Outputs the name and the value to the log.
   * @param {string} name the name of the value
   * @param {*} value the value to output
   * @param {Object} printOptions it has the following properties:
   *   stringLength: If true, outputs the string length
   *   arrayLength: If true, outputs the array length
   *   size: If true, outputs the size of Map or Set
   *   collectionLimit: Limit on the number of output elements for Map and Set
   *   stringLimit: Limit on the number of output characters for strings
   *   reflectionNestLimit: Limit on the number of reflection nests
   * @return {*} the value
   */
  debugtrace.print = (name, value, printOptions) => {
    printOptions ??= {}
    printOptions.stringLength ??= false
    printOptions.arrayLength ??= false
    printOptions.size ??= false
    printOptions.collectionLimit ??= debugtrace.collectionLimit
    printOptions.stringLimit ??= debugtrace.stringLimit
    printOptions.reflectionNestLimit ??= debugtrace.reflectionNestLimit

    const callerInfo = getCallerInfo()
    const printSuffix = debugtrace.formatPrintSuffix(
      callerInfo.functionName,
      callerInfo.fileName,
      callerInfo.lineNumber
    )

    const buff = new LogBuffer(debugtrace.maximumDataOutputWidth)
    buff.append(name)
      .appendBuffer(debugtrace.varNameValueSeparator, toString(value, printOptions))
      .noBreakAppend(printSuffix)
    let index = 0
    const lines = buff.lines
    debugtrace.lastLog = ''
    for (const line of lines) {
      const outputLine = getIndentString(line[0]) + line[1]
      if (debugtrace.lastLog != '')
        debugtrace.lastLog += '\n'
      debugtrace.lastLog += outputLine
      printSub(outputLine)
      ++index
    }
    return value
  }

    return debugtrace
})()

return debugtraceApi
}))
