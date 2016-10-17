/**
 * Namespace for canvas widget.
 * @namespace canvas_widget
 */

requirejs([
    'jqueryui',
    'jsplumb',
    'iwcw',
    'lib/yjs-sync',
    'Util',
    'operations/non_ot/NonOTOperation',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/ViewInitOperation',
    'operations/non_ot/UpdateViewListOperation',
    'operations/non_ot/DeleteViewOperation',
    'operations/non_ot/SetViewTypesOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/SetModelAttributeNodeOperation',
    'canvas_widget/Canvas',
    'canvas_widget/EntityManager',
    'canvas_widget/NodeTool',
    'canvas_widget/ObjectNodeTool',
    'canvas_widget/AbstractClassNodeTool',
    'canvas_widget/RelationshipNodeTool',
    'canvas_widget/RelationshipGroupNodeTool',
    'canvas_widget/EnumNodeTool',
    'canvas_widget/NodeShapeNodeTool',
    'canvas_widget/EdgeShapeNodeTool',
    'canvas_widget/EdgeTool',
    'canvas_widget/GeneralisationEdgeTool',
    'canvas_widget/BiDirAssociationEdgeTool',
    'canvas_widget/UniDirAssociationEdgeTool',
    'canvas_widget/ObjectNode',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/RelationshipGroupNode',
    'canvas_widget/EnumNode',
    'canvas_widget/NodeShapeNode',
    'canvas_widget/EdgeShapeNode',
    'canvas_widget/GeneralisationEdge',
    'canvas_widget/BiDirAssociationEdge',
    'canvas_widget/UniDirAssociationEdge',
    'canvas_widget/ViewObjectNode',
    'canvas_widget/ViewObjectNodeTool',
    'canvas_widget/ViewRelationshipNode',
    'canvas_widget/ViewRelationshipNodeTool',
    'canvas_widget/ViewManager',
    'canvas_widget/ViewGenerator',
    'canvas_widget/HistoryManager',
    'canvas_widget/JSONtoGraph',
    'promise!User',
    'promise!Guidancemodel'
], function($, jsPlumb, IWCW, yjsSync, Util, NonOTOperation, ToolSelectOperation, ActivityOperation, JoinOperation, ViewInitOperation, UpdateViewListOperation, DeleteViewOperation, SetViewTypesOperation, InitModelTypesOperation, SetModelAttributeNodeOperation, Canvas, EntityManager, NodeTool, ObjectNodeTool, AbstractClassNodeTool, RelationshipNodeTool, RelationshipGroupNodeTool, EnumNodeTool, NodeShapeNodeTool, EdgeShapeNodeTool, EdgeTool, GeneralisationEdgeTool, BiDirAssociationEdgeTool, UniDirAssociationEdgeTool, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNode, ViewObjectNodeTool, ViewRelationshipNode, ViewRelationshipNodeTool, ViewManager, ViewGenerator, HistoryManager, JSONtoGraph, user, guidancemodel) {

    var _iwcw;
    _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
    _iwcw.setSpace(user);

    yjsSync().done(function(y) {
        console.info('CANVAS: Yjs Initialized successfully');

        y.share.users.set(y.db.userId, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
        var userInfo = _iwcw.getUser();
        userInfo.globalId = Util.getGlobalId(user, y);
        y.share.userList.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], userInfo);
        var metamodel, model;
         if (guidancemodel.isGuidanceEditor()) {
            //Set the model which is shown by the editor to the guidancemodel
            model = y.share.data.get('guidancemodel');
            //Set the metamodel to the guidance metamodel
            metamodel = y.share.data.get('guidancemetamodel');
        }
        else{
            metamodel = y.share.data.get('metamodel');
            model = y.share.data.get('model');
        }
        EntityManager.init(metamodel, guidancemodel);
        window.y = y;
        InitMainWidget(metamodel, model);
    }).fail(function() {
        console.info("yjs log: Yjs intialization failed!");
        window.y = undefined;
        InitMainWidget();
    });
    function InitMainWidget(metamodel, model) {
        var userList = [];
        var canvas = new Canvas($("#canvas"));
        HistoryManager.init(canvas);

        y.share.join.observe(function(event) {
            userList.push(event.name);
            if (!event.value && event.name !== _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]) {
                y.share.join.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], true);
            } else if (event.name === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] && !event.value) {
                if (metamodel) {
                    var op = new InitModelTypesOperation(metamodel);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, op.toNonOTOperation());
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, op.toNonOTOperation());
                }

                var joinOperation = new JoinOperation(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], true, y.db.userId);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, joinOperation.toNonOTOperation());
                if (model) {
                    var report = JSONtoGraph(model, canvas)
                    console.info(report);
                    _iwcw.registerOnDataReceivedCallback(function(operation) {
                        if (operation.hasOwnProperty('getType') && operation.getType() === 'WaitForCanvasOperation') {
                            switch (operation.getData().widget) {
                                case CONFIG.WIDGET.NAME.ATTRIBUTE:
                                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new NonOTOperation('WaitForCanvasOperation', true));
                                    break;
                            }
                        }
                    });

                    $("#loading").hide();
                    canvas.resetTool();

                }
                else {
                    _iwcw.registerOnDataReceivedCallback(function(operation) {
                        if (operation.hasOwnProperty('getType') && operation.getType() === 'WaitForCanvasOperation') {
                            switch (operation.getData().widget) {
                                case CONFIG.WIDGET.NAME.ATTRIBUTE:
                                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new NonOTOperation('WaitForCanvasOperation', true));
                                    break;
                            }
                        }
                    });
                    $("#loading").hide();
                    if (canvas.getModelAttributesNode() === null) {
                        var modelAttributesNode = EntityManager.createModelAttributesNode();
                        modelAttributesNode.registerYMap();
                        canvas.setModelAttributesNode(modelAttributesNode);
                        modelAttributesNode.addToCanvas(canvas);
                    }

                    canvas.resetTool();
                }

                if (CONFIG.TEST.CANVAS && (_iwcw.getUser()[CONFIG.NS.PERSON.TITLE] === CONFIG.TEST.USER || _iwcw.getUser()[CONFIG.NS.PERSON.MBOX] === CONFIG.TEST.EMAIL))
                    require(['./../test/CanvasWidgetTest'], function(CanvasWidgetTest) {
                        CanvasWidgetTest(canvas);
                    });

                _iwcw.registerOnDataReceivedCallback(function(operation) {
                    if (operation instanceof SetModelAttributeNodeOperation) {
                        _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new SetModelAttributeNodeOperation().toNonOTOperation());
                    }
                    else if (operation instanceof UpdateViewListOperation) {
                        y.share.canvas.set(UpdateViewListOperation.TYPE, true);
                    }
                    else if (operation.hasOwnProperty('getType')) {
                        if (operation.getType() === 'WaitForCanvasOperation') {
                            switch (operation.getData().widget) {
                                case CONFIG.WIDGET.NAME.ACTIVITY:
                                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new NonOTOperation('WaitForCanvasOperation', JSON.stringify(userList)));
                                    break;
                            }
                        }
                    }

                });
                y.share.canvas.observe(function(event) {
                    switch (event.name) {
                        case UpdateViewListOperation.TYPE: {
                            ViewManager.GetViewpointList();
                            break;
                        }
                        case 'ReloadWidgetOperation': {
                            var text;
                            switch (event.value) {
                                case 'import': {
                                    text = 'ATTENTION! Imported new model. Some widgets will reload';
                                    break;
                                }
                                case 'delete': {
                                    text = 'ATTENTION! Deleted current model. Some widgets will reload';
                                    break;
                                }
                                case 'meta_delete': {
                                    text = "ATTENTION! Deleted current metamodel. Some widgets will reload";
                                    break;
                                }
                                case 'meta_import': {
                                    text = "ATTENTION! Imported new metamodel. Some widgets will reload";
                                    break;
                                }
                            }
                            var activityOperation = new ActivityOperation("ReloadWidgetOperation", undefined, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], text);
                            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());

                            //Users should not initlaize the new model at the same time, thus wait between 0 and 3 seconds before refreshing
                            frameElement.contentWindow.location.reload();
                        }
                    }

                });


            }
        });

        if (metamodel) {
            if (metamodel.hasOwnProperty("nodes")) {
                var nodes = metamodel.nodes, node;
                for (var nodeId in nodes) {
                    if (nodes.hasOwnProperty(nodeId)) {
                        node = nodes[nodeId];
                        canvas.addTool(node.label, new NodeTool(node.label, null, null, node.shape.defaultWidth, node.shape.defaultHeight));
                    }
                }
            }
            if (metamodel.hasOwnProperty("edges")) {
                var edges = metamodel.edges, edge;
                for (var edgeId in edges) {
                    if (edges.hasOwnProperty(edgeId)) {
                        edge = edges[edgeId];
                        canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
                    }
                }
            }
            ViewManager.GetViewpointList();


            //Not needed int the model editor
            $("#btnCreateViewpoint").hide();
            $('#btnDelViewPoint').hide();

            //init the new tools for the canvas
            var initTools = function(vvs) {
                //canvas.removeTools();
                //canvas.addTool(MoveTool.TYPE, new MoveTool());
                if (vvs && vvs.hasOwnProperty("nodes")) {
                    var nodes = vvs.nodes, node;
                    for (var nodeId in nodes) {
                        if (nodes.hasOwnProperty(nodeId)) {
                            node = nodes[nodeId];
                            canvas.addTool(node.label, new NodeTool(node.label, null, null, node.shape.defaultWidth, node.shape.defaultHeight));
                        }
                    }
                }

                if (vvs && vvs.hasOwnProperty("edges")) {
                    var edges = vvs.edges, edge;
                    for (var edgeId in edges) {
                        if (edges.hasOwnProperty(edgeId)) {
                            edge = edges[edgeId];
                            canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
                        }
                    }
                }
            };

            //Modeling layer implementation. View generation process starts here
            $('#btnShowView').click(function() {
                //Get identifier of the current selected view
                var viewId = ViewManager.getViewIdOfSelected();
                var $currentViewIdLabel = $('#lblCurrentViewId');
                if (viewId === $currentViewIdLabel.text())
                    return;

                var vvs = y.share.views.get(viewId);
                EntityManager.initViewTypes(vvs);

                //send the new tools to the palette as well
                var operation = new InitModelTypesOperation(vvs, true).toNonOTOperation();
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation);

                var activityOperation = new ActivityOperation("ViewApplyActivity", vvs.id, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                y.share.canvas.set('ViewApplyActivity', { viewId: viewId, jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] });

                //init the tools for canvas
                initTools(vvs);
                ViewGenerator.generate(metamodel, vvs);

                $('#lblCurrentView').show();
                $currentViewIdLabel.text(viewId);
            });

            //Modelling layer implementation
            $('#viewsHide').click(function() {
                $(this).hide();
                $('#viewsShow').show();
                $('#ViewCtrlContainer').hide();
                $('#canvas-frame').css('margin-top', '32px');
                var $lblCurrentViewId = $('#lblCurrentViewId');
                var viewpointId = $lblCurrentViewId.text();
                if (viewpointId.length > 0) {
                    //var $loading = $("#loading");
                    //$loading.show();


                    //reset view
                    var operation = new InitModelTypesOperation(metamodel, true);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

                    var activityOperation = new ActivityOperation("ViewApplyActivity", '', _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    y.share.canvas.set('ViewApplyActivity', { viewId: '', jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] });


                    EntityManager.setViewId(null);
                    EntityManager.initModelTypes(metamodel);
                    initTools(metamodel);

                    ViewGenerator.reset(metamodel);

                    $('#lblCurrentView').hide();
                    $lblCurrentViewId.text("");
                    // $loading.hide();
                }
            });

            var $saveImage = $("#save_image");
            $saveImage.show();
            $saveImage.click(function() {
                canvas.toPNG().then(function(uri) {
                    var link = document.createElement('a');
                    link.download = "export.png";
                    link.href = uri;
                    link.click();
                });
            });

        }
        else {
            //Add Node Tools
            canvas.addTool(ObjectNode.TYPE, new ObjectNodeTool());
            canvas.addTool(AbstractClassNode.TYPE, new AbstractClassNodeTool());
            canvas.addTool(RelationshipNode.TYPE, new RelationshipNodeTool());
            canvas.addTool(RelationshipGroupNode.TYPE, new RelationshipGroupNodeTool());
            canvas.addTool(EnumNode.TYPE, new EnumNodeTool());
            canvas.addTool(NodeShapeNode.TYPE, new NodeShapeNodeTool());
            canvas.addTool(EdgeShapeNode.TYPE, new EdgeShapeNodeTool());

            //Add Edge Tools
            canvas.addTool(GeneralisationEdge.TYPE, new GeneralisationEdgeTool());
            canvas.addTool(BiDirAssociationEdge.TYPE, new BiDirAssociationEdgeTool());
            canvas.addTool(UniDirAssociationEdge.TYPE, new UniDirAssociationEdgeTool());

            //Add View Types
            canvas.addTool(ViewObjectNode.TYPE, new ViewObjectNodeTool());
            canvas.addTool(ViewRelationshipNode.TYPE, new ViewRelationshipNodeTool());

            //Init control elements for views
            $("#btnCreateViewpoint").click(function() {
                ShowViewCreateMenu();
            });
            $('#btnCancelCreateViewpoint').click(function() {
                HideCreateMenu();
            });

            $('#btnShowView').click(function() {
                var viewId = ViewManager.getViewIdOfSelected();
                if (viewId === $('#lblCurrentViewId').text())
                    return;
                $("#loading").show();
                $('#lblCurrentView').show();
                $('#lblCurrentViewId').text(viewId);
                visualizeView(viewId);
            });

            $('#btnDelViewPoint').click(function() {
                var viewId = ViewManager.getViewIdOfSelected();
                if (viewId !== $('#lblCurrentViewId').text()) {
                    y.share.views.set(viewId, null);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new DeleteViewOperation(viewId).toNonOTOperation());
                    ViewManager.deleteView(viewId);

                }
                else {
                    y.share.views.set(viewId, null);
                    ViewManager.deleteView(viewId);
                    $('#viewsHide').click();
                }
            });

            $('#btnAddViewpoint').click(function() {
                var viewId = $('#txtNameViewpoint').val();
                if (ViewManager.existsView(viewId)) {
                    alert('View already exists');
                    return;
                }
                ViewManager.addView(viewId);
                HideCreateMenu();
                y.share.canvas.set(UpdateViewListOperation.TYPE, true);
            });

            //Meta-modelling layer implementation
            $('#viewsHide').click(function() {
                $(this).hide();
                $('#viewsShow').show();
                $('#ViewCtrlContainer').hide();
                $('#canvas-frame').css('margin-top', '32px');
                var $lblCurrentViewId = $('#lblCurrentViewId');
                if ($lblCurrentViewId.text().length > 0) {
                    var $loading = $("#loading");
                    $loading.show();

                    var model = y.share.data.get('model');
                    //Disable the view types in the palette
                    var operation = new SetViewTypesOperation(false);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());

                    var activityOperation = new ActivityOperation("ViewApplyActivity", '', _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    y.share.canvas.set('ViewApplyActivity', { viewId: '', jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] });

                    resetCanvas();
                    JSONtoGraph(model, canvas).done(function() {
                        $("#loading").hide();
                        canvas.resetTool();
                    });
                    $('#lblCurrentView').hide();
                    $lblCurrentViewId.text("");
                    EntityManager.setViewId(null);
                }
            })
        }
        //Functions and Callbacks for the view-based modeling approach
        var ShowViewCreateMenu = function() {
            $('#btnCreateViewpoint').hide();
            $('#ddmViewSelection').hide();
            $('#btnShowView').hide();
            $('#btnDelViewPoint').hide();
            $('#txtNameViewpoint').show();
            $('#btnAddViewpoint').show();
            $('#btnCancelCreateViewpoint').show();
        };
        var HideCreateMenu = function() {
            $('#btnCreateViewpoint').show();
            $('#ddmViewSelection').show();
            $('#btnDelViewPoint').show();
            $('#btnShowView').show();
            $('#txtNameViewpoint').hide();
            $('#btnAddViewpoint').hide();
            $('#btnCancelCreateViewpoint').hide();

        };

        function resetCanvas() {
            var edges = EntityManager.getEdges();
            for (edgeId in edges) {
                if (edges.hasOwnProperty(edgeId)) {
                    var edge = EntityManager.findEdge(edgeId);
                    edge.remove();
                    //edge.triggerDeletion();
                }
            }
            var nodes = EntityManager.getNodes();
            for (nodeId in nodes) {
                if (nodes.hasOwnProperty(nodeId)) {
                    var node = EntityManager.findNode(nodeId);
                    //node.triggerDeletion();
                    node.remove();
                }
            }
            EntityManager.deleteModelAttribute();
        }

        var visualizeView = function(viewId) {
            //ViewManager.getViewResource(viewId).getRepresentation('rdfjson', function (viewData) {
            var viewData = y.share.views.get(viewId);
            if (viewData) {
                resetCanvas();
                ViewToGraph(viewData);
                $('#lblCurrentView').show();
                $('#lblCurrentViewId').text(viewData.id);
                EntityManager.setViewId(viewData.id);
                canvas.resetTool();

            }
            //});
        };

        function ViewToGraph(json) {
            //Initialize the attribute widget
            var operation = new ViewInitOperation(json);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

            //Enable the view types in the palette
            operation = new SetViewTypesOperation(true);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());

            var activityOperation = new ActivityOperation("ViewApplyActivity", json.id, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
            y.share.canvas.set('ViewApplyActivity', { viewId: json.id, jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] });

            JSONtoGraph(json, canvas).done(function() {
                $("#loading").hide();
                canvas.resetTool();
            });
        }


        //-------------------------------------------------------------

        var $undo = $("#undo");
        $undo.prop('disabled', true);
        var $redo = $("#redo");
        $redo.prop('disabled', true);

        $undo.click(function() {
            HistoryManager.undo();
        });



        $redo.click(function() {
            HistoryManager.redo();
        });

        $("#showtype").click(function() {
            canvas.get$node().removeClass("hide_type");
            $(this).hide();
            $("#hidetype").show();
        }).hide();

        $("#hidetype").click(function() {
            canvas.get$node().addClass("hide_type");
            $(this).hide();
            $("#showtype").show();
        });

        $('#viewsShow').click(function() {
            $(this).hide();
            $('#viewsHide').show();
            $('#ViewCtrlContainer').show();
            $('#canvas-frame').css('margin-top', '64px');
        });

        $("#zoomin").click(function() {
            canvas.setZoom(canvas.getZoom() + 0.1);
        });

        $("#zoomout").click(function() {
            canvas.setZoom(canvas.getZoom() - 0.1);
        });

        var $feedback = $("#feedback");

        var saveFunction = function() {
            $feedback.text("Saving...");

            var viewId = $('#lblCurrentViewId').text();
            if (viewId.length > 0 && !metamodel) {
                ViewManager.updateViewContent(viewId);
                $feedback.text("Saved!");
                setTimeout(function() {
                    $feedback.text("");
                }, 1000);

            } else {
                EntityManager.storeDataYjs();
                $feedback.text("Saved!");
                setTimeout(function() {
                    $feedback.text("");
                }, 1000);
            }


        };
        $("#save").click(function() {
            saveFunction();
        });

        $("#dialog").dialog({
            autoOpen: false,
            resizable: false,
            height: 350,
            width: 400,
            modal: true,
            buttons: {
                "Generate": function(event) {
                    var title = $("#space_title").val();
                    var label = $("#space_label").val().replace(/[^a-zA-Z]/g, "").toLowerCase();

                    if (title === "" || label === "") return;
                    EntityManager.generateSpace(label, title).then(function(spaceObj) {
                        var operation = new ActivityOperation(
                            "EditorGenerateActivity",
                            "-1",
                            _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                            "..generated new Editor <a href=\"" + spaceObj.spaceURI + "\" target=\"_blank\">" + spaceObj.spaceTitle + "</a>",
                            {}
                        ).toNonOTOperation();
                        //_iwcw.sendRemoteNonOTOperation(operation);
                        _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, operation);

                        $("#space_link").text(spaceObj.spaceURI).attr({ href: spaceObj.spaceURI }).show();
                        $("#space_link_text").show();
                        $("#space_link_input").hide();
                        $(event.target).parent().hide();
                    });
                },
                "Close": function() {
                    $(this).dialog("close");
                }
            },
            open: function() {
                var name = canvas.getModelAttributesNode().getAttribute("modelAttributes[name]").getValue().getValue();
                var $spaceTitle = $("#space_title");
                var $spaceLabel = $("#space_label");

                if ($spaceTitle.val() === "") $spaceTitle.val(name);
                if ($spaceLabel.val() === "") $spaceLabel.val(name.replace(/[^a-zA-Z]/g, "").toLowerCase());

                $(":button:contains('Generate')").show();
            },
            close: function(/*event, ui*/) {
                $("#space_link_text").hide();
                $("#space_link_input").show();
            }
        });

        var $generate = $("#generate").click(function() {
            $("#dialog").dialog("open");
        });

        if (!metamodel || !metamodel.hasOwnProperty("nodes") && !metamodel.hasOwnProperty("edges")) {
            $generate.show();
        }

    
        ViewManager.GetViewpointList();

        //local user joins
        y.share.join.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], false);

    }

});

