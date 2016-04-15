'use strict';

module.exports = function(grunt) {

    // Project configuration.
    //noinspection JSUnusedGlobalSymbols
    var localConfig = grunt.file.readJSON('.localGruntConfig.json');
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        baseUrl: localConfig.baseUrl,
        roleSandboxUrl: localConfig.roleSandboxUrl,

        bowerdir: grunt.file.readJSON('.bowerrc')['directory'],
        distdir: 'html',
        srcdir:  'src',

        clean: ["<%= distdir %>//*"],

        copy: {
            options: {
                processContent: function (content/*, srcpath*/) {
                    return grunt.template.process(content);
                },
                processContentExclude: ['**/*.{png,gif,jpg,svg,otf,woff,woff2,ttf}','**/lodash.js']
            },
            lib: {
                files: [
                    {src: '<%= bowerdir %>/iwc/index.js', dest: '<%= distdir %>/js/lib/vendor/iwc.js'},
                    {src: '<%= bowerdir %>/jquery/jquery.js', dest: '<%= distdir %>/js/lib/vendor/jquery.js'},
                    {src: '<%= bowerdir %>/jquery-migrate/jquery-migrate.js', dest: '<%= distdir %>/js/lib/vendor/jquery-migrate.js'},
                    {src: '<%= bowerdir %>/jquery-ui/ui/jquery-ui.js', dest: '<%= distdir %>/js/lib/vendor/jquery-ui.js'},
                    {src: '<%= bowerdir %>/jquery-ui/themes/base/jquery-ui.css', dest: '<%= distdir %>/css/vendor/jquery-ui.css'},
                    {cwd: '<%= bowerdir %>/jquery-ui/themes/base', expand: true, src: ['images/*'], dest: '<%= distdir %>/css/vendor/'},
                    {src: '<%= bowerdir %>/jsPlumb/dist/js/jquery.jsPlumb-1.5.*.js', dest: '<%= distdir %>/js/lib/vendor/jquery.jsPlumb.js'},
                    {src: '<%= bowerdir %>/jQuery-contextMenu/src/jquery.contextMenu.js', dest: '<%= distdir %>/js/lib/vendor/jquery.contextMenu.js'},
                    {src: '<%= bowerdir %>/jQuery-contextMenu/src/jquery.contextMenu.css', dest: '<%= distdir %>/css/vendor/jquery.contextMenu.css'},
                    {src: '<%= bowerdir %>/jquery-mousewheel/jquery.mousewheel.js', dest: '<%= distdir %>/js/lib/vendor/jquery.mousewheel.js'},
                    {src: '<%= bowerdir %>/requirejs/require.js', dest: '<%= distdir %>/js/lib/vendor/require.js'},
                    {src: '<%= bowerdir %>/requirejs-text/text.js', dest: '<%= distdir %>/js/lib/vendor/requirejs-text.js'},
                    {src: '<%= bowerdir %>/requirejs-promise/requirejs-promise.js', dest: '<%= distdir %>/js/lib/vendor/requirejs-promise.js'},
                    {src: '<%= bowerdir %>/lodash/dist/lodash.js', dest: '<%= distdir %>/js/lib/vendor/lodash.js'},
                    {src: '<%= bowerdir %>/jszip/jszip.js', dest: '<%= distdir %>/js/lib/vendor/jszip.js'},
                    {src: '<%= bowerdir %>/graphlib/dist/graphlib.core.min.js', dest: '<%= distdir %>/js/lib/vendor/graphlib.core.min.js'},
                    {cwd: '<%= bowerdir %>/font-awesome/',expand: true, src: ['css/**', 'fonts/**'], dest: '<%= distdir %>/css/vendor/font-awesome/'},
                    {cwd:'<%= bowerdir %>/yjs',expand:true, src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/yjs'},
                    {cwd:'<%= bowerdir %>/y-array',expand:true, src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/y-array'},
                    {cwd:'<%= bowerdir %>/y-map',expand:true, src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/y-map'},
                    {cwd:'<%= bowerdir %>/y-text',expand:true,src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/y-text'},
                    {cwd:'<%= bowerdir %>/y-websockets-client',expand:true, src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/y-websockets-client'},
                    {cwd:'<%= bowerdir %>/y-memory',expand:true, src: ['*.js'], dest:'<%=distdir%>/js/lib/vendor/y-memory'},
                    {src: '<%= bowerdir %>/chai/chai.js', dest: '<%= distdir %>/js/lib/vendor/test/chai.js'},
                    {src: '<%= bowerdir %>/mocha/mocha.js', dest: '<%= distdir %>/js/lib/vendor/test/mocha.js'}
                ]
            },
            main: {
                files: [
                    {cwd: '<%= srcdir %>/',expand: true, src: ['**','!widgets/**','!templates/**'], dest: '<%= distdir %>/'}
                ]
            }
        },

        bootstrap_prefix: {
            my_bootstrap: {
                options: {
                    // (Required) List of bootstrap CSS file(s). The first file must be the main bootstrap CSS file. The
                    // script parse it to retrieve all the bootstrap CSS classes which are then used to prefix the JS file(s).
                    // It's also possible to put minified CSS files in the list.
                    cssSource: ['<%= bowerdir %>/bootstrap/dist/css/bootstrap.min.css'],

                    //(Required) Path to the folder where the prefixed CSS files will be created
                    cssDest: '<%= distdir %>/css/vendor/',
                    jsSource: ['<%= bowerdir %>/bootstrap/js/dropdown.js'],
                    jsDest: '<%= distdir %>/js/lib/vendor/bootstrap'
                }
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['copy:main'],
                options: {
                    spawn: false
                }
            },
            widgets: {
                files: ['**/*.xml','**/*.tpl'],
                tasks: ['buildwidgets'],
                options: {
                    spawn: false
                }
            }
        },

        buildwidgets: {
            options: {
                partials: '<%= srcdir %>/widgets/partials'
            },

            main_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Canvas",
                            description: "",
                            width: "560",
                            height: "400"
                        },
                        bodyPartial: '_main_widget.tpl'
                    }
                },
                files: {
                    'html/widget.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            palette_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Palette",
                            description: "",
                            width: "160",
                            height: "400"
                        },
                        bodyPartial: '_palette_widget.tpl'
                    }
                },
                files: {
                    'html/palette.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            attribute_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Property Browser",
                            description: "",
                            width: "560",
                            height: "200"
                        },
                        bodyPartial: '_attribute_widget.tpl'
                    }
                },
                files: {
                    'html/attribute.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            activity_widget: {
                options: {
                    data: {
                        meta: {
                            title: "User Activity",
                            description: "",
                            width: "120",
                            height: "400"
                        },
                        bodyPartial: '_activity_widget.tpl'
                    }
                },
                files: {
                    'html/activity.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            json_export_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Export",
                            description: "",
                            width: "120",
                            height: "100"
                        },
                        bodyPartial: '_json_export_widget.tpl'
                    }
                },
                files: {
                    'html/export.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            debug_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Debug",
                            description: "",
                            width: "400",
                            height: "300"
                        },
                        bodyPartial: '_debug_widget.tpl'
                    }
                },
                files: {
                    'html/debug.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            instance_list_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Instances",
                            description: "",
                            width: "100",
                            height: "300"
                        },
                        bodyPartial: '_instance_list_widget.tpl'
                    }
                },
                files: {
                    'html/instances.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            generated_instances_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Generate Instance",
                            description: "",
                            width: "300",
                            height: "300"
                        },
                        bodyPartial: '_generated_instances_widget.tpl'
                    }
                },
                files: {
                    'html/generated_instances.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            imsld_export_widget: {
                options: {
                    data: {
                        meta: {
                            title: "IMS LD Export",
                            description: "",
                            width: "320",
                            height: "310"
                        },
                        bodyPartial: '_imsld_export_widget.tpl'
                    }
                },
                files: {
                    'html/imsld_export.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            guidance_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Guidance widget",
                            description: "",
                            width: "300",
                            height: "400"
                        },
                        bodyPartial: '_guidance_widget.tpl'
                    }
                },
                files: {
                    'html/guidance.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },

            heatmap_widget: {
                options: {
                    data: {
                        meta: {
                            title: "Collaboration Overview",
                            description: "",
                            width: "400",
                            height: "400"
                        },
                        bodyPartial: '_heat_map_widget.tpl'
                    }
                },
                files: {
                    'html/heatmap.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }
            },
            viewcontrol_widget: {
                options: {
                    data: {
                        meta: {
                            title: "View Control",
                            description: "",
                            width: "400",
                            height: "500"
                        },
                        bodyPartial: '_viewcontrol_widget.tpl'
                    }
                },
                files: {
                    'html/viewcontrol.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                }

            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "<%= srcdir %>",
                    dir: "html",
                    optimizeAllPluginResources: true,
                    optimize: "none",
                    modules: [{
                        name: 'templates/templates'
                    }],
                    paths: {
                        text: "../components/requirejs-text/text"
                    }
                }
            }
        },
        sshconfig: {
            "dbis": grunt.file.readJSON('.dbis.secret.json')
        },
        sftp: {
            deploy: {
                files: {
                    "./": "<%= distdir %>/**"
                },
                options: {
                    config: "dbis",
                    path: '/home/<%= sshconfig.dbis.username %>/public_html/syncmeta/',
                    host: '<%= sshconfig.dbis.host %>',
                    username: '<%= sshconfig.dbis.username %>',
                    password: '<%= sshconfig.dbis.password %>',
                    srcBasePath: "html/",
                    createDirectories: true
                }
            }
        },
        jsdoc : {
            dist : {
                src: [
                    '<%= srcdir %>/**/*.js',
                    'README.md'
                ],
                options: {
                    destination: 'doc',
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        jshint: {
            all: ['<%= srcdir %>/**/*.js','!<%= srcdir %>/js/lib/iwc.js']
        },
        amdcheck: {
            dev: {
                options: {
                    excepts: [],
                    exceptsPaths: [],
                    removeUnusedDependencies: false,
                    logUnusedDependencyNames: true
                },
                files: [
                    {
                        src: ['<%= srcdir %>/**/*.js'],
                        dest: 'build/'
                    }
                ]
            }
        },
        connect : {
            server : {
                options : {
                    port : 8081,
                    base : 'html',
                    keepalive:true
                }
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
    grunt.loadNpmTasks('grunt-bootstrap-prefix');
    //grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('build', ['clean','requirejs','copy:lib','copy:main', 'bootstrap_prefix','buildwidgets']);
    grunt.registerTask('deploy', 'Deploy', function(){
        grunt.config.set('baseUrl', localConfig.deployUrl);
        grunt.config.set('roleSandboxUrl', "http://role-sandbox.eu");
        grunt.task.run(['clean','requirejs','copy:lib','copy:main','bootstrap_prefix','buildwidgets'/*,'sftp'*/]);
    });
    grunt.registerTask('serve',['build','connect']);

};
