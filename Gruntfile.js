'use strict';

module.exports = function (grunt) {

	// Project configuration.
	//noinspection JSUnusedGlobalSymbols
	var localConfig = grunt.file.readJSON('.localGruntConfig.json')
		grunt.initConfig({

			pkg : grunt.file.readJSON('package.json'),

			baseUrl : localConfig.baseUrl,
			roleSandboxUrl : "http://127.0.0.1:8073",

			bowerdir : grunt.file.readJSON('.bowerrc')['directory'],
			distdir : 'html',
			srcdir : 'src',

			clean : ["<%= distdir %>//*"],

			copy : {
				options : {
					processContent : function (content /*, srcpath*/
					) {
						return grunt.template.process(content);
					},
					processContentExclude : ['**/*.{png,gif,jpg}', '**/lodash.js']
				},
				lib : {
					files : [{
							cwd : '<%= bowerdir %>/coweb-jsoe/coweb/jsoe/',
							expand : true,
							src : ['**'],
							dest : '<%= distdir %>/js/lib/vendor/coweb/jsoe/'
						}, {
							cwd : '<%= bowerdir %>/coweb-jsoe/',
							expand : true,
							src : ['org/requirejs/i18n.js'],
							dest : '<%= distdir %>/js/lib/vendor/'
						}, {
							src : '<%= bowerdir %>/iwc/index.js',
							dest : '<%= distdir %>/js/lib/vendor/iwc.js'
						}, {
							src : '<%= bowerdir %>/jquery/jquery.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery.js'
						}, {
							src : '<%= bowerdir %>/jquery-migrate/jquery-migrate.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery-migrate.js'
						}, {
							src : '<%= bowerdir %>/jquery-ui/ui/jquery-ui.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery-ui.js'
						}, {
							src : '<%= bowerdir %>/jquery-ui/themes/base/jquery-ui.css',
							dest : '<%= distdir %>/css/vendor/jquery-ui.css'
						}, {
							cwd : '<%= bowerdir %>/jquery-ui/themes/base',
							expand : true,
							src : ['images/*'],
							dest : '<%= distdir %>/css/vendor/'
						}, {
							src : '<%= bowerdir %>/jsPlumb/dist/js/jquery.jsPlumb-1.5.*.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery.jsPlumb.js'
						}, {
							src : '<%= bowerdir %>/jQuery-contextMenu/src/jquery.contextMenu.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery.contextMenu.js'
						}, {
							src : '<%= bowerdir %>/jQuery-contextMenu/src/jquery.contextMenu.css',
							dest : '<%= distdir %>/css/vendor/jquery.contextMenu.css'
						}, {
							src : '<%= bowerdir %>/jquery-mousewheel/jquery.mousewheel.js',
							dest : '<%= distdir %>/js/lib/vendor/jquery.mousewheel.js'
						}, {
							src : '<%= bowerdir %>/requirejs/require.js',
							dest : '<%= distdir %>/js/lib/vendor/require.js'
						}, {
							src : '<%= bowerdir %>/requirejs-text/text.js',
							dest : '<%= distdir %>/js/lib/vendor/requirejs-text.js'
						}, {
							src : '<%= bowerdir %>/requirejs-promise/requirejs-promise.js',
							dest : '<%= distdir %>/js/lib/vendor/requirejs-promise.js'
						}, {
							src : '<%= bowerdir %>/lodash/dist/lodash.js',
							dest : '<%= distdir %>/js/lib/vendor/lodash.js'
						}, {
							cwd : '<%= bowerdir %>/swfobject/swfobject/',
							expand : true,
							src : ['**'],
							dest : '<%= distdir %>/js/lib/vendor/swfobject'
						}, {
							src : '<%= bowerdir %>/FileToDataURI/index.swf',
							dest : '<%= distdir %>/js/lib/vendor/FileToDataURI.swf'
						}, {
							src : '<%= bowerdir %>/jszip/jszip.js',
							dest : '<%= distdir %>/js/lib/vendor/jszip.js'
						}
					]
				},
				main : {
					files : [{
							cwd : '<%= srcdir %>/',
							expand : true,
							src : ['**', '!widgets/**', '!templates/**'],
							dest : '<%= distdir %>/'
						}
					]
				}
			},

			watch : {
				scripts : {
					files : ['**/*.js'],
					tasks : ['copy:main'],
					options : {
						spawn : false
					}
				},
				widgets : {
					files : ['**/*.xml', '**/*.tpl'],
					tasks : ['buildwidgets'],
					options : {
						spawn : false
					}
				}
			},

			buildwidgets : {
				options : {
					partials : '<%= srcdir %>/widgets/partials'
				},

				main_widget : {
					options : {
						data : {
							meta : {
								title : "Canvas",
								description : "",
								width : "560",
								height : "400"
							},
							bodyPartial : '_main_widget.tpl'
						}
					},
					files : {
						'html/widget.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				palette_widget : {
					options : {
						data : {
							meta : {
								title : "Palette",
								description : "",
								width : "160",
								height : "700"
							},
							bodyPartial : '_palette_widget.tpl'
						}
					},
					files : {
						'html/palette.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				attribute_widget : {
					options : {
						data : {
							meta : {
								title : "Property Browser",
								description : "",
								width : "560",
								height : "200"
							},
							bodyPartial : '_attribute_widget.tpl'
						}
					},
					files : {
						'html/attribute.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				activity_widget : {
					options : {
						data : {
							meta : {
								title : "User Activity",
								description : "",
								width : "120",
								height : "400"
							},
							bodyPartial : '_activity_widget.tpl'
						}
					},
					files : {
						'html/activity.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				json_export_widget : {
					options : {
						data : {
							meta : {
								title : "Export",
								description : "",
								width : "120",
								height : "100"
							},
							bodyPartial : '_json_export_widget.tpl'
						}
					},
					files : {
						'html/export.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				debug_widget : {
					options : {
						data : {
							meta : {
								title : "Debug",
								description : "",
								width : "100",
								height : "300"
							},
							bodyPartial : '_debug_widget.tpl'
						}
					},
					files : {
						'html/debug.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				instance_list_widget : {
					options : {
						data : {
							meta : {
								title : "Instances",
								description : "",
								width : "200",
								height : "300"
							},
							bodyPartial : '_instance_list_widget.tpl'
						}
					},
					files : {
						'html/instances.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				generated_instances_widget : {
					options : {
						data : {
							meta : {
								title : "Generate Instance",
								description : "",
								width : "300",
								height : "300"
							},
							bodyPartial : '_generated_instances_widget.tpl'
						}
					},
					files : {
						'html/generated_instances.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				imsld_export_widget : {
					options : {
						data : {
							meta : {
								title : "IMS LD Export",
								description : "",
								width : "320",
								height : "310"
							},
							bodyPartial : '_imsld_export_widget.tpl'
						}
					},
					files : {
						'html/imsld_export.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}
				},

				viewcontrol_widget : {
					options : {
						data : {
							meta : {
								title : "View Control",
								description : "",
								width : "100",
								height : "300"
							},
							bodyPartial : '_viewcontrol_widget.tpl'
						}
					},
					files : {
						'html/viewcontrol.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}

				},
				viewcanvas_widget : {
					options : {
						data : {
							meta : {
								title : "View Canvas",
								description : "",
								width : "560",
								height : "400"
							},
							bodyPartial : '_viewcanvas_widget.tpl'
						}
					},
					files : {
						'html/viewcanvas.xml' : ['<%= srcdir %>/widgets/widget.xml.tpl']
					}

				}

			},

			requirejs : {
				compile : {
					options : {
						baseUrl : "<%= srcdir %>",
						dir : "html",
						optimizeAllPluginResources : true,
						optimize : "none",
						modules : [{
								name : 'templates/templates'
							}
						],
						paths : {
							text : "../components/requirejs-text/text"
						}
					}
				}
			},
			sshconfig : {
				"dbis" : grunt.file.readJSON('.dbis.secret.json')
			},
			sftp : {
				deploy : {
					files : {
						"./" : "<%= distdir %>/**"
					},
					options : {
						config : "dbis",
						path : '/home/<%= sshconfig.dbis.username %>/public_html/syncmeta/',
						host : '<%= sshconfig.dbis.host %>',
						username : '<%= sshconfig.dbis.username %>',
						password : '<%= sshconfig.dbis.password %>',
						srcBasePath : "html/",
						createDirectories : true
					}
				}
			},
			jsdoc : {
				dist : {
					src : [
						'<%= srcdir %>/**/*.js',
						'README.md'
					],
					options : {
						destination : 'doc',
						configure : 'jsdoc.conf.json'
					}
				}
			},
			jshint : {
				all : ['<%= srcdir %>/**/*.js', '!<%= srcdir %>/js/lib/iwc.js']
			},
			amdcheck : {
				dev : {
					options : {
						excepts : [],
						exceptsPaths : [],
						removeUnusedDependencies : false,
						logUnusedDependencyNames : true
					},
					files : [{
							src : ['<%= srcdir %>/**/*.js'],
							dest : 'build/'
						}
					]
				}
			}

		});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-amdcheck');
	grunt.loadNpmTasks('grunt-jsdoc');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('build', ['clean', 'requirejs', 'copy:lib', 'copy:main', 'buildwidgets']);
	grunt.registerTask('deploy', 'Deploy to dbis.rwth-aachen.de', function () {
		/*grunt.config.set('baseUrl', "http://dbis.rwth-aachen.de/~<%= sshconfig.dbis.username %>/syncmeta");*/
		grunt.config.set('roleSandboxUrl', "http://role-sandbox.eu");
		grunt.task.run(['clean', 'requirejs', 'copy:lib', 'copy:main', 'buildwidgets' /*,'sftp'*/
			]);
	});

};
