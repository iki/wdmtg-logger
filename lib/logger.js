(function() {
  var Log;

  if (!(window.console && console.log)) {
    (function() {
      var console, length, methods, noop, _results;
      noop = function() {};
      methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "markTimeline", "table", "time", "timeEnd", "timeStamp", "trace", "warn"];
      length = methods.length;
      console = window.console = {};
      _results = [];
      while (length--) {
        _results.push(console[methods[length]] = noop);
      }
      return _results;
    })();
  }

  Log = function(options) {
    var begin, consoleLog, logLevel, prefix, _ref, _ref1, _ref2, _ref3;
    if (options == null) {
      options = {};
    }
    prefix = (_ref = options.prefix) != null ? _ref : '';
    logLevel = (_ref1 = options.logLevel) != null ? _ref1 : 0;
    begin = (_ref2 = options.begin) != null ? _ref2 : +new Date();
    consoleLog = function(txt, level) {
      if (level == null) {
        level = 1;
      }
      if (level <= logLevel) {
        return console.log("[" + (((+new Date()) - begin) / 1000) + "] " + txt);
      }
    };
    if (((_ref3 = options.loggly) != null ? _ref3.key : void 0) != null) {
      window.onload = function() {
        var castor, host, _ref4;
        host = "https:" === document.location.protocol ? "https://logs.loggly.com" : "http://logs.loggly.com";
        castor = new loggly.castor({
          url: host + '/inputs/' + options.loggly.key,
          level: (_ref4 = options.loggly.level) != null ? _ref4 : 'log'
        });
        return consoleLog = function(txt, level) {
          var since;
          if (level == null) {
            level = 1;
          }
          since = ((+new Date()) - begin) / 1000;
          if (level <= logLevel) {
            console.log("[" + since + "] " + txt);
            return castor.log({
              url: window.location.href,
              since: since,
              username: USER.username,
              id: USER.id,
              lebel: level,
              msg: txt
            });
          }
        };
      };
    }
    return {
      inspect: function(obj) {
        if (logLevel >= 3) {
          return typeof console !== "undefined" && console !== null ? typeof console.dir === "function" ? console.dir(obj) : void 0 : void 0;
        }
      },
      devel: function(txt) {
        return consoleLog("DEVEL " + prefix + txt, 4);
      },
      debug: function(txt) {
        return consoleLog("DEBUG " + prefix + txt, 3);
      },
      info: function(txt) {
        return consoleLog("INFO  " + prefix + txt, 2);
      },
      error: function(txt) {
        return consoleLog("ERROR " + prefix + txt, 1);
      },
      wrap: Log
    };
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this).Log = Log;

}).call(this);
