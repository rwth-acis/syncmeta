requirejs([
    'jqueryui',
    'lodash',
    'jsplumb',
    'iwcotw',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/WidgetEnterOperation',
    'operations/non_ot/InitModelTypesOperation',
    'operations/non_ot/ViewInitOperation',
    'viewcanvas_widget/ViewManager',
    'viewcanvas_widget/Canvas',
    'viewcanvas_widget/EntityManager',
    'viewcanvas_widget/MoveTool',
    'viewcanvas_widget/NodeTool',
    'viewcanvas_widget/ObjectNodeTool',
    'viewcanvas_widget/AbstractClassNodeTool',
    'viewcanvas_widget/RelationshipNodeTool',
    'viewcanvas_widget/RelationshipGroupNodeTool',
    'viewcanvas_widget/EnumNodeTool',
    'viewcanvas_widget/NodeShapeNodeTool',
    'viewcanvas_widget/EdgeShapeNodeTool',
    'viewcanvas_widget/EdgeTool',
    'viewcanvas_widget/GeneralisationEdgeTool',
    'viewcanvas_widget/BiDirAssociationEdgeTool',
    'viewcanvas_widget/UniDirAssociationEdgeTool',
    'viewcanvas_widget/ObjectNode',
    'viewcanvas_widget/AbstractClassNode',
    'viewcanvas_widget/RelationshipNode',
    'viewcanvas_widget/RelationshipGroupNode',
    'viewcanvas_widget/EnumNode',
    'viewcanvas_widget/NodeShapeNode',
    'viewcanvas_widget/EdgeShapeNode',
    'viewcanvas_widget/GeneralisationEdge',
    'viewcanvas_widget/BiDirAssociationEdge',
    'viewcanvas_widget/UniDirAssociationEdge',
    'viewcanvas_widget/ViewObjectNodeTool',
    'viewcanvas_widget/ViewObjectNode',
    'viewcanvas_widget/ViewRelationshipNode',
    'viewcanvas_widget/ViewRelationshipNodeTool',
    'viewcanvas_widget/ViewGenerator',
    'promise!Metamodel'
], function ($, _, jsPlumb, IWCOT, ToolSelectOperation, ActivityOperation, JoinOperation, WidgetEnterOperation,InitModelTypesOperation,ViewInitOperation,ViewManager, Canvas, EntityManager, MoveTool, NodeTool, ObjectNodeTool, AbstractClassNodeTool, RelationshipNodeTool, RelationshipGroupNodeTool, EnumNodeTool, NodeShapeNodeTool, EdgeShapeNodeTool, EdgeTool, GeneralisationEdgeTool, BiDirAssociationEdgeTool, UniDirAssociationEdgeTool, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNodeTool, ViewObjectNode, ViewRelationshipNode, ViewRelationshipNodeTool, ViewGenerator, metamodel) {

    var iwcot;
	var canvas = new Canvas($("#canvas"), CONFIG.WIDGET.NAME.VIEWCANVAS);


    var _inInstance = false;
	//Add all tool to the canvas
	if (metamodel && metamodel.hasOwnProperty("nodes")) {
		_inInstance = true;

	} else {
		//add node tools for the meta-model editor
		canvas.addTool(ObjectNode.TYPE, new ObjectNodeTool());
		canvas.addTool(AbstractClassNode.TYPE, new AbstractClassNodeTool());
		canvas.addTool(RelationshipNode.TYPE, new RelationshipNodeTool());
		canvas.addTool(RelationshipGroupNode.TYPE, new RelationshipGroupNodeTool());
		canvas.addTool(EnumNode.TYPE, new EnumNodeTool());
		canvas.addTool(NodeShapeNode.TYPE, new NodeShapeNodeTool());
		canvas.addTool(EdgeShapeNode.TYPE, new EdgeShapeNodeTool());

		//Add view types to the meta-model editor
		canvas.addTool(ViewObjectNode.TYPE, new ViewObjectNodeTool());
		canvas.addTool(ViewRelationshipNode.TYPE, new ViewRelationshipNodeTool());
	}

	if (metamodel && metamodel.hasOwnProperty("edges")) {
        _inInstance = true;
	} else {
		//add edge tools for the meta-model editor
		canvas.addTool(GeneralisationEdge.TYPE, new GeneralisationEdgeTool());
		canvas.addTool(BiDirAssociationEdge.TYPE, new BiDirAssociationEdgeTool());
		canvas.addTool(UniDirAssociationEdge.TYPE, new UniDirAssociationEdgeTool());
	}

	iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.VIEWCANVAS);

	//var space = new openapp.oo.Resource(openapp.param.space());

	var $undo = $("#undo");
	var $redo = $("#redo");
	$undo.click(function () {
		iwcot.undo();
	}).prop('disabled', true);

	$redo.click(function () {
		iwcot.redo();
	}).prop('disabled', true);

	iwcot.registerOnHistoryChangedCallback(function (operation, length, position) {
		$undo.prop('disabled', position == -1);
		$redo.prop('disabled', position == length - 1);
	});

	$("#q").draggable({
		axis : "y",
		start : function () {
			var $c = $("#canvas-frame");
			$c.css('bottom', 'inherit');
			$(this).css('height', 50);
		},
		drag : function (event, ui) {
			var height = ui.position.top - 30;
			$("#canvas-frame").css('height', height);
			gadgets.window.adjustHeight();
		},
		stop : function () {
			$(this).css('height', 3);
			gadgets.window.adjustHeight();
			$(this).css('top', '');
		}
	});

	$("#showtype").click(function () {
		canvas.get$node().removeClass("hide_type");
		$(this).hide();
		$("#hidetype").show();
	}).hide();

	$("#hidetype").click(function () {
		canvas.get$node().addClass("hide_type");
		$(this).hide();
		$("#showtype").show();
	});

	$("#zoomin").click(function () {
		canvas.setZoom(canvas.getZoom() + 0.1);
	});

	$("#zoomout").click(function () {
		canvas.setZoom(canvas.getZoom() - 0.1);
	});

	$("#btnCreateViewpoint").click(function () {
        ShowViewCreateMenu();
	});
	$('#btnCancelCreateViewpoint').click(function () {
        HideCreateMenu();
	});
    var initViewpoint = function(viewId){
       var deferred = $.Deferred();
        openapp.resource.get(ViewManager.getViewpointUri(viewId), function (context) {
            if(!context.uri){
                //$optNode.remove();
                return;
            }
            openapp.resource.context(context).representation().get(function (rep) {
                deferred.resolve(rep);
            })
        });
        return deferred.promise();
    };
    var visualizeView = function(viewId, viewpoint){
        openapp.resource.get(ViewManager.getViewUri(viewId), function (context) {
            if (!context.uri) {
                ViewManager.deleteView(viewId);
                return;
            }
            openapp.resource.context(context).representation().get(function (rep) {
                if (canvas.get$node().is(':hidden'))
                    canvas.get$canvas().show();
                resetCanvas();
                JSONtoGraph(rep.data,viewpoint);

                $('#lblCurrentView').attr("link", rep.uri).text(rep.data.id);
                canvas.resetTool();
                $("#loading").hide();
            });
        });
    };
	$('#btnShowViewPoint').click(function () {
        ViewManager.initViewList();
        var selected = ViewManager.getSelected$node();
        var viewId = selected.attr('id');
        if (selected.length == 0 || viewId === $('#lblCurrentView').text())
            return;
        $("#loading").show();
        if(_inInstance){
            initViewpoint(viewId).then(function(resp){
                $('#lblCurrentView').attr('vplink', resp.uri);
                EntityManager.initModelTypes(resp.data);
                visualizeView(viewId, resp.data);
                initTools(resp.data);
                iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, new InitModelTypesOperation(resp.data).toNonOTOperation());

            })
        }
        else {
            visualizeView(viewId);
        }

	});
	$('#btnAddViewpoint').click(function () {
		var viewId = $('#txtNameViewpoint').val();
        if(ViewManager.existsView(viewId)){
            alert('View already exists');
            return;
        }
        var $viewpointSelected = $('#ddmViewpointSelection').find('option:selected');
        var viewpointLink = null;
        if(_inInstance) {
             viewpointLink = $viewpointSelected.attr('link');
        }
        resetCanvas();
        $('#lblCurrentView').attr('vplink', viewpointLink).text(viewId);
        EntityManager.storeView(viewId,viewpointLink).then(function (resp) {
            ViewManager.addView(viewId,resp.uri,viewpointLink, resp);
            canvas.get$canvas().show();
            if (_inInstance) {
                openapp.resource.get(viewpointLink, function (context) {
                    openapp.resource.context(context).representation().get(function (vls) {
                        var viewpoint = vls.data;
                        var viewGenerator = new ViewGenerator(viewpoint);
                        viewGenerator.apply().then(function (view) {
                            EntityManager.initModelTypes(viewpoint);
                            JSONtoGraph(view, viewpoint);
                            canvas.resetTool();
                        })
                    })
                });
            }
            HideCreateMenu();
        });
	});

	$('#btnDelViewPoint').click(function () {
        var viewId = ViewManager.getViewIdOfSelected();
        if(viewId !== $('#lblCurrentView').text()) {
            openapp.resource.del(ViewManager.getViewUri(viewId), function () {
                ViewManager.deleteView(viewId);
            });
        }
		else {
            openapp.resource.del(ViewManager.getViewUri(viewId), function () {
                ViewManager.deleteView(viewId);
                resetCanvas();
                $('#lblCurrentView').attr('vplink', '').text('No view displayed');
                canvas.get$canvas().hide();
            });
        }
	});
	//Start Autosave---------------------------
	var $feedback = $("#feedback");
	$("#save").click(function () {
        var $currentView = $('#lblCurrentView');
        var currentView = $currentView.text();
        var viewUri =  ViewManager.getViewUri(currentView);
      	var vpUri = $currentView.attr('vplink');
		if (viewUri) {
			$feedback.text("Saving...");

			EntityManager.updateView(currentView,vpUri, ViewManager.getResource(currentView)).then(function (context) {
               ViewManager.initViewList();
				$feedback.text("Saved!");
				setTimeout(function () {
					$feedback.text("");
				}, 1000);
			});
		}
	});


    var readyToSave = true;
    var saveTriggered = false;
    var saveCallback = function () {
        if (readyToSave) {
            readyToSave = false;
            setTimeout(function () {
                $("#save").click();

            }, 500);
            setTimeout(function () {
                readyToSave = true;
                if (saveTriggered) {
                    saveTriggered = false;
                    saveCallback();
                }
            }, 5000);
        } else {
            saveTriggered = true;
        }
    };

	iwcot.registerOnHistoryChangedCallback(saveCallback);
	//End Autosave------------------------------------------------------

    $(document).on('mouseenter', function(){
        var operation = new WidgetEnterOperation(CONFIG.WIDGET.NAME.VIEWCANVAS);
        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE,operation.toNonOTOperation());
        var viewpointLink = $('#lblCurrentView').attr('vplink');
        if(_inInstance && viewpointLink) {
            openapp.resource.get(viewpointLink, function (context) {
                if(!context.uri){
                    selected.remove();
                    return;
                }
                openapp.resource.context(context).representation().get(function (rep) {
                    EntityManager.initModelTypes(rep.data);
                    initTools(rep.data);
                    operation = new  InitModelTypesOperation(rep.data);
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.toNonOTOperation());
                    iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE,operation.toNonOTOperation());
                    });
                });
        }
    });
    var initTools = function(viewpoint){
        //canvas.removeTools();
        //canvas.addTool(MoveTool.TYPE, new MoveTool());
        if(viewpoint && viewpoint.hasOwnProperty("nodes")){
            var nodes = viewpoint.nodes, node;
            for(var nodeId in nodes){
                if(nodes.hasOwnProperty(nodeId)){
                    node = nodes[nodeId];
                    canvas.addTool(node.label,new NodeTool(node.label,null,null,node.shape.defaultWidth,node.shape.defaultHeight));
                }
            }
        }

        if(viewpoint && viewpoint.hasOwnProperty("edges")){
            var edges = viewpoint.edges, edge;
            for(var edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edge = edges[edgeId];
                    canvas.addTool(edge.label,new EdgeTool(edge.label,edge.relations));
                }
            }
        }
    };
    var ShowViewCreateMenu = function(){
        $('#btnCreateViewpoint').hide();
        $('#ddmViewSelection').hide();
        $('#btnShowViewPoint').hide();
        $('#btnDelViewPoint').hide();
        $('#txtNameViewpoint').show();
        $('#btnAddViewpoint').show();
        $('#btnCancelCreateViewpoint').show();
        if(_inInstance)
            $('#ddmViewpointSelection').show();
    };
    var HideCreateMenu = function(){
        $('#btnCreateViewpoint').show();
        $('#ddmViewSelection').show();
        $('#btnDelViewPoint').show();
        $('#btnShowViewPoint').show();
        $('#txtNameViewpoint').hide();
        $('#btnAddViewpoint').hide();
        $('#btnCancelCreateViewpoint').hide();
        if(_inInstance)
            $('#ddmViewpointSelection').hide();
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
		//EntityManager.clearRecycleBin();
	}
	function GetViewList() {
		var resourceSpace = new openapp.oo.Resource(openapp.param.space());
		//noinspection JSUnusedGlobalSymbols
		resourceSpace.getSubResources({
			relation : openapp.ns.role + "data",
			type : CONFIG.NS.MY.VIEW,
			onEach : function (context) {
				context.getRepresentation("rdfjson", function (representation) {
                    ViewManager.addView(representation.id, context.uri, representation.viewpoint);
                });
            }
        });
	}

	function JSONtoGraph(json, viewpoint) {
        /*_.forOwn(json.nodes, function(value, key){
            var  new_id =  canvas.createNode(value.type, value.left, value.top, value.width, value.height,value.zIndex, value);
            for(var edgeId2 in json.edges){
                if(json.edges.hasOwnProperty(edgeId2)){
                    if(json.edges[edgeId2].source === key)
                        json.edges[edgeId2].source = new_id;
                    else if(json.edges[edgeId2].target === key)
                        json.edges[edgeId2].target = new_id;
                }
            }
        });

        _.forOwn(json.edges, function(value){
            canvas.createEdge(value.type,  value.source,value.target,value);
        });*/
        var operation = new ViewInitOperation(json, viewpoint);
        iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());
        var nodeId, edgeId;
        for(nodeId in json.nodes){
            if(json.nodes.hasOwnProperty(nodeId)){
                var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type,nodeId,json.nodes[nodeId].left,json.nodes[nodeId].top,json.nodes[nodeId].width,json.nodes[nodeId].height,json.nodes[nodeId].zIndex,json.nodes[nodeId]);
                node.draw();
                node.addToCanvas(canvas);
            }
        }
        for(edgeId in json.edges){
            if(json.edges.hasOwnProperty(edgeId)){
                var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type,edgeId,json.edges[edgeId].source,json.edges[edgeId].target,json.edges[edgeId]);
                edge.connect();
                edge.addToCanvas(canvas);
            }
        }
	}

	iwcot.registerOnJoinOrLeaveCallback(function (operation) {
		//var activityOperation;
		if (operation instanceof JoinOperation) {

			if (operation.getUser() === iwcot.getUser()[CONFIG.NS.PERSON.JABBERID]) {
				if (operation.isDone()) {
					//operation.setData(model);
					iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());
					//JSONtoGraph(model);
					/*if (canvas.getModelAttributesNode() === null) {
						var modelAttributesNode = EntityManager.createModelAttributesNode();
						canvas.setModelAttributesNode(modelAttributesNode);
						modelAttributesNode.addToCanvas(canvas);
					}*/
					//canvas.resetTool();
					$("#loading").hide();
                    canvas.get$canvas().hide();
                    ViewManager.initViewList();
                    if(_inInstance)
                        ViewManager.GetViewpointList();

				} else {
					//model = operation.getData();
				}
			}
		}
	});
});
