### debugtrace-js 3.0.0 - Aug 12, 2026

* Made it compatible with Bun, Deno, and browsers such as Chrome, Edge, Firefox, and Safari.
* Added a type definition file (`debugtrace.d.ts`) for TypeScript.

### debugtrace-js 2.2.0 - Feb 16, 2025

* The following properties have been deleted.

  * `debugtrace.minimumOutputLengthAndSize`
  * `debugtrace.minimumOutputStringLength`
* The default values of the following properties have been changed.

  |Property name                |Default value|Old default value|
  |:----------------------------|------------:|----------------:|
  |`debugtrace.collectionLimit` |          128|              512|
  |`debugtrace.stringLimit`     |          256|             8192|
* The `printOptions` argument (optional) has been added to the `print` function.

### debugtrace-js 2.1.2 - Mar 13, 2022

* The `print` and `printMessage` functions now return the argument value.

### debugtrace-js 2.1.1 - Oct 9, 2021

* Fixed a bug that an exception is thrown when outputting a type name.
* Changed to output Node.js version at startup.

### debugtrace-js 2.1.0 - Aug 9, 2021

* Improved function output (output only the first line of the function definition)
* Added the `basicPrint` function
* Improved the line break handling of data output

### debugtrace-js 2.0.0 - Aug 2, 2020

* Supported Node.js 10 or later
* Improved the line break handling of data output

### debugtrace-js 1.1.0 - Nov 23, 2016

* First release registered for npm.

### debugtrace-js 1.0.1 - Jul 12, 2016

* Change the default value of `enterString` and `leaveString`.

### debugtrace-js 1.0.0 - Jul 10, 2016

* The first release.
