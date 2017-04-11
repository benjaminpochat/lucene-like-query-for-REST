module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			src : 'src/**/*.js',
			options:{
				specs : 'spec/**/*Spec.js'
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js'],
			options:{
				esversion: 6
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/*.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		}
	});

	// Load the plugin that provides the "jasmine" task.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load the plugin jshint for code quality check
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	//grunt.registerTask('default', 'jasmine', 'uglify');
	grunt.registerTask('default', ['jasmine', 'jshint']);

};