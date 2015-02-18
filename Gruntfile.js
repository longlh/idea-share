'use strict';
var koutoSwiss = require('kouto-swiss');
var path = require('path');

var assetDef = 'build/assets.json';
var replacePatterns;

module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			tmp: [
				'build/.tmp/**',
				'client/assets/stylus/_define.styl'
			],
			build: [
				'build/public',
				'build/rev.json'
			]
		},
		csslint: {
			options: {
				csslintrc: 'build/rules/.csslintrc',
				absoluteFilePathsForFormatters: false,
				formatters: [{
					id: 'lint-xml',
					dest: 'build/reports/csslint.xml'
				}]
			},
			src: [
				'build/.tmp/css/**/*.css'
			]
		},
		jshint: {
			client: {
				src: [
					'client/app/**/*.js',
					'client/assets/js/**/*.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-client',
					reporter: 'jslint',
					reporterOutput: 'build/reports/jshint-client.xml'
				}
			},
			server: {
				src: [
					'server/**/*.js',
					'env/**/*.js',
					'app.js',
					'Gruntfile.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-server',
					reporter: 'jslint',
					reporterOutput: 'build/reports/jshint-server.xml'
				}
			}
		},
		jscs: {
			all: {
				src: [
					'<%= jshint.client.src %>',
					'<%= jshint.server.src %>'
				],
				options: {
					config: 'build/rules/.jscsrc',
					reporter: 'junit',
					reporterOutput: 'build/reports/jscs.xml'
				}
			}
		},
		express: {
			dev: {
				options: {
					script: 'app.js',
					debug: true,
					'node_env': 'development'
				}
			}
		},
		stylus: {
			options: {
				use: [
					koutoSwiss
				]
			},
			compile: {
				files: [{
					src: [
						'**/*.styl',
						'!_*.styl'
					],
					expand: true,
					cwd: 'client/assets/stylus',
					ext: '.css',
					dest: 'build/.tmp/css'
				}]
			}
		},
		cssmin: {
			min: {
				files: require('./' + assetDef).css
			}
		},
		uglify: {
			min: {
				options: {
					sourceMap: false
				},
				files: require('./' + assetDef).js
			}
		},
		replace: {
			stylus: {
				options: {
					patterns: [{
						json: function(done) {

							if (!replacePatterns) {
								var imgrev = grunt.filerev.summary;
								var keys = Object.keys(imgrev);
								var i = 0;
								var key;

								replacePatterns = {};

								for (i = 0; i < keys.length; i++) {
									key = keys[i];
									replacePatterns[path.basename(key)] = path.basename(imgrev[key]);
								}
							}

							done(replacePatterns);
						}
					}]
				},
				files: {
					'client/assets/stylus/_define.styl' : 'client/assets/stylus/_.styl'
				}
			}
		},
		filerev: {
			img: {
				files: [{
					expand: true,
					cwd: 'client/assets/img/',
					src: [
						'**/*'
					],
					dest: 'build/public/img/'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: 'build/.tmp/jsmin',
					src: [
						'**/*'
					],
					dest: 'build/public/js/'
				}]
			},
			css: {
				files: [{
					expand: true,
					cwd: 'build/.tmp/cssmin',
					src: [
						'**/*'
					],
					dest: 'build/public/css/'
				}]
			}
		},
		'filerev_assets': {
			rev: {
				options: {
					dest: 'build/rev.json',
					cwd: 'build/public'
				}
			}
		},
		ngtemplates: {
			options: {
				standalone: true,
				prefix: '/',
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true, // Only if you don't use comment directives!
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}
			},
			'idea-share': {
				cwd: 'client/app/idea-share',
				src: '**/*.html',
				dest: 'build/.tmp/views/idea-share/ng-templates.js',
				options: {
					module: 'app.template',
				}
			}
		},
		watch: {
			options: {
				maxListeners: 99,
				spawn: false,
				interrupt: true,
				debounceDelay: 2000,
				interval: 500
			},
			client: {
				files: [
					assetDef,
					'<%= jshint.client.src %>',
					'client/assets/img/**',
					'client/assets/stylus/**/*.styl',
					'client/app/**/*.html',
					'!client/assets/stylus/_define.styl',
					'!build/**'
				],
				tasks: [
					'jshint:client',
					'build',
					'express:dev'
				]
			},
			server: {
				files: [
					'<%= jshint.server.src %>'
				],
				tasks: [
					'jshint:server',
					'express:dev'
				]
			},
			ect: {
				files: [
					'server/views/**/*.ect'
				],
				tasks: [
					'express:dev'
				]
			}
		}
	});
	// load all plugins
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [
		'jscs',
		'jshint'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'filerev:img',
		'replace', 'stylus', 'cssmin',
		'ngtemplates', 'uglify',
		'filerev:css', 'filerev:js', 'filerev_assets',
		'clean:tmp'
	]);

	grunt.registerTask('default', [
		'verify',
		'build',
		'express:dev',
		'watch'
	]);
};
