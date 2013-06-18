/**
 * Castor - a cross site POSTing JavaScript logging library for Loggly
 * 
 * Copyright (c) 2011 Loggly, Inc.
 * All rights reserved.
 *
 * Author: Mike Blume <mike@loggly.com>
 * Date: April 14, 2012
 * 
 * Sample usage (replace with your own Loggly HTTP input URL):

  <script src="/js/loggly.js" type="text/javascript"></script>
  <script type="text/javascript">
    window.onload=function(){
      // use http or https depending on your page context
      castor = new loggly.castor({ url: 'http://logs.loggly.com/inputs/a4e839e9-4227-49aa-9d28-e18e5ba5a818', level: 'WARN'});
      castor.log({url: window.location.href});
    }
  </script>

 */  

(function() {

  var log_methods = {'error': 5, 'warn': 4, 'info': 3, 'debug': 2, 'log': 1};

  var send_data = function(opts) {
    var img = document.createElement("img");
    img.src = opts.url + ".gif?PLAINTEXT=" + encodeURIComponent(opts.data) + "&DT=" + encodeURIComponent(Date());
  }

  var castor = function(opts) {
    if (!opts.url) throw new Error("Please include a Loggly HTTP URL.");
    if (!opts.level) {
      this.level = log_methods['info'];
    } else {
      this.level = log_methods[opts.level.toLowerCase()];
    }
    var logger_factory = function(level_name) {
      return function(data) {
        if (log_methods[level_name] >= this.level) {
          if (typeof(data) != "string") {
            try {
              data = JSON.stringify(data);
            }
            catch (error) {}
          }
          opts.data = data;
          send_data(opts);
        }
      };
    };
    for (name in log_methods) {
      this[name] = logger_factory(name);
    }
  };

  if (this.loggly) {
    this.loggly.castor = castor;
  } else {
    this.loggly = {castor: castor};
  }
})();


(function() {
  var Log;

  Log = function(options) {
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
            stacktrace: printStackTrace(),
            msg: txt
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
