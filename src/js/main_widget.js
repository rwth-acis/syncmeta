/**
 * Namespace for canvas widget.
 * @namespace canvas_widget
 */

requirejs([
    'jqueryui',
    'jsplumb',
    'iwcotw',
    'Util',
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
    'promise!Metamodel',
    'promise!Model'
],function($,jsPlumb,IWCOT, Util,ToolSelectOperation,ActivityOperation,JoinOperation, ViewInitOperation, UpdateViewListOperation, DeleteViewOperation,SetViewTypesOperation, InitModelTypesOperation, SetModelAttributeNodeOperation, Canvas,EntityManager,NodeTool,ObjectNodeTool,AbstractClassNodeTool,RelationshipNodeTool,RelationshipGroupNodeTool,EnumNodeTool,NodeShapeNodeTool,EdgeShapeNodeTool,EdgeTool,GeneralisationEdgeTool,BiDirAssociationEdgeTool,UniDirAssociationEdgeTool,ObjectNode,AbstractClassNode,RelationshipNode,RelationshipGroupNode,EnumNode,NodeShapeNode,EdgeShapeNode,GeneralisationEdge,BiDirAssociationEdge,UniDirAssociationEdge, ViewObjectNode, ViewObjectNodeTool,ViewRelationshipNode, ViewRelationshipNodeTool, ViewManager, ViewGenerator, metamodel,model) {

    var iwcot, canvas;

    iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.MAIN);
    canvas = new Canvas($("#canvas"));
    if(metamodel.constructor === Object) {
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
        var initTools = function(vvs){
            //canvas.removeTools();
            //canvas.addTool(MoveTool.TYPE, new MoveTool());
            if(vvs && vvs.hasOwnProperty("nodes")){
                var nodes = vvs.nodes, node;
                for(var nodeId in nodes){
                    if(nodes.hasOwnProperty(nodeId)){
                        node = nodes[nodeId];
                        canvas.addTool(node.label,new NodeTool(node.label,null,null,node.shape.defaultWidth,node.shape.defaultHeight));
                    }
                }
            }

            if(vvs && vvs.hasOwnProperty("edges")){
                var edges = vvs.edges, edge;
                for(var edgeId in edges){
                    if(edges.hasOwnProperty(edgeId)){
                        edge = edges[edgeId];
                        canvas.addTool(edge.label,new EdgeTool(edge.label,edge.relations));
                    }
                }
            }
        };

        //Modeling layer implementation. View generation process starts here
        $('#btnShowView').click(function(){
            //Get identifier of the current selected view
            var viewId = ViewManager.getViewIdOfSelected();
            if (viewId === $('#lblCurrentView').text())
                return;
            var resource = ViewManager.getViewpointResourceFromViewId(viewId);
            if(resource != null) {
                resource.getRepresentation('rdfjson',function(vvs){
                    //initialize the new node- and edge types for the EntityManager
                    EntityManager.initViewTypes(vvs);

                    //send the new tools to the palette as well
                    var operation = new InitModelTypesOperation(vvs, true).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation);

                    var activityOperation = new ActivityOperation("ViewApplyActivity", vvs.id, iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    iwcot.sendRemoteNonOTOperation(activityOperation.toNonOTOperation());

                    //init the tools for canvas
                    initTools(vvs);

                    ViewManager.getViewpointData(viewId).done(function(vvs){
                        ViewGenerator.generate(metamodel,vvs);
                    });

                    $('#lblCurrentView').show();
                    $('#lblCurrentViewId').text(viewId);

                });
            }

        });

        //Modelling layer implementation
        $('#viewsHide').click(function(){
            $(this).hide();
            $('#viewsShow').show();
            $('#ViewCtrlContainer').hide();
            $('#canvas-frame').css('margin-top','32px');
            var $lblCurrentViewId = $('#lblCurrentViewId');
            var viewpointId = $lblCurrentViewId.text();
            if(viewpointId.length > 0) {
                //var $loading = $("#loading");
                //$loading.show();


                //reset view
                var operation = new InitModelTypesOperation(metamodel, true);
                iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
                iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

                var activityOperation = new ActivityOperation("ViewApplyActivity", '', iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]);
                iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                iwcot.sendRemoteNonOTOperation(activityOperation.toNonOTOperation());

                EntityManager.setViewId(null);
                EntityManager.initModelTypes(metamodel);
                initTools(metamodel);

                ViewGenerator.reset(metamodel);

                $('#lblCurrentView').hide();
                $lblCurrentViewId.text("");
               // $loading.hide();
            }
        });

    }
    else{
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
        $("#btnCreateViewpoint").click(function () {
            ShowViewCreateMenu();
        });
        $('#btnCancelCreateViewpoint').click(function () {
            HideCreateMenu();
        });

        $('#btnShowView').click(function(){
            var viewId = ViewManager.getViewIdOfSelected();
            if (viewId === $('#lblCurrentViewId').text())
                return;
            $("#loading").show();
            visualizeView(viewId);
        });

        $('#btnDelViewPoint').click(function(){
            var viewId = ViewManager.getViewIdOfSelected();
            if (viewId !== $('#lblCurrentViewId').text()) {
                openapp.resource.del(ViewManager.getViewUri(viewId), function () {
                    ViewManager.deleteView(viewId);
                    //TODO DeleteView Operation
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new DeleteViewOperation(viewId).toNonOTOperation());
                });
            }
            else {
                DeleteView(viewId);
                $('#viewsHide').click();

            }
        });

        $('#btnAddViewpoint').click(function () {
            var viewId = $('#txtNameViewpoint').val();
            if (ViewManager.existsView(viewId)) {
                alert('View already exists');
                return;
            }
            resetCanvas();
            $('#lblCurrentViewId').text(viewId);
            ViewManager.storeView(viewId, null).then(function (resp) {
                ViewManager.addView(viewId, null, resp);
                visualizeView(viewId);

                var operation = new UpdateViewListOperation();
                iwcot.sendRemoteNonOTOperation(operation.toNonOTOperation());
                canvas.get$canvas().show();
                HideCreateMenu();
            });
        });

        //Meta-modelling layer implementation
        $('#viewsHide').click(function(){
            $(this).hide();
            $('#viewsShow').show();
            $('#ViewCtrlContainer').hide();
            $('#canvas-frame').css('margin-top','32px');
            var $lblCurrentViewId = $('#lblCurrentViewId');
            if($lblCurrentViewId.text().length > 0) {
                var $loading = $("#loading");
                $loading.show();
                Util.GetCurrentBaseModel().done(function (model) {
                    //Disable the view types in the palette
                    var operation= new SetViewTypesOperation(false);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
                    var activityOperation = new ActivityOperation("ViewApplyActivity", '', iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
                    iwcot.sendRemoteNonOTOperation(activityOperation.toNonOTOperation());
                    resetCanvas();
                    JSONtoGraph(model);
                    canvas.resetTool();
                    $('#lblCurrentView').hide();
                    $lblCurrentViewId.text("");
                    EntityManager.setViewId(null);
                    $loading.hide();
                })
            }
        });
    }

    //Functions and Callbacks for the view-based modeling approach
    var ShowViewCreateMenu = function(){
        $('#btnCreateViewpoint').hide();
        $('#ddmViewSelection').hide();
        $('#btnShowView').hide();
        $('#btnDelViewPoint').hide();
        $('#txtNameViewpoint').show();
        $('#btnAddViewpoint').show();
        $('#btnCancelCreateViewpoint').show();
    };
    var HideCreateMenu = function(){
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
        EntityManager.clearBin();

    }
    var visualizeView = function(viewId, viewpointData){
        ViewManager.getViewResource(viewId).getRepresentation('rdfjson', function(viewData){
            resetCanvas();
            ViewToGraph(viewData,viewpointData);
            $('#lblCurrentView').show();
            $('#lblCurrentViewId').text(viewData.id);
            EntityManager.setViewId(viewData.id);
            canvas.resetTool();
            $("#loading").hide();
        });
    };
    function ViewToGraph(json, viewpoint) {
        //Initialize the attribute widget
        var operation = new ViewInitOperation(json, viewpoint);
        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());

        //Enable the view types in the palette
        operation = new SetViewTypesOperation(true);
        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());

        var activityOperation = new ActivityOperation("ViewApplyActivity", json.id, iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]);
        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, activityOperation.toNonOTOperation());
        iwcot.sendRemoteNonOTOperation(activityOperation.toNonOTOperation());

        var nodeId, edgeId;
        for(nodeId in json.nodes){
            if(json.nodes.hasOwnProperty(nodeId)){
                var jNode = json.nodes[nodeId];
                var node = EntityManager.createNodeFromJSON(jNode.type,nodeId,jNode.left,jNode.top,jNode.width,jNode.height,jNode.zIndex,jNode,jNode.viewId);
                //TODO add origin to nodes
                //if(jNode.hasOwnProperty('origin'))
                //    node.setOrigin(jNode.origin);
                node.addToCanvas(canvas);
                node.draw();
            }
        }
        for(edgeId in json.edges){
            if(json.edges.hasOwnProperty(edgeId)){
                var jEdge = json.edges[edgeId];
                var edge = EntityManager.createEdgeFromJSON(jEdge.type,edgeId,jEdge.source,jEdge.target,jEdge);
                //  TODO add origin to edges
                //if(jEdge.hasOwnProperty('origin'))
                //    edge.setOrigin(jEdge.origin);
                edge.addToCanvas(canvas);
                edge.connect();
            }
        }
    }
    function DeleteView(viewId){
        var deferred = $.Deferred();
        openapp.resource.del(ViewManager.getViewUri(viewId), function () {
            ViewManager.deleteView(viewId);
            //TODO delete view operation
            iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new DeleteViewOperation(viewId).toNonOTOperation());
            deferred.resolve();
        });
        return deferred.promise();
    }
    //-------------------------------------------------------------

    function JSONtoGraph(json){
        var modelAttributesNode;
        var nodeId, edgeId;
        if(json.attributes){
            modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);
            canvas.setModelAttributesNode(modelAttributesNode);
            modelAttributesNode.addToCanvas(canvas);
        }
        for(nodeId in json.nodes){
            if(json.nodes.hasOwnProperty(nodeId)){
                var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type,nodeId,json.nodes[nodeId].left,json.nodes[nodeId].top,json.nodes[nodeId].width,json.nodes[nodeId].height,json.nodes[nodeId].zIndex,json.nodes[nodeId]);
                node.addToCanvas(canvas);
                node.draw();
            }
        }
        for(edgeId in json.edges){
            if(json.edges.hasOwnProperty(edgeId)){
                var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type,edgeId,json.edges[edgeId].source,json.edges[edgeId].target,json.edges[edgeId]);
                edge.addToCanvas(canvas);
                edge.connect();
            }
        }
    }

    var $undo = $("#undo");
    var $redo = $("#redo");
    $undo.click(function(){
        iwcot.undo();
    }).prop('disabled',true);

    $redo.click(function(){
        iwcot.redo();
    }).prop('disabled',true);

    iwcot.registerOnHistoryChangedCallback(function(operation,length,position){
        $undo.prop('disabled', position == -1);
        $redo.prop('disabled', position == length-1);
    });

    $("#q").draggable({
        axis: "y",
        start: function(){
            var $c = $("#canvas-frame");
            $c.css('bottom', 'inherit');
            $(this).css('height',50);
        },
        drag: function( event, ui ) {
            var height = ui.position.top-30;
            $("#canvas-frame").css('height', height);
            gadgets.window.adjustHeight();
        },
        stop: function(){
            $(this).css('height',3);
            gadgets.window.adjustHeight();
            $(this).css('top','');
        }
    });

    $("#showtype").click(function(){
        canvas.get$node().removeClass("hide_type");
        $(this).hide();
        $("#hidetype").show();
    }).hide();

    $("#hidetype").click(function(){
        canvas.get$node().addClass("hide_type");
        $(this).hide();
        $("#showtype").show();
    });

    $('#viewsShow').click(function(){
        $(this).hide();
        $('#viewsHide').show();
        $('#ViewCtrlContainer').show();
        $('#canvas-frame').css('margin-top','64px');
    });

    $("#zoomin").click(function(){
        canvas.setZoom(canvas.getZoom()+0.1);
    });

    $("#zoomout").click(function(){
        canvas.setZoom(canvas.getZoom()-0.1);
    });

    var $feedback = $("#feedback");
    $("#save").click(function(){
        $feedback.text("Saving...");
        var viewId = $('#lblCurrentViewId').text();
        if(viewId.length > 0 && metamodel.constructor !== Object){
            ViewManager.updateViewContent(viewId, ViewManager.getResource(viewId)).then(function () {
                //ViewManager.initViewList();
                $feedback.text("Saved!");
                setTimeout(function () {
                    $feedback.text("");
                }, 1000);
            });
        }else {
            EntityManager.storeData().then(function () {
                $feedback.text("Saved!");
                setTimeout(function () {
                    $feedback.text("");
                }, 1000);
            });
        }
    });

    $("#dialog").dialog({
        autoOpen: false,
        resizable: false,
        height:350,
        width: 400,
        modal: true,
        buttons: {
            "Generate": function(event) {
                var title = $("#space_title").val();
                var label = $("#space_label").val().replace(/[^a-zA-Z]/g,"").toLowerCase();

                if(title === "" || label === "") return;
                EntityManager.generateSpace(label,title).then(function(spaceObj){
                    var operation = new ActivityOperation(
                        "EditorGenerateActivity",
                        "-1",
                        iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                        "..generated new Editor <a href=\""+spaceObj.spaceURI+"\" target=\"_blank\">"+spaceObj.spaceTitle+"</a>",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendRemoteNonOTOperation(operation);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,operation);

                    $("#space_link").text(spaceObj.spaceURI).attr({href:spaceObj.spaceURI}).show();
                    $("#space_link_text").show();
                    $("#space_link_input").hide();
                    $(event.target).parent().hide();
                });
            },
            "Close": function() {
                $( this ).dialog( "close" );
            }
        },
        open: function(){
            var name = canvas.getModelAttributesNode().getAttribute("modelAttributes[name]").getValue().getValue();
            var $spaceTitle = $("#space_title");
            var $spaceLabel = $("#space_label");

            if($spaceTitle.val() === "") $spaceTitle.val(name);
            if($spaceLabel.val() === "") $spaceLabel.val(name.replace(/[^a-zA-Z]/g,"").toLowerCase());

            $(":button:contains('Generate')").show();
        },
        close: function( /*event, ui*/ ) {
            $("#space_link_text").hide();
            $("#space_link_input").show();
        }
    });

    var $generate = $("#generate").click(function(){
        $("#dialog").dialog( "open" );
    });

    if(!metamodel || !metamodel.hasOwnProperty("nodes") && !metamodel.hasOwnProperty("edges")){
        $generate.show();
    }

    var readyToSave = true;
    var saveTriggered = false;
    var saveCallback = function(){
        if(readyToSave){
            readyToSave = false;
            setTimeout(function(){
                $("#save").click();
            },500);
            setTimeout(function(){
                readyToSave = true;
                if(saveTriggered){
                    saveTriggered = false;
                    saveCallback();
                }
            },5000);
        } else {
            saveTriggered = true;
        }
    };

    iwcot.registerOnHistoryChangedCallback(saveCallback);

    if(iwcot.getJoiningState() === IWCOT.JOIN_STATE.COMPLETED){
        $("#loading").hide();
    }


    ViewManager.initViewList();

    iwcot.registerOnJoinOrLeaveCallback(function(operation){
        var activityOperation;
        if(operation instanceof JoinOperation){
            if(operation.getUser() === iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]){
                if(operation.isDone()){
                    operation.setData(model);
                    if(metamodel.constructor === Object){
                        var op = new InitModelTypesOperation(metamodel);
                        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, op.toNonOTOperation());
                        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, op.toNonOTOperation());
                    }
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.toNonOTOperation());

                    JSONtoGraph(model);
                    if(canvas.getModelAttributesNode() === null) {
                        var modelAttributesNode = EntityManager.createModelAttributesNode();
                        canvas.setModelAttributesNode(modelAttributesNode);
                        modelAttributesNode.addToCanvas(canvas);
                    }
                    canvas.resetTool();
                    $("#loading").hide();

                    iwcot.registerOnLocalDataReceivedCallback(function(operation){
                        if(operation instanceof SetModelAttributeNodeOperation){
                            iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, new SetModelAttributeNodeOperation().toNonOTOperation());
                        }
                        else if(operation instanceof UpdateViewListOperation){
                            iwcot.sendRemoteNonOTOperation(new UpdateViewListOperation().toNonOTOperation());
                            if(metamodel.constructor === Object){
                                ViewManager.GetViewpointList();
                            }else {
                                ViewManager.initViewList();
                            }
                        }
                    });

                    iwcot.registerOnRemoteDataReceivedCallback(function(operation){
                        if(operation instanceof UpdateViewListOperation) {
                            ViewManager.initViewList();
                        }else if(operation instanceof ActivityOperation){
                            iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, operation.toNonOTOperation());
                        }
                    });


                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getUser(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                } else {
                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getSender(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                    //model = operation.getData();
                }
            } else {
                if(operation.isDone()){
                    activityOperation = new ActivityOperation(
                        "UserJoinActivity",
                        "-1",
                        operation.getUser(),
                        "",
                        {}
                    ).toNonOTOperation();
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,activityOperation);
                } else {
                }
            }
        }
    });

    /*
    $("#save_image").click(function(){
        canvas.toPNG().then(function(uri){
            var link = document.createElement('a');
            link.download = "export.png";
            link.href = uri;
            link.click();
        });
    });*/

});

