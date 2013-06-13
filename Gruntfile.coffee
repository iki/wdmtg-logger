module.exports = ->

  @initConfig

    pkg: @file.readJSON 'package.json'

    coffee: 
      build: 
        files: 'lib/logger.js': 'src/coffee/logger.coffee'
    
    concat:
      build:
        stripBanners: no
        src: [
          'components/loggly-castor/js/loggly.js'
          'lib/logger.js'

        ]
        dest: 'lib/logger.js'

    uglify:
      options: mangle: no
      vendor: 
        files: 'lib/logger.min.js': [
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
  @loadNpmTasks 'grunt-contrib-concat'

  @registerTask 'default', [
    'coffee'
    'concat'
    'uglify'
  ]
