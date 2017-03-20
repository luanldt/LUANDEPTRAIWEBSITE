module.exports = function(grunt) {


    grunt.initConfig({
        cssmin: {
            target: {
                files: {
                    'public/Admin/css/main.min.css': ['public/Admin/css/*.css', 'public/Admin/css/!*.min.css'],
                }
            }
        },
        watch: {
            css: {
                files: ['**/**/**/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false,
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['cssmin', 'watch']);


};