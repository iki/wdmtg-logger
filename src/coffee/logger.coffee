
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




