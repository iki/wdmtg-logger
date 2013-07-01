
# default native logger
window.console ?=
  log: ->
  dir: ->
  assert: ->
  clear: ->
  count: ->
  debug: ->
  dir: ->
  dirxml: ->
  error: ->
  exception: ->
  group: ->
  groupCollapsed: ->
  groupEnd: ->
  info: ->
  log: ->
  markTimeline: ->
  profile: ->
  profileEnd: ->
  table: ->
  time: ->
  timeEnd: ->
  timeStamp: ->
  trace: ->
  warn: ->

# "micro logger that works" (tm)
class Logger
  constructor: (options={}) ->

    @logLevel = options.level ? 0
    @begin    = options.begin ? +new Date()
    @format   = options.format ? ->

    @_console = window.console
    for k,v of @_console
      @[k] = v

    @_log = (level, txt) => 
      return unless level <= @logLevel
      @_console.log "[" + @_ts() + "] " + txt

    if options.key
      castor = new loggly.castor 
        url: "#{document.location.protocol ? 'http:'}//logs.loggly.com/inputs/#{options.key}"
        level: 'log'
        _original = @_log
        # rewrite @_log with loggly logging
        @_log = (level, txt) => 
          if level <= @logLevel
            _original level, txt
          if level <= 1
            kv =
              url    : window.location.href
              msg    : txt
              browser: name: BrowserDetect.browser, version: BrowserDetect.version
              system: BrowserDetect.OS
            @format kv
            castor.log kv


  _ts: -> "#{((+new Date()) - @begin) / 1000}"

  dir: (obj) -> @_console.dir(obj) if @logLevel >= 3
  inspect: (obj) -> @dir
  devel  : (txt) -> @_log 4, "DEVEL " + txt
  debug  : (txt) -> @_log 3, "DEBUG " + txt
  info   : (txt) -> @_log 2, "INFO  " + txt
  warn   : (txt) -> @_log 1, "WARN  " + txt
  error  : (txt) -> @_log 1, "ERROR " + txt
  log    : (txt) -> @_log 3, "LOG   " + txt




