'use strict';

module.exports = function(grunt) {

    // Project configuration.
    //noinspection JSUnusedGlobalSymbols
    var localConfig = grunt.file.readJSON('.localGruntConfig.json');
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        baseUrl: localConfig.deployLocally ? localConfig.baseUrl_local : localConfig.baseUrl,
        roleSandboxUrl: localConfig.deployLocally ? localConfig.roleSandboxUrl_local : localConfig.roleSandboxUrl,
        yjsConnectorUrl: localConfig.deployLocally ? localConfig.yjsConnectorUrl_local : localConfig.yjsConnectorUrl,
        yjsConnector : localConfig.yjsConnector,
        yjsDatabaseAdapter: localConfig.yjsDatabaseAdapter,
        yjsResourcePath: localConfig.yjsResourcePath,
        distdir: 'html',
        srcdir:  'src',
        nodemodules: 'node_modules',

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
                    {src: '<%= nodemodules %>/@rwth-acis/iwc/iwc.js', dest: '<%= distdir %>/js/lib/vendor/iwc.js'},
                    {src: '<%= nodemodules %>/jquery/dist/jquery.js', dest: '<%= distdir %>/js/lib/vendor/jquery.js'},
                    {src: '<%= nodemodules %>/jquery-migrate/dist/jquery-migrate.js', dest: '<%= distdir %>/js/lib/vendor/jquery-migrate.js'},
                    {src: '<%= nodemodules %>/jquery-ui/jquery-ui.js', dest: '<%= distdir %>/js/lib/vendor/jquery-ui.js'},
                    {src: '<%= nodemodules %>/jquery-ui/themes/base/jquery-ui.css', dest: '<%= distdir %>/css/vendor/jquery-ui.css'},
                    {cwd: '<%= nodemodules %>/jquery-ui/themes/base', expand: true, src: ['images/*'], dest: '<%= distdir %>/css/vendor/'},
                    {src: '<%= nodemodules %>/jsPlumb/dist/js/jquery.jsPlumb-1.5.*.js', dest: '<%= distdir %>/js/lib/vendor/jquery.jsPlumb.js'},
                    {src: '<%= nodemodules %>/jquery-contextmenu/dist/jquery.contextMenu.js', dest: '<%= distdir %>/js/lib/vendor/jquery.contextMenu.js'},
                    {src: '<%= nodemodules %>/jquery-contextmenu/dist/jquery.contextMenu.css', dest: '<%= distdir %>/css/vendor/jquery.contextMenu.css'},
                    {src: '<%= nodemodules %>/jquery-mousewheel/jquery.mousewheel.js', dest: '<%= distdir %>/js/lib/vendor/jquery.mousewheel.js'},
                    {src: '<%= nodemodules %>/requirejs/require.js', dest: '<%= distdir %>/js/lib/vendor/require.js'},
                    {src: '<%= nodemodules %>/requirejs-text/text.js', dest: '<%= distdir %>/js/lib/vendor/requirejs-text.js'},
                    {src: '<%= nodemodules %>/requirejs-promise/requirejs-promise.js', dest: '<%= distdir %>/js/lib/vendor/requirejs-promise.js'},
                    {src: '<%= nodemodules %>/lodash/dist/lodash.js', dest: '<%= distdir %>/js/lib/vendor/lodash.js'},
                    {src: '<%= nodemodules %>/jszip/dist/jszip.js', dest: '<%= distdir %>/js/lib/vendor/jszip.js'},
                    {src: '<%= nodemodules %>/graphlib/dist/graphlib.core.min.js', dest: '<%= distdir %>/js/lib/vendor/graphlib.core.min.js'},
                    {cwd: '<%= nodemodules %>/font-awesome/',expand: true, src: ['css/**', 'fonts/**'], dest: '<%= distdir %>/css/vendor/font-awesome/'},
                    {cwd: '<%= nodemodules %>/yjs/dist',expand:true, src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/yjs'},
                    {cwd: '<%= nodemodules %>/y-array/dist',expand:true, src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/y-array'},
                    {cwd: '<%= nodemodules %>/y-map/dist',expand:true, src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/y-map'},
                    {cwd: '<%= nodemodules %>/y-text/dist',expand:true,src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/y-text'},
                    {cwd: '<%= nodemodules %>/y-websockets-client/dist',expand:true, src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/y-websockets-client'},
                    {cwd: '<%= nodemodules %>/y-memory/dist',expand:true, src: ['*.*'], dest:'<%=distdir%>/js/lib/vendor/y-memory'},
                    {src: '<%= nodemodules %>/dagre/dist/dagre.core.min.js', dest: '<%= distdir %>/js/lib/vendor/dagre.min.js'},
                    {src: '<%= nodemodules %>/chai/chai.js', dest: '<%= distdir %>/js/lib/vendor/test/chai.js'},
                    {src: '<%= nodemodules %>/mocha/mocha.js', dest: '<%= distdir %>/js/lib/vendor/test/mocha.js'},
                    {src: '<%= nodemodules %>/mocha/mocha.css', dest: '<%= distdir %>/js/lib/vendor/test/mocha.css'},
                    {src: '<%= nodemodules %>/ace-builds/src-min-noconflict/ace.js', dest: '<%= distdir %>/js/lib/vendor/ace/ace.js'},
                    {src: '<%= nodemodules %>/ace-builds/src-min-noconflict/mode-svg.js', dest: '<%= distdir %>/js/lib/vendor/ace/mode-svg.js'},
                    {src: '<%= nodemodules %>/ace-builds/src-min-noconflict/theme-github.js', dest: '<%= distdir %>/js/lib/vendor/ace/theme-github.js'},
                    {src: '<%= nodemodules %>/ace-builds/src-min-noconflict/worker-xml.js', dest: '<%= distdir %>/js/lib/vendor/ace/worker-xml.js'},
                    {src: '<%= nodemodules %>/async/dist/async.min.js', dest: '<%= distdir %>/js/lib/vendor/async.js'},
                    {src:'plugin/syncmeta-plugin.js', dest:'<%= distdir %>/plugin/syncmeta-plugin.js'}
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
                    cssSource: ['<%= nodemodules %>/bootstrap/dist/css/bootstrap.min.css'],

                    //(Required) Path to the folder where the prefixed CSS files will be created
                    cssDest: '<%= distdir %>/css/vendor/',
                    jsSource: ['<%= nodemodules %>/bootstrap/js/dropdown.js'],
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

            main_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_main_widget.tpl' 
                    }
                },
                files: {
                    'html/widget.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            palette_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_palette_widget.tpl' 
                    }
                },
                files: {
                    'html/palette.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            attribute_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_attribute_widget.tpl' 
                    }
                },
                files: {
                    'html/attribute.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            activity_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_activity_widget.tpl' 
                    }
                },
                files: {
                    'html/activity.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            json_export_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_json_export_widget.tpl'
                    }
                },
                files: {
                    'html/export.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            debug_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_debug_widget.tpl' 
                    }
                },
                files: {
                    'html/debug.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            imsld_export_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_imsld_export_widget.tpl'
                    }
                },
                files: {
                    'html/imsld_export.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            guidance_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_guidance_widget.tpl'
                    }
                },
                files: {
                    'html/guidance.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            heatmap_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_heat_map_widget.tpl'
                    }
                },
                files: {
                    'html/heatmap.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }
            },

            viewcontrol_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_viewcontrol_widget.tpl'
                    }
                },
                files: {
                    'html/viewcontrol.html': ['<%= srcdir %>/widgets/widget.html.tpl']
                }

            },

            test_widget_html: {
                options: {
                    data: {
                        bodyPartial: '_test_widget.tpl'
                    }
                },
                files: {
                    'html/test.html': ['<%= srcdir %>/widgets/widget.html.tpl']
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
                        text: "../node_modules/requirejs-text/text"
                    }
                }
            },
            plugin:{
                options: {
                    baseUrl: 'html/js',
                    name: '../..//tools/almond',
                    namespace :'syncmeta_api',
                    optimize:'none',
                    mainConfigFile:"<%= distdir %>/js/config.js",
                    include: ['plugin/main.js'],
                    paths:{
                        jquery:  "empty:"
                    },
                    out: 'html/plugin/syncmeta-plugin.js',
                    wrap: {
                        startFile: './tools/wrap.start',
                        endFile: './tools/wrap.end'
                    }
                }
            }
        },
        /*
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
        */
        jsdoc : {
            canvas : {
                src: [
                    'main_widget.js',
                    '<%= srcdir %>/js/canvas_widget',
                    'README.md'
                ],
                options: {
                    destination: 'doc/canvas',
                    configure: 'jsdoc.conf.json',
                    recurse: true
                }
            },
            attribute : {
                src: [
                    'attribute_widget.js',
                    '<%= srcdir %>/js/attribute_widget',
                    'README.md'
                ],
                options: {
                    destination: 'doc/attribute',
                    configure: 'jsdoc.conf.json',
                    recurse: true
                }
            },
            palette : {
                src: [
                    'palette_widget.js',
                    '<%= srcdir %>/js/palette_widget',
                    'README.md'
                ],
                options: {
                    destination: 'doc/palette',
                    configure: 'jsdoc.conf.json',
                    recurse: true
                }
            },
            activity : {
                src: [
                    'activity_widget.js',
                    '<%= srcdir %>/js/activity_widget',
                    'README.md'
                ],
                options: {
                    destination: 'doc/activity',
                    configure: 'jsdoc.conf.json',
                    recurse: true
                }
            },
            operations:{
                src: [
                    '<%= srcdir %>/js/operations/*'
                ],
                options: {
                    destination: 'doc/operations',
                    configure: 'jsdoc.conf.json'
                }
            },
            plugin:{
                 src: [
                    '<%= srcdir %>/js/plugin/*.js'
                ],
                options: {
                    destination: 'doc/plugin',
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
                    host : '*',
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
    grunt.registerTask('build', 'Build', function(){
        grunt.task.run(['clean','requirejs:compile','copy:lib','copy:main', 'bootstrap_prefix','buildwidgets']);
        //grunt.task.run();
    });
    grunt.registerTask('deploy', 'Deploy', function(){
        grunt.config.set('baseUrl', localConfig.deployUrl);
        grunt.config.set('roleSandboxUrl', "http://role-sandbox.eu");
        grunt.task.run(['clean','requirejs:compile','copy:lib','copy:main','bootstrap_prefix','buildwidgets'/*,'sftp'*/]);
    });
    grunt.registerTask('serve',['build','connect']);
    grunt.registerTask('plugin',['requirejs:plugin']);

};
