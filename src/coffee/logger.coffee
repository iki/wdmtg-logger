# Avoid `console` errors in browsers that lack a console.
#unless window.console and console.log
#  do ->
#    noop = ->
#
#    methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "markTimeline", "table", "time", "timeEnd", "timeStamp", "trace", "warn"]
#    length = methods.length
#    console = window.console = {}
#    console[methods[length]] = noop  while length--

BrowserDetect =
  init: ->
    @browser = @searchString(@dataBrowser) or "An unknown browser"
    @version = @searchVersion(navigator.userAgent) or @searchVersion(navigator.appVersion) or "an unknown version"
    @OS = @searchString(@dataOS) or "an unknown OS"

  searchString: (data) ->
    i = 0

    while i < data.length
      dataString = data[i].string
      dataProp = data[i].prop
      @versionSearchString = data[i].versionSearch or data[i].identity
      if dataString
        return data[i].identity  unless dataString.indexOf(data[i].subString) is -1
      else return data[i].identity  if dataProp
      i++

  searchVersion: (dataString) ->
    index = dataString.indexOf(@versionSearchString)
    return  if index is -1
    parseFloat dataString.substring(index + @versionSearchString.length + 1)

  dataBrowser: [
    string: navigator.userAgent
    subString: "Chrome"
    identity: "Chrome"
  ,
    string: navigator.userAgent
    subString: "OmniWeb"
    versionSearch: "OmniWeb/"
    identity: "OmniWeb"
  ,
    string: navigator.vendor
    subString: "Apple"
    identity: "Safari"
    versionSearch: "Version"
  ,
    prop: window.opera
    identity: "Opera"
    versionSearch: "Version"
  ,
    string: navigator.vendor
    subString: "iCab"
    identity: "iCab"
  ,
    string: navigator.vendor
    subString: "KDE"
    identity: "Konqueror"
  ,
    string: navigator.userAgent
    subString: "Firefox"
    identity: "Firefox"
  ,
    string: navigator.vendor
    subString: "Camino"
    identity: "Camino"
  ,
    # for newer Netscapes (6+)
    string: navigator.userAgent
    subString: "Netscape"
    identity: "Netscape"
  ,
    string: navigator.userAgent
    subString: "MSIE"
    identity: "Explorer"
    versionSearch: "MSIE"
  ,
    string: navigator.userAgent
    subString: "Gecko"
    identity: "Mozilla"
    versionSearch: "rv"
  ,
    # for older Netscapes (4-)
    string: navigator.userAgent
    subString: "Mozilla"
    identity: "Netscape"
    versionSearch: "Mozilla"
  ]
  dataOS: [
    string: navigator.platform
    subString: "Win"
    identity: "Windows"
  ,
    string: navigator.platform
    subString: "Mac"
    identity: "Mac"
  ,
    string: navigator.userAgent
    subString: "iPhone"
    identity: "iPhone/iPod"
  ,
    string: navigator.platform
    subString: "Linux"
    identity: "Linux"
  ]

BrowserDetect.init()

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
          url       : window.location.href
          #since    : since
          username  : USER.username
          id        : USER.id
          #level    : level
          msg       : txt
          browser: name: BrowserDetect.browser, version: BrowserDetect.version
          system: BrowserDetect.OS

  inspect: (obj) -> console?.dir?(obj) if logLevel >= 3
  devel  : (txt) -> consoleLog "DEVEL #{prefix}#{txt}", 4 
  debug  : (txt) -> consoleLog "DEBUG #{prefix}#{txt}", 3 
  info   : (txt) -> consoleLog "INFO  #{prefix}#{txt}", 2 
  error  : (txt) -> consoleLog "ERROR #{prefix}#{txt}", 1
  wrap   : Log
  
(exports ? @).Log = Log
