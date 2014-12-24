'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    // get packge info
    pkg: grunt.file.readJSON('package.json'),

    // app
    app: 'src/app/js/app.js',

    // get all states / modules
    states: grunt.file.expand(
      'src/app/states/**/*.js',
      '!src/app/states/**/*.pageobject.js',
      '!src/app/states/**/*.scenario.js',
      '!src/app/states/**/*.spec.js'
    ).join(' '),

    // get all components
    components: grunt.file.expand(
      'src/app/components/**/*.js',
      '!src/app/components/**/*.spec.js'
    ).join(' '),
    
    htmlmin : {
        export: {
            options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: false
            },
            files: [{                                  // Dictionary of files
                expand: true,
                cwd: 'src/app/',                             // Project root
                src: '**/*.html',                        // Source
                dest: 'www/'                            // Destination
            }]
        }
    },
    
    // run shell scripts
    shell: {

      // create app.min.js
      compile: {
        command: 'java -jar src/closure/compiler.jar ' +
          '--compilation_level ADVANCED_OPTIMIZATIONS ' +
          // '--formatting PRETTY_PRINT ' +
          '--language_in ECMASCRIPT5_STRICT ' +
          '--angular_pass ' +                                // inject dependencies automatically
          '--externs src/closure/externs/angular.js ' +          // angular.d -> angular.module
          '--generate_exports ' +                            // keep @export notated code
          '--manage_closure_dependencies ' +
          '--js src/closure/library/base.js ' +                  // don't add 'goog.' stuff to script
          '--js <%= app %> ' +
          '--js <%= states %> ' +
          '--js <%= components %> ' +
          '--js_output_file www/js/app.min.js'
      },
      
      /*
      // karma
      karma: {
        command: './node_modules/karma/bin/karma start test/unit/karma.conf.js'
      },

      // protractor
      protractor: {
        command: './node_modules/protractor/bin/protractor test/e2e/protractor.conf.js'
      }
      */
    },
    
    // CSS
    cssmin: {
        vendor:{

            options: {
                banner: '/* Vendor -- minimified */'
            },
            files: {
                'www/css/vendor.min.css': [
                    'src/app/css/vendor/twitter/bootstrap.min.css',
                    'src/app/css/vendor/fontawesome/font-awesome.min.css',
                    'src/app/css/vendor/3xw/fonts-path-fix.css',
                    'src/app/css/vendor/3xw/cake.css',
                    'src/app/css/vendor/3xw/helpers.css'
                ]
            }
        }
    },

    // JS
    uglify: {

        vendor: {
            options: {
                banner: '/* Vendor -- minimified */',
                beautify: false,
                mangle: false
            },
            files: {
                'www/js/vendor.min.js': [
                    'src/app/js/vendor/angularjs/angular.min.js',
                    'src/app/js/vendor/angularjs/angular-mocks.js',
                    'src/app/js/vendor/angularjs/angular-ui-router.js',
                    
                ]
            }
        }
    },

    // WATCH AND RUN TASKS
    /*watch: {
        scripts: {
            files: [
            'webroot/js/*',
            ],
            tasks: ['uglify:app'],
            options: {
                nospawn: true
            }
        },
        css: {
            files: [
            'webroot/css/*.css',
            ],
            tasks: ['cssmin:app']
        }
    }*/
    

  });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    grunt.registerTask('default', ['shell:compile','htmlmin:export']);
    grunt.registerTask('vendor', ['cssmin:vendor','uglify:vendor']);
    grunt.registerTask('protractor', ['shell:protractor']);
    grunt.registerTask('karma', ['shell:karma']);

};
