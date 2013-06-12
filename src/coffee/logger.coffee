# "micro logger that works" (tm)
Log = (options={}) ->
  prefix   = options.prefix ? ''
  logLevel = options.logLevel ? 0
  begin    = options.begin ? +new Date()
  consoleLog = (txt, level=1) ->
  if console?.log?
    consoleLog = (txt, level=1) -> console.log("[#{((+new Date()) - begin) / 1000}] #{txt}") if level <= logLevel

  # TODO support Logly

  inspect: (obj) -> console?.dir?(obj) if logLevel >= 3
  devel  : (txt) -> consoleLog "DEVEL #{prefix}#{txt}", 4 
  debug  : (txt) -> consoleLog "DEBUG #{prefix}#{txt}", 3 
  info   : (txt) -> consoleLog "INFO  #{prefix}#{txt}", 2 
  error  : (txt) -> consoleLog "ERROR #{prefix}#{txt}", 1
  wrap   : Log
  
(exports ? @).Log = Log
