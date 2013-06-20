```
     __                               
    |  |.-----.-----.-----.-----.----.
    |  ||  _  |  _  |  _  |  -__|   _|
    |__||_____|___  |___  |_____|__|  
              |_____|_____|             
                             MFG Labs
```

## Usage

### To override the whole console

```Javascript
window.console = Logger({
  console: {
    level: 6 // messages with levels <= this value will be printed in the console
  }
})
```

### To use loggly

```Javascript
window.console = Logger({
  console: {
    level: 6
  },
  loggly: {
    // api key of your Loggly project
    api_key: 'INSERT_YOUR_API_KEY',

     // messages with levels <= this value will be reported to Loggly
    level: 1,

    // customize the JSON object (you can also delete unused fields to save bandwith)
    format: function (obj) {
      // obj.url
      // obj.system
      // obj.browser
      // obj.msg
      obj.id       = USER.id
      obj.username = USER.username
    }
  }
})
```

