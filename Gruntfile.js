module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'src/server.js',
                options: {
                    env: {
                        PORT: 8080
                    }
                }
            }
        },
        watch: {
            sass: {
                files: 'src/scripts/css/*.scss',
                tasks: ['sass']
            },
            jshint: {
                files: ['Gruntfile.js', 'src/*.js', 'src/scripts/views/*.js',
                    'src/scripts/data/*.js'
                ],
                tasks: ['jshint']
            }

        },

        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'src/scripts/views/*.js',
                'src/scripts/data/*.js'
            ],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['jshint', 'nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }, // concurrent
        sass: {
            dev: {
                files: {
                    'src/scripts/css/main.css': 'src/scripts/css/main.scss',
                    'src/scripts/css/ribbon.css': 'src/scripts/css/ribbon.scss'
                }
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('default', ['concurrent:dev']);
};
