(function(){

  this.Logger = function (options) {

    var that = this;

    // DEFAULTS SETTINGS
    that.print_level = 0
    that.enable_dir = false
    that.loggly_enabled = false
    that.loggly_api_key = ''
    that.loggly_level = 0
    that.loggly_format = function () {}

    // OVERLOAD SETTINGS

    if (options.loggly) {
      if (options.that.loggly_api_key = options.loggly.api_key
      if (that.loggly_api_key.length > 0) {
        that.enable_loggly = true
      }
      if (options.)
    }


   var log = function(level, txt) {

    // LOGGLY
    if (options.loggly) {
      if (options.loggly.api_key.length > 0) {
        val packet = {
          url     : window.location.href,
          msg     : txt,
          system  : BrowserDetect.OS,
          browser : {
            name   : BrowserDetect.browser,
            version: BrowserDetect.version
          }
        }

        options.loggly.format(packet)

        castor.log(packet)

      }
    }




   return {
     error: function(){
    
     }
   }
*/

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

  console.log = function(msg) {
    _log(4, "DEVEL " + prefix + txt, 4);
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
  }
  console.debug  = function(msg) {
    
  }
  console.info = function(msg) {
    
  }
  console.warn  = function(msg) {
    
  }
  console.error = function(msg) {
    
  }

};

installLogger({
  console: true, // replace the console
  level: 5,
  loggly: {
    level: 1,
    api_key: ''
  }
});

  var Log;
  Log = function(options) {
    var defaults = {
      prefix: '', // log prefix
      logLevel: '', // log level for logging
      logglyLevel: '', // log level for sending to loggly
    };

    var begin, castor, consoleLog, host, logLevel, prefix, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    console.log("Log");
    prefix = (_ref = options.prefix) != null ? _ref : '';
    logLevel = (_ref1 = options.level) != null ? _ref1 : 0;
    begin = (_ref2 = options.begin) != null ? _ref2 : +new Date();
    consoleLog = function(txt, level) {
      if (level == null) {
        level = 1;
      }
      if (level <= logLevel) {
        return console.log("[" + (((+new Date()) - begin) / 1000) + "] " + txt);
      }
    };
    console.log("options.key: " + options.key);
    if (options.key) {
      host = "https:" === document.location.protocol ? "https://logs.loggly.com" : "http://logs.loggly.com";
      castor = new loggly.castor({
        url: "" + host + "/inputs/" + options.key,
        level: 'log'
      });
      consoleLog = function(txt, level) {
        var since;
        if (level == null) {
          level = 1;
        }
        since = ((+new Date()) - begin) / 1000;
        if (level <= logLevel) {
          console.log("[" + since + "] " + txt);
        }
        if (level <= 1) {
          return castor.log({
            url: window.location.href,
            username: USER.username,
            id: USER.id,
            msg: txt,
            browser: {
              name: BrowserDetect.browser,
              version: BrowserDetect.version
            },
            system: BrowserDetect.OS
          });
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
