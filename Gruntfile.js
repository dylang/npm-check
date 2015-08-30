'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        mochaTest: {
            notify: {
                src: 'test/**/*.test.js',
                options: {
                    reporter: 'spec'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', [
        'mochaTest'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);
};
