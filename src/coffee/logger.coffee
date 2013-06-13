# Avoid `console` errors in browsers that lack a console.
#unless window.console and console.log
#  do ->
#    noop = ->
#
#    methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "markTimeline", "table", "time", "timeEnd", "timeStamp", "trace", "warn"]
#    length = methods.length
#    console = window.console = {}
#    console[methods[length]] = noop  while length--

# "micro logger that works" (tm)
Log = (options={}) ->
  console.log "Log"
  prefix   = options.prefix ? ''
  logLevel = options.level ? 0
  begin    = options.begin ? +new Date()

  consoleLog = (txt, level=1) -> console.log("[#{((+new Date()) - begin) / 1000}] #{txt}") if level <= logLevel

  console.log "options.key: #{options.key}"
  if options.key

    host = if "https:" is document.location.protocol then "https://logs.loggly.com" else "http://logs.loggly.com"

    castor = new loggly.castor 
      url: "#{host}/inputs/#{options.key}"
      level: 'log'

    consoleLog = (txt, level=1) -> 
      since = ((+new Date()) - begin) / 1000
      if level <= logLevel
        console.log "[#{since}] #{txt}"
      if level <= 1
        castor.log
          url     : window.location.href
          #since   : since
          username: USER.username
          id      : USER.id
          #level   : level
          msg     : txt

  inspect: (obj) -> console?.dir?(obj) if logLevel >= 3
  devel  : (txt) -> consoleLog "DEVEL #{prefix}#{txt}", 4 
  debug  : (txt) -> consoleLog "DEBUG #{prefix}#{txt}", 3 
  info   : (txt) -> consoleLog "INFO  #{prefix}#{txt}", 2 
  error  : (txt) -> consoleLog "ERROR #{prefix}#{txt}", 1
  wrap   : Log
  
(exports ? @).Log = Log
