module.exports = ->

  @initConfig

    pkg: @file.readJSON 'package.json'

    coffee: 
      build: 
        files: 'lib/logger.js': 'src/coffee/logger.coffee'
    
    uglify:
      options: mangle: no
      vendor: 
        files: 'lib/logger.min.js': [
          'components/loggly/js/loggly.js'
          'lib/logger.js'
        ]

    watch:
      coffee:
        files: [ 'src/**/*.coffee' ]
        tasks: [ 'coffee' ]
        options: debounceDelay: 250

  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-watch'

  @registerTask 'default', [
    'coffee'
    'uglify'
  ]
