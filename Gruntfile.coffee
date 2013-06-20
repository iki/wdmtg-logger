module.exports = ->

  @initConfig

    pkg: @file.readJSON 'package.json'
    
    concat:
      build:
        stripBanners: no
        src: [
          'components/browser-detect/browser-detect.js'
          'components/loggly-castor/js/loggly.js'
          'src/logger.js'
        ]
        dest: 'lib/logger.js'

    uglify:
      options: mangle: no
      vendor: files: 'lib/logger.min.js': [ 'lib/logger.js' ]

    watch:
      coffee:
        files: [ 'src/**/*.coffee' ]
        tasks: [ 'coffee' ]
        options: debounceDelay: 250

  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-concat'

  @registerTask 'default', [ 'concat', 'uglify' ]
