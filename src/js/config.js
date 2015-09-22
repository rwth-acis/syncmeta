var require = {
    baseUrl: "<%= grunt.config('baseUrl') %>/js",
    waitSeconds: 0,
    shim: {
        iwc: {
            exports: "iwc"
        },
        jqueryui: {
            exports: "$",
            deps: ["jquery","jquery.contextMenu","jquery.autoGrowInput","jquery.mousewheel"]
        },
        jquerymigrate: {
            deps: ["jquery"]
        },
        jsplumb: {
            deps: ["jqueryui"],
            exports: "jsPlumb"
        },
        'jquery.contextMenu': {
            deps: ["jquery"]
        },
        'jquery.transform': {
            deps: ["jquery"]
        },
        'jquery.transformable-PATCHED': {
            deps: ["jquery", "jquery.transform", "jqueryui", "jquerymigrate"]
        },
        swfobject: {
            exports: "swfobject"
        },
        jszip: {
            exports: "JSZip"
        }
    },
    paths: {
        jquery: "lib/vendor/jquery",
        jquerymigrate: "lib/vendor/jquery-migrate",
        jqueryui: "lib/vendor/jquery-ui",
        lodash: "lib/vendor/lodash",
        jsplumb: "lib/vendor/jquery.jsPlumb",
        'jquery.contextMenu': "lib/vendor/jquery.contextMenu",
        'jquery.autoGrowInput': 'lib/jquery/jquery.autoGrowInput',
        'jquery.mousewheel': 'lib/vendor/jquery.mousewheel',
        'jquery.transform': 'lib/jquery.transform',
        'jquery.transformable-PATCHED': 'lib/jquery.transformable-PATCHED',
        org: "lib/vendor/org",
        coweb: "lib/vendor/coweb",
        ot: "lib/vendor/coweb/jsoe/OTEngine",
        //iwc: "iwc",
        iwc: "lib/iwc",
        iwcw: "lib/IWCWrapper",
        iwcotw: "lib/IWCOTWrapper",
        text: "lib/vendor/requirejs-text",
        promise: "lib/vendor/requirejs-promise",
        templates: "../templates",
        mfexport: "lib/MFExport",
        ildeApi: "lib/ildeApi",
        swfobject: "lib/vendor/swfobject/swfobject",
        jszip: "lib/vendor/jszip"
    }
};

CONFIG = {
    INSTANCE_FLAG:false,
    WIDGET: {
        NAME: {
            MAIN: "MAIN",
            PALETTE: "PALETTE",
            ATTRIBUTE: "ATTRIBUTE",
            ACTIVITY: "ACTIVITY"
        }
    },
    ENTITY: {
        NODE: "node",
        EDGE: "edge",
        ATTR: "attr",
        VAL: "val"
    },
    IWC: {
        FLAG: {
            PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
            PUBLISH_LOCAL: "PUBLISH_LOCAL"
        },
        ACTION: {
            SYNC: "ACTION_SYNC",
            DATA: "ACTION_DATA",
            DATA_ARRAY: "ACTION_DATA_ARRAY"
        },
        POSITION: {
            NODE: {
                ADD: 0,
                DEL: 0,
                POS: 1,
                Z: 2,
                DIM: 3
            },
            EDGE: {
                ADD: 0,
                DEL: 0,
                MOV: 1
            },
            ATTR: {
                ADD: 0,
                DEL: 0
            }
        }
    },
    OPERATION: {
        TYPE: {
            INSERT: "insert",
            UPDATE: "update",
            DELETE: "delete"
        }
    },
    ACTIVITY: {
        TYPE: {
            NODEADD: 0,
            EDGEADD: 1,
            NODEDEL: 2,
            EDGEDEL: 3,
            NODEATTRCHANGE: 4
        }
    },
    DATA: {
        RELATION: {
            GLOBAL: {
                MAIN: {
                    MAIN: {
                        OPERATION: "MAIN2MAIN4OPERATION"
                    }
                }
            },
            LOCAL: {
                PALETTE: {
                    MAIN: {
                        TOOLSELECTION: "PALETTE2MAIN4TOOLSELECTION"
                    }
                },
                MAIN: {
                    ATTRIBUTE: {
                        NODESELECTION: "MAIN2ATTRIBUTE4NODESELECTION",
                        NODEADDITION: "MAIN2ATTRIBUTE4NODEADDITION",
                        ATTRIBUTECHANGE: "MAIN2ATTRIBUTE4ATTRIBUTECHANGE"
                    },
                    ACTIVITY: {
                        NEWACTIVITY: "MAIN2ACTIVITY4NEWACTIVITY"
                    },
                    PALETTE: {
                        TOOLSELECTION: "MAIN2PALETTE4TOOLSELECTION"
                    }
                },
                ATTRIBUTE: {
                    MAIN: {
                        ATTRIBUTECHANGE: "ATTRIBUTE2MAIN4ATTRIBUTECHANGE"
                    }
                }
            }
        }
    },
    NS: {
        PERSON : {
            TITLE: "http://purl.org/dc/terms/title",
            JABBERID: "http://xmlns.com/foaf/0.1/jabberID",
            MBOX: "http://xmlns.com/foaf/0.1/mbox"
        },
        MY: {
            MODEL: "my:ns:model",
            METAMODEL: "my:ns:metamodel",
            INSTANCE: "my:ns:instance",
			VIEWPOINT: "my:ns:viewpoint",
			VIEW: "my:ns:view",
            COPY: "my:ns:copy"
        }
    }
};