module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      coffee: {
        files: ['grammar/cs/*.coffee'],
        tasks: 'coffee'
      }
    },
    coffee: {
      compile: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'grammar/cs',
          src: ['{,*/}*.coffee'],
          dest: 'grammar/js',
          ext: '.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};