module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			src : 'src/**/*.js',
			options:{
				specs : 'spec/**/*Spec.js',
				vendor : ['https://code.jquery.com/jquery-3.2.1.min.js', 'https://code.jquery.com/ui/1.12.0/jquery-ui.min.js']
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
				sourceMap: true
			},
			build: {
				src: 'src/*.js',
				dest: 'dist/<%= pkg.name %>.min.js'
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
	grunt.registerTask('default', ['jasmine', 'jshint', 'uglify']);

};