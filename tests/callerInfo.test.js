const debugtrace = require('../debugtrace')

test('skips frames from the minified browser build', () => {
  const OriginalError = global.Error
  global.Error = class extends OriginalError {
    constructor() {
      super()
      this.stack = [
        'Error',
        '    at h (https://cdn.jsdelivr.net/npm/debugtrace-js@3.0.0/debugtrace.min.js:12:123)',
        '    at func1 (http://localhost:8000/ReadmeExample.html:27:9)'
      ].join('\n')
    }
  }

  try {
    debugtrace.enter()
    expect(debugtrace.lastLog).toContain('Enter func1 (ReadmeExample.html:27)')
  } finally {
    global.Error = OriginalError
    debugtrace.leave()
  }
})
