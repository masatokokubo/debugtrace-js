# debugtrace-js

[Japanese](README_ja.md)

debugtrace-js is a library that outputs trace logs when debugging JavaScript programs; it can be used in Node.js, Bun, and Deno, as well as in browsers such as Chrome, Edge, Firefox, and Safari.

### 1. Features

* Automatically outputs invoker's function name, source file and line number.
* Automatically indents the log with nesting methods and objects.
* There are no dependent libraries at run time.

### 2. How to use

Do the following for debug target and related methods.

* Run `npm debugtrace-js` in the project's root directory.
* Perform the following steps for the target function(s) and related functions:

1. Insert the appropriate import/script tag near the top of the target file:
  * `const debugtrace = require('debugtrace-js')` - `Node.js`
  * `import debugtrace from 'debugtrace-js'` - `Bun (TypeScript)`
  * `<script src="path/to/debugtrace.js"></script>` - `HTML`
2. Insert `debugtrace.enter()` at the beginning of the function.
3. Insert `debugtrace.leave()` at the end of the function (or immediately before the `return` statement).
4. As needed, insert `debugtrace.print('foo', foo)` to log arguments, local variables, or return values.

The following is an example of JavaScript source used debugtrace-js methods and the log of when it has been executed.

```JavaScript:ReadmeExample.js
// ReadmeExample.js
const debugtrace = require('../debugtrace.js') // TODO: Debug

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
```

```log
node examples/ReadmeExample.js
2026-08-12 07:40:42.091+09:00 debugtrace-js 3.0.0 on Node.js 22.23.1
2026-08-12 07:40:42.104+09:00 
2026-08-12 07:40:42.104+09:00 Enter func1 (ReadmeExample.js:16)
2026-08-12 07:40:42.104+09:00 | Hello, World! (ReadmeExample.js:17)
2026-08-12 07:40:42.104+09:00 | Enter func2 (ReadmeExample.js:23)
2026-08-12 07:40:42.106+09:00 | | contacts = [
2026-08-12 07:40:42.106+09:00 | |   (Contact){
2026-08-12 07:40:42.106+09:00 | |     id: 1, firstName: 'Akane', lastName: 'Apple',
2026-08-12 07:40:42.106+09:00 | |     birthday: 1991-03-03 09:00:00.000+09:00
2026-08-12 07:40:42.106+09:00 | |   },
2026-08-12 07:40:42.106+09:00 | |   (Contact){
2026-08-12 07:40:42.106+09:00 | |     id: 2, firstName: 'Yukari', lastName: 'Apple',
2026-08-12 07:40:42.106+09:00 | |     birthday: 1992-04-04 09:00:00.000+09:00
2026-08-12 07:40:42.107+09:00 | |   }
2026-08-12 07:40:42.107+09:00 | | ] (ReadmeExample.js:28)
2026-08-12 07:40:42.107+09:00 | Leave func2 (ReadmeExample.js:29) duration: 00:00:00.003
2026-08-12 07:40:42.107+09:00 Leave func1 (ReadmeExample.js:19) duration: 00:00:00.003
```

The following is an example of TyprScript source used debugtrace-js methods and the log of when it has been executed.

```JavaScript:ReadmeExample.ts
// ReadmeExample.ts
import debugtrace from '../debugtrace.js'

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
```

```log
bun examples/ReadmeExample.ts
2026-08-12 07:40:47.180+09:00 debugtrace-js 3.0.0 on Bun 1.3.14
2026-08-12 07:40:47.180+09:00 
2026-08-12 07:40:47.180+09:00 Enter func1 (ReadmeExample.ts:16)
2026-08-12 07:40:47.180+09:00 | Hello, World! (ReadmeExample.ts:17)
2026-08-12 07:40:47.180+09:00 | Enter func2 (ReadmeExample.ts:23)
2026-08-12 07:40:47.183+09:00 | | contacts = [
2026-08-12 07:40:47.183+09:00 | |   (Contact){
2026-08-12 07:40:47.183+09:00 | |     id: 1, firstName: 'Akane', lastName: 'Apple',
2026-08-12 07:40:47.183+09:00 | |     birthday: 1991-03-03 09:00:00.000+09:00
2026-08-12 07:40:47.183+09:00 | |   },
2026-08-12 07:40:47.183+09:00 | |   (Contact){
2026-08-12 07:40:47.183+09:00 | |     id: 2, firstName: 'Yukari', lastName: 'Apple',
2026-08-12 07:40:47.183+09:00 | |     birthday: 1992-04-04 09:00:00.000+09:00
2026-08-12 07:40:47.183+09:00 | |   }
2026-08-12 07:40:47.183+09:00 | | ] (ReadmeExample.ts:28)
2026-08-12 07:40:47.183+09:00 | Leave func2 (ReadmeExample.ts:29) duration: 00:00:00.003
2026-08-12 07:40:47.184+09:00 Leave func1 (ReadmeExample.ts:19) duration: 00:00:00.003
```

The following is an HTML used debugtrace-js methods and the log of when it has been executed.

```html
<!-- ReadmeExample.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>HTML Example</title>
    <script src="../debugtrace.js"></script>
    <script>
      class Contact {
        constructor(id, firstName, lastName, birthday) {
          this.id = id
          this.firstName = firstName
          this.lastName = lastName
          this.birthday = birthday
        }
      }

      function func1() {
        debugtrace.enter()
        debugtrace.printMessage('Hello, World!')
        func2()
        debugtrace.leave()
      }

      function func2() {
        debugtrace.enter()
        let contacts = [
          new Contact(1, 'Akane' , 'Apple', new Date(Date.UTC(1991, 2, 3))),
          new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
        ]
        debugtrace.print('contacts', contacts)
        debugtrace.leave()
      }
    </script>
  </head>
  <body>
    <button onclick="func1()">Click me</button>
  </body>
</html>
```

```log
2026-08-12 07:41:07.790+09:00 debugtrace-js 3.0.0 on Firefox 140.0
2026-08-12 07:41:07.791+09:00
2026-08-12 07:41:07.791+09:00 Enter func1 (ReadmeExample.html:20)
2026-08-12 07:41:07.791+09:00 | Hello, World! (ReadmeExample.html:21)
2026-08-12 07:41:07.791+09:00 | Enter func2 (ReadmeExample.html:27)
2026-08-12 07:41:07.792+09:00 | | contacts = [
2026-08-12 07:41:07.792+09:00 | |   (Contact){
2026-08-12 07:41:07.792+09:00 | |     id: 1, firstName: 'Akane', lastName: 'Apple',
2026-08-12 07:41:07.792+09:00 | |     birthday: 1991-03-03 09:00:00.000+09:00
2026-08-12 07:41:07.792+09:00 | |   },
2026-08-12 07:41:07.793+09:00 | |   (Contact){
2026-08-12 07:41:07.793+09:00 | |     id: 2, firstName: 'Yukari', lastName: 'Apple',
2026-08-12 07:41:07.793+09:00 | |     birthday: 1992-04-04 09:00:00.000+09:00
2026-08-12 07:41:07.793+09:00 | |   }
2026-08-12 07:41:07.793+09:00 | | ] (ReadmeExample.html:32)
2026-08-12 07:41:07.793+09:00 | Leave func2 (ReadmeExample.html:33) duration: 00:00:00.002
2026-08-12 07:41:07.793+09:00 Leave func1 (ReadmeExample.html:23) duration: 00:00:00.002
```

### 3. Function List

This library has the following methods. These have no return value.

<table>
  <caption>Function List</caption>
  <tr>
    <th style="text-align:center">Function Name</th>
    <th style="text-align:center">Arguments</th>
    <th style="text-align:center">Return Value</th>
    <th style="text-align:center">Description</th>
  </tr>
  <tr>
    <td><code>enter</code></td>
    <td><i>None</i></td>
    <td><i>None</i></td>
    <td>Outputs function start to log.</td>
  </tr>
  <tr>
    <td><code>leave</code></td>
    <td><i>None</i></td>
    <td><i>None</i></td>
    <td>Outputs function end to log.</td>
  </tr>
  <tr>
    <td><code>printMessage</code></td>
    <td><code>message</code>: The message</td>
    <td>The message</td>
    <td>Outputs the message to log.</td>
  </tr>
  <tr>
    <td><code>print</code></td>
    <td>
      <code>name</code>: The value name<br>
      <code>value</code>: The value<br>
      <code>printOptions</code>: Has the following properties (optional):<br>
      <ul>
        <code>stringLength</code>: if <code>true</code>, outputs the string length<br>
        <code>arrayLength</code>: if <code>true</code>, outputs the array length<br>
        <code>size</code>: if <code>true</code>, outputs the size of <code>Map</code> or <code>Set</code><br>
        <code>collectionLimit</code>: limit on the number of output elements for <code>Map</code> and <code>Set</code><br>
        <code>stringLimit</code>: limit on the number of output characters for <code>strings</code><br>
        <code>reflectionNestLimit</code>: limit on the number of reflection nests
      </ul>
    </td>
    <td>The value</td>
    <td>Outputs to the log in the form of<br><code>name = value</code></td>
  </tr>
</table>

### 4. Properties of *debugtrace-js*

The following properties can be specified for on debugtrace-js.

<table>
  <caption>debugtrace.properties</caption>
  <tr>
    <th style="text-align:center">Property Name</th>
    <th style="text-align:center">Description</th>
  </tr>
  <tr>
    <td><code>formatEnter</code></td>
    <td>The format function of the log output when entering functions<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatEnter = (name, fileName, lineNumber) =>
      `Enter ${name} (${fileName}:${lineNumber})`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: The function name<br>
        <code>fileName</code>:  The file name<br>
        <code>lineNumber</code>: The line number
      </ul>
  </tr>
  <tr>
    <td><code>formatLeave</code></td>
    <td>The format function of the log output when leaving functions<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatLeave = (name, fileName, lineNumber, duration) =>
      `Leave ${name} (${fileName}:${lineNumber}) duration: ${duration}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: the function name<br>
        <code>fileName</code>: the file name<br>
        <code>lineNumber</code>: the line number<br>
        <code>duration</code>: the duration since invoking the corresponding `enter` function
      </ul>
  </tr>
  <tr>
    <td><code>indentString</code></td>
    <td>The indentation string for code<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.indentString = '| '</code>
      <br>
  </tr>
  <tr>
    <td><code>dataIndentString</code></td>
    <td>The indentation string for data<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.dataIndentString = '  '</code>
    <br>
  </tr>
  <tr>
    <td><code>limitString</code></td>
    <td>The string to represent that it has exceeded the limit<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.limitString = '...'</code>
      <br>
  </tr>
  <tr>
    <td><code>cyclicReferenceString</code></td>
    <td>The string to represent that the cyclic reference occurs<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.cyclicReferenceString = '*** cyclic reference ***'</code>
      <br>
  </tr>
  <tr>
    <td><code>varNameValueSeparator</code></td>
    <td>The separator string between the variable name and value<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.varNameValueSeparator = ' = '</code>
      <br>
  </tr>
  <tr>
    <td><code>keyValueSeparator</code></td>
    <td>The separator string between the key and value of Map object<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.keyValueSeparator = ': '</code>
    <br>
  </tr>
  <tr>
    <td><code>formatPrintSuffix</code></td>
    <td>
      The format function for string added by the `print` function<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatPrintSuffix = (name, fileName, lineNumber) =>
      `(${fileName}:${lineNumber})`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>name</code>: the function name [.small]#_(Not used by default)_#<br>
        <code>fileName</code>: the file name<br>
        <code>lineNumber</code>: the line number
      </ul>
  </tr>
  <tr>
    <td><code>formatLength</code></td>
    <td>The format function for array and string length<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatLength = length => `length:${length}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>length</code>: number of elements or string length
      </ul>
  </tr>
  <tr>
    <td><code>formatSize</code></td>
    <td>The format function for `Map` and `Set
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatSize = size => `size:${size}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>size</code>: number of elements
      <ul>
  </tr>
  <tr>
    <td><code>formatDate</code></td>
    <td>The format function for `Date
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatDate = date => {
      let timezoneOffset = date.getTimezoneOffset()
      const offsetSign = timezoneOffset < 0 ? '+' : '-'
      if (timezoneOffset < 0)
        timezoneOffset = -timezoneOffset
      const str =date.getFullYear() + '-' +
      ('0'+ (date.getMonth() + 1 )).slice(-2) + '-' +
      ('0'+date.getDate ()).slice(-2) + ' ' +
      ('0'+date.getHours()).slice(-2) + ':' +
      ('0'+date.getMinutes()).slice(-2) + ':' +
      ('0'+date.getSeconds()).slice(-2) + '.' +
      ('00' +date.getMilliseconds() ).slice(-3) + offsetSign +
      ('0'+Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
      ('0'+timezoneOffset % 60).slice(-2)
      return str
    }</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a <code>Date</code>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatTime</code></td>
    <td>The format function for `duration` of `formatLeave
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.formatTime = date =>
      `('0'  +  date.getUTCHours  ()     ).slice(-2) + ':' +
      `('0'  +  date.getUTCMinutes()     ).slice(-2) + ':' +
      `('0'  +  date.getUTCSeconds()     ).slice(-2) + '.' +
      `('00' +  date.getUTCMilliseconds()).slice(-3)</code>
      <br>
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a duration
      </ul>
  </tr>
  <tr>
    <td><code>formatLogDate</code></td>
    <td>
      The format function for the log date and time<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      [.small]#_See_# `formatDate
      <span style="font-size:small;font-weight:bold">Parameters:</span>
      <ul>
        <code>date</code>: a log <code>Date</code>
      </ul>
  </tr>
  <tr>
    <td><code>maximumDataOutputWidth</code></td>
    <td>
      The minimum value to output the length of string<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.maximumDataOutputWidth = 70</code>
    </td>
  </tr>
  <tr>
    <td><code>collectionLimit</code></td>
    <td>
      The limit value of elements for array, `Map` and `Set` to output<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.collectionLimit = 128</code>
  </tr>
  <tr>
    <td><code>stringLimit</code></td>
    <td>The limit value of characters for string to output<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.stringLimit = 256</code>
  </tr>
  <tr>
    <td><code>reflectionNestLimit</code></td>
    <td>The limit value for reflection nesting<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.reflectionNestLimit = 4</code>
  </tr>
  <tr>
    <td><code>basicPrint</code></td>
    <td>
      The basic print function<br>
      <span style="font-size:small;font-weight:bold">Example (Initial setting):</span>
      <code>
    debugtrace.basicPrint = console.log</code>
      <br>
      <span style="font-size:small;font-weight:bold">Example (Output to stderr):</span>
      <code>
    debugtrace.basicPrint = console.error</code>
  </tr>
</table>

### 5. CHANGELOG

[CHANGELOG](CHANGELOG.md)

### 6. License

[MIT ライセンス(MIT)](LICENSE.txt)

*&copy; 2015 Masato Kokubo*
