(function() {
  var Log;

  Log = function(options) {
    var begin, consoleLog, logLevel, prefix, _ref, _ref1, _ref2;
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
    };
    if ((typeof console !== "undefined" && console !== null ? console.log : void 0) != null) {
      consoleLog = function(txt, level) {
        if (level == null) {
          level = 1;
        }
        if (level <= logLevel) {
          return console.log("[" + (((+new Date()) - begin) / 1000) + "] " + txt);
        }
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
