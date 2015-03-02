requirejs([
		'jqueryui',
		'lodash',
		'jsplumb',
		'iwcotw',
		'operations/non_ot/ToolSelectOperation',
		'operations/non_ot/ActivityOperation',
		'operations/non_ot/JoinOperation',
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
		'promise!Metamodel'
	], function ($, _, jsPlumb, IWCOT, ToolSelectOperation, ActivityOperation, JoinOperation, Canvas, EntityManager, NodeTool, ObjectNodeTool, AbstractClassNodeTool, RelationshipNodeTool, RelationshipGroupNodeTool, EnumNodeTool, NodeShapeNodeTool, EdgeShapeNodeTool, EdgeTool, GeneralisationEdgeTool, BiDirAssociationEdgeTool, UniDirAssociationEdgeTool, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNodeTool, ViewObjectNode, ViewRelationshipNode, ViewRelationshipNodeTool, metamodel) {

	var iwcot;
	var canvas = new Canvas($("#canvas"), CONFIG.WIDGET.NAME.VIEWCANVAS);

	//Add all tool to the canvas
	if (metamodel && metamodel.hasOwnProperty("nodes")) {
		//Add node tools for the model editor
		var nodes = metamodel.nodes,
		node;
		for (var nodeId in nodes) {
			if (nodes.hasOwnProperty(nodeId)) {
				node = nodes[nodeId];
				canvas.addTool(node.label, new NodeTool(node.label, null, null, node.shape.defaultWidth, node.shape.defaultHeight));
			}
		}
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

	var space = new openapp.oo.Resource(openapp.param.space());

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
		$('#btnCreateViewpoint').hide();
		$('#ddmViewpointSelection').hide();
		$('#btnShowViewPoint').hide();
		$('#btnDelViewPoint').hide();
		$('#txtNameViewpoint').show();
		$('#btnAddViewpoint').show();
		$('#btnCancelCreateViewpoint').show();
	});
	$('#btnCancelCreateViewpoint').click(function () {
		$('#btnCreateViewpoint').show();
		$('#ddmViewpointSelection').show();
		$('#btnDelViewPoint').show();
		$('#btnShowViewPoint').show();
		$('#txtNameViewpoint').hide();
		$('#btnAddViewpoint').hide();
		$('#btnCancelCreateViewpoint').hide();
	});
	$('#btnShowViewPoint').click(function () {
        if ($('#ddmViewpointSelection option:selected').length == 0) {
            return;
        }
		openapp.resource.get($('#ddmViewpointSelection option:selected').attr('link'), function (context) {
			openapp.resource.context(context).representation().get(function (rep) {

				resetCanvas();
				JSONtoGraph(rep.data);
				
				canvas.resetTool();
			});
		});
	});
	$('#btnAddViewpoint').click(function () {
		var viewpointId = $('#txtNameViewpoint').val();
		EntityManager.storeView(viewpointId).then(function (resp) {
			var str_optTpl = '<option link="<<= uri >>"><<= val >></option>'.replace(/<</g, "<" + "%").replace(/>>/g, "%" + ">");
			var option = _.template(str_optTpl);

			$('#ddmViewpointSelection').append($(option({
						uri : resp.uri,
						val : viewpointId
					})));
			$('#ddmViewpointSelection').val(viewpointId);
			$('#btnCreateViewpoint').show();
			$('#ddmViewpointSelection').show();
			$('#btnDelViewPoint').show();
			$('#btnShowViewPoint').show();
			$('#txtNameViewpoint').hide();
			$('#btnAddViewpoint').hide();
			$('#btnCancelCreateViewpoint').hide();
			alert("Successfully stored");
		});
	});

	$('#btnDelViewPoint').click(function () {
		openapp.resource.del($('#ddmViewpointSelection option:selected').attr('link'), function (context) {
			$('#ddmViewpointSelection option:selected').remove();
			alert("Successfully deleted");
		});
	});
	//Start Autosave---------------------------
	var $feedback = $("#feedback");
	$("#save").click(function () {
		var uri = $('#ddmViewpointSelection option:selected').attr('link');
		if (uri) {
			$feedback.text("Saving...");
			var viewId = $('#ddmViewpointSelection option:selected').text();
			EntityManager.updateView(uri, viewId).then(function (context) {
				$('#ddmViewpointSelection option:selected').attr('link', context.uri);
				$feedback.text("Saved!");
				setTimeout(function () {
					$feedback.text("");
				}, 1000);
			});
		}
	});

	/*var readyToSave = true;
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

	iwcot.registerOnHistoryChangedCallback(saveCallback);*/
	//End Autosave------------------------------------------------------
	function resetCanvas() {
		
		var edges = EntityManager.getEdges();
		for (edgeId in edges) {
			if (edges.hasOwnProperty(edgeId)) {
				var edge = EntityManager.findEdge(edgeId);
				edge.remove();
			}
		}
		var nodes = EntityManager.getNodes();
		for (nodeId in nodes) {
			if (nodes.hasOwnProperty(nodeId)) {
				var node = EntityManager.findNode(nodeId);
				node.remove();
			}
		}
		EntityManager.clearRecycleBin();
	}
	function GetViewList() {
		var resourceSpace = new openapp.oo.Resource(openapp.param.space());

		//noinspection JSUnusedGlobalSymbols
		resourceSpace.getSubResources({
			relation : openapp.ns.role + "data",
			type : CONFIG.NS.MY.VIEW,
			onEach : function (context) {
				context.getRepresentation("rdfjson", function (representation) {
					var str_optTpl = '<option link="<<= uri >>"><<= val >></option>'.replace(/<</g, "<" + "%").replace(/>>/g, "%" + ">");
					var option = _.template(str_optTpl);
					$('#ddmViewpointSelection').append($(option({
								uri : context.uri,
								val : representation.id
							})));
				});
			}
		});
	}
	function JSONtoGraph(json) {
		var nodeId,
		edgeId;
		for (nodeId in json.nodes) {
			if (json.nodes.hasOwnProperty(nodeId)) {
				var node = EntityManager.createNodeFromJSON(json.nodes[nodeId].type, nodeId, json.nodes[nodeId].left, json.nodes[nodeId].top, json.nodes[nodeId].width, json.nodes[nodeId].height, json.nodes[nodeId].zIndex, json.nodes[nodeId]);
				node.draw();
				node.addToCanvas(canvas);
			}
		}
		for (edgeId in json.edges) {
			if (json.edges.hasOwnProperty(edgeId)) {
				var edge = EntityManager.createEdgeFromJSON(json.edges[edgeId].type, edgeId, json.edges[edgeId].source, json.edges[edgeId].target, json.edges[edgeId]);
				edge.connect();
				edge.addToCanvas(canvas);
			}
		}
	}

	iwcot.registerOnJoinOrLeaveCallback(function (operation) {
		var activityOperation;
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
					GetViewList();

				} else {
					//model = operation.getData();
				}
			}
		}
	});
});
