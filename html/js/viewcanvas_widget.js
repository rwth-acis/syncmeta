requirejs([
    'jqueryui',
    'lodash',
    'jsplumb',
    'iwcotw',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/JoinOperation',
    'operations/non_ot/WidgetEnterOperation',
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
    'viewcanvas_widget/ViewObjectNodeTool',
    'viewcanvas_widget/ViewObjectNode',
    'viewcanvas_widget/ViewRelationshipNode',
    'viewcanvas_widget/ViewRelationshipNodeTool',
    'viewcanvas_widget/ViewGenerator',
    'text!templates/viewcanvas_widget/select_option.html',
    'promise!Metamodel'
], function ($, _, jsPlumb, IWCOT, ToolSelectOperation, ActivityOperation, JoinOperation, WidgetEnterOperation, Canvas, EntityManager, NodeTool, ObjectNodeTool, AbstractClassNodeTool, RelationshipNodeTool, RelationshipGroupNodeTool, EnumNodeTool, NodeShapeNodeTool, EdgeShapeNodeTool, EdgeTool, GeneralisationEdgeTool, BiDirAssociationEdgeTool, UniDirAssociationEdgeTool, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNodeTool, ViewObjectNode, ViewRelationshipNode, ViewRelationshipNodeTool, ViewGenerator, htmlOptionTpl, metamodel) {

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
		//Add edge tools for the model editor
		var edges = metamodel.edges,
		edge;
		for (var edgeId in edges) {
			if (edges.hasOwnProperty(edgeId)) {
				edge = edges[edgeId];
				canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
			}
		}
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
	$('#btnShowViewPoint').click(function () {
        var selected = $('#ddmViewSelection').find('option:selected');
        if (selected.length == 0 || selected.text() === $('#lblCurrentView').text())
            return;
		openapp.resource.get(selected.attr('link'), function (context) {
            if(!context.uri){
                selected.remove();
                return;
            }
			openapp.resource.context(context).representation().get(function (rep) {
                if(canvas.get$node().is(':hidden'))
                    canvas.get$canvas().show();
				resetCanvas();

				JSONtoGraph(rep.data);

                $('#lblCurrentView').text(rep.data.id);
				canvas.resetTool();

			});
		});
	});
	$('#btnAddViewpoint').click(function () {
		var viewId = $('#txtNameViewpoint').val();
        resetCanvas();
        $('#lblCurrentView').text(viewId);
		EntityManager.storeView(viewId).then(function (resp) {
			var option = _.template(htmlOptionTpl);
            var $viewpointSelection = $('#ddmViewSelection');
            $viewpointSelection.append($(option({
						uri : resp.uri,
						val : viewId
					})));
            $viewpointSelection.val(viewId);

            canvas.get$canvas().show();
            if(_inInstance) {
                var viewpointLink = $('#ddmViewpointSelection').find('option:selected').attr('link');
                openapp.resource.get(viewpointLink, function (context) {
                    openapp.resource.context(context).representation().get(function (viewpoint) {
                        var viewGenerator = new ViewGenerator(viewpoint.data);
                        viewGenerator.apply().then(function(viewVLS) {
                            JSONtoGraph(viewVLS);
                        })
                    })
                });
            }
            HideCreateMenu();
			//alert("Successfully stored");
		});
	});

	$('#btnDelViewPoint').click(function () {
        var opt = $('#ddmViewSelection').find('option:selected');
        if(opt.text() !== $('#lblCurrentView').text()) {
            openapp.resource.del(opt.attr('link'), function () {
                $('#ddmViewSelection').find('option:selected').remove();
            });
        }
		else {
            openapp.resource.del(opt.attr('link'), function () {
                $('#ddmViewSelection').find('option:selected').remove();
                resetCanvas();
                $('#lblCurrentView').attr('link', '').text('No view displayed');
                canvas.get$canvas().hide();
            });
        }
	});
	//Start Autosave---------------------------
	var $feedback = $("#feedback");
	$("#save").click(function () {
        var currentView = $('#lblCurrentView').text();
        var opt =  $('#ddmViewSelection').find('option').filter(function(i,v){
            return $(v).text() === currentView;
        });
      	var uri = opt.attr('link');
		if (uri) {
			$feedback.text("Saving...");
			var viewId = opt.text();
			EntityManager.updateView(uri, viewId).then(function (context) {
                opt.attr('link', context.uri);
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
    });

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
				edge.triggerDeletion();
			}
		}
		var nodes = EntityManager.getNodes();
		for (nodeId in nodes) {
			if (nodes.hasOwnProperty(nodeId)) {
				var node = EntityManager.findNode(nodeId);
				node.triggerDeletion();
			}
		}
		EntityManager.clearRecycleBin();
	}
	function GetViewList(type, $selection) {
		var resourceSpace = new openapp.oo.Resource(openapp.param.space());
		//noinspection JSUnusedGlobalSymbols
		resourceSpace.getSubResources({
			relation : openapp.ns.role + "data",
			type : type,
			onEach : function (context) {
				context.getRepresentation("rdfjson", function (representation) {
					var option = _.template(htmlOptionTpl);
                    $selection.append($(option({
								uri : context.uri,
								val : representation.id
							})));
				});
			}
		});
	}
	function JSONtoGraph(json) {
		for (var nodeId in json.nodes) {
			if (json.nodes.hasOwnProperty(nodeId))
            var  new_id =  canvas.createNode(json.nodes[nodeId].type, json.nodes[nodeId].left, json.nodes[nodeId].top, json.nodes[nodeId].width, json.nodes[nodeId].height,json.nodes[nodeId].zIndex, json.nodes[nodeId]);
            for(var edgeId2 in json.edges){
                if(json.edges.hasOwnProperty(edgeId2)){
                    if(json.edges[edgeId2].source === nodeId)
                        json.edges[edgeId2].source = new_id;
                    else if(json.edges[edgeId2].target === nodeId)
                        json.edges[edgeId2].target = new_id;
                }
            }
		}
		for (var edgeId in json.edges) {
			if (json.edges.hasOwnProperty(edgeId))
				canvas.createEdge(json.edges[edgeId].type,  json.edges[edgeId].source, json.edges[edgeId].target, json.edges[edgeId]);

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
					canvas.resetTool();
					$("#loading").hide();
                    canvas.get$canvas().hide();
					GetViewList(CONFIG.NS.MY.VIEW, $('#ddmViewSelection'));
                    if(_inInstance)
                        GetViewList(CONFIG.NS.MY.VIEWPOINT, $('#ddmViewpointSelection'));

				} else {
					//model = operation.getData();
				}
			}
		}
	});
});
