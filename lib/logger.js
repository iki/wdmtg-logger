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
  var BrowserDetect, Logger;

  BrowserDetect = {
    init: function() {
      this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
      return this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
      var dataProp, dataString, i;
      i = 0;
      while (i < data.length) {
        dataString = data[i].string;
        dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) !== -1) {
            return data[i].identity;
          }
        } else {
          if (dataProp) {
            return data[i].identity;
          }
        }
        i++;
      }
    },
    searchVersion: function(dataString) {
      var index;
      index = dataString.indexOf(this.versionSearchString);
      if (index === -1) {
        return;
      }
      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
      }, {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      }, {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
      }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
      }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
      }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
      }, {
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
      }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      }, {
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }
    ],
    dataOS: [
      {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
      }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
      }, {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
      }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
      }
    ]
  };

  BrowserDetect.init();

  Logger = (function() {
    function Logger(options) {
      var castor, _original, _ref, _ref1, _ref2, _ref3,
        _this = this;
      if (options == null) {
        options = {};
      }
      this.logLevel = (_ref = options.level) != null ? _ref : 0;
      this.begin = (_ref1 = options.begin) != null ? _ref1 : +new Date();
      this.format = (_ref2 = options.format) != null ? _ref2 : function() {};
      this._console = window.console != null ? window.console : window.console = {
        log: function() {},
        dir: function() {}
      };
      this._log = function(level, txt) {
        if (!(level <= _this.logLevel)) {
          return;
        }
        return _this._console.log("[" + _this._ts() + "] " + txt);
      };
      if (options.key) {
        castor = new loggly.castor({
          url: "" + ((_ref3 = document.location.protocol) != null ? _ref3 : 'http:') + "//logs.loggly.com/inputs/" + options.key,
          level: 'log'
        }, _original = this._log, this._log = function(level, txt) {
          var kv;
          if (level <= _this.logLevel) {
            _original(level, txt);
          }
          if (level <= 1) {
            kv = {
              url: window.location.href,
              msg: txt,
              browser: {
                name: BrowserDetect.browser,
                version: BrowserDetect.version
              },
              system: BrowserDetect.OS
            };
            _this.format(kv);
            return castor.log(kv);
          }
        });
      }
    }

    Logger.prototype._ts = function() {
      return "" + (((+new Date()) - this.begin) / 1000);
    };

    Logger.prototype.dir = function(obj) {
      if (this.logLevel >= 3) {
        return this._console.dir(obj);
      }
    };

    Logger.prototype.inspect = function(obj) {
      return this.dir;
    };

    Logger.prototype.devel = function(txt) {
      return this._log(4, "DEVEL " + txt);
    };

    Logger.prototype.debug = function(txt) {
      return this._log(3, "DEBUG " + txt);
    };

    Logger.prototype.info = function(txt) {
      return this._log(2, "INFO  " + txt);
    };

    Logger.prototype.error = function(txt) {
      return this._log(1, "ERROR " + txt);
    };

    Logger.prototype.log = function(txt) {
      return this._log(3, "LOG   " + txt);
    };

    return Logger;

  })();

}).call(this);
