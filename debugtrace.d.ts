export interface DebugTracePrintOptions {
  stringLength?: boolean
  arrayLength?: boolean
  size?: boolean
  collectionLimit?: number
  stringLimit?: number
  reflectionNestLimit?: number
}

export interface DebugTrace {
  formatEnter: (name: string, fileName: string, lineNumber: string) => string
  formatLeave: (name: string, fileName: string, lineNumber: string, duration: string) => string
  indentString: string
  dataIndentString: string
  limitString: string
  nonOutputString: string
  cyclicReferenceString: string
  varNameValueSeparator: string
  keyValueSeparator: string
  formatPrintSuffix: (name: string, fileName: string, lineNumber: string) => string
  formatLength: (length: number) => string
  formatSize: (size: number) => string
  formatDate: (date: Date) => string
  formatTime: (date: Date) => string
  formatLogDate: (date: Date) => string
  maximumDataOutputWidth: number
  collectionLimit: number
  stringLimit: number
  reflectionNestLimit: number
  basicPrint: (...args: any[]) => void
  enter: () => void
  leave: () => void
  lastLog: string
  printMessage: (message: string) => string
  print: <T>(name: string, value: T, printOptions?: DebugTracePrintOptions) => T
}

declare const debugtrace: DebugTrace
export default debugtrace
export as namespace debugtrace
