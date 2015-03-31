define([
		'jqueryui',
		'jsplumb',
		'iwcotw',
		'Util',
		'operations/ot/NodeAddOperation',
		'operations/ot/EdgeAddOperation',
		'operations/non_ot/ToolSelectOperation',
		'operations/non_ot/EntitySelectOperation',
		'operations/non_ot/ActivityOperation',
		'operations/non_ot/ExportDataOperation',
		'operations/non_ot/ExportMetaModelOperation',
		'operations/non_ot/ExportImageOperation',
		'canvas_widget/AbstractEntity',
		'canvas_widget/ModelAttributesNode',
		'viewcanvas_widget/EntityManager',
		'canvas_widget/AbstractCanvas',
		'viewcanvas_widget/MoveTool',
		'jquery.transformable'
	], /** @lends Canvas */
	function ($, jsPlumb, IWCOT, Util, NodeAddOperation, EdgeAddOperation, ToolSelectOperation, EntitySelectOperation, ActivityOperation, ExportDataOperation, ExportMetaModelOperation, ExportImageOperation, AbstractEntity, ModelAttributesNode, EntityManager, AbstractCanvas, MoveTool) {

	Canvas.prototype = new AbstractCanvas();
	Canvas.prototype.constructor = Canvas;
	/**
	 * Canvas
	 * @class canvas_widget.Canvas
	 * @extends canvas_widget.AbstractCanvas
	 * @memberof canvas_widget
	 * @constructor
	 * @param {jQuery} $node jquery Selector of canvas node
	 * @param {string} the name of the widget to generate a iwcot instance for. default is CONFIG.WIDGET.NAME.MAIN
	 */
	function Canvas($node) {
		var that = this;

		AbstractCanvas.call(this, $node);

		/**
		 * jQuery object of DOM node representing the canvas
		 * @type {jQuery}
		 * @private
		 */
		var _$node = $node;

		/**
		 * Current zoom level
		 * @type {number}
		 * @private
		 */
		var _zoom = 1;

		/**
		 * Array of callback functions listening for Canvas events
		 * @type {Array}
		 * @private
		 */
		var _listeners = [];

		/**
		 * Default canvas width
		 * @type {number}
		 * @private
		 */
		var _canvasWidth = 9000;

		/**
		 * Default canvas height
		 * @type {number}
		 * @private
		 */
		var _canvasHeight = 9000;

		/**
		 * Model attributes
		 * @type {canvas_widget.ModelAttributesNode}
		 * @private
		 */
		var _modelAttributesNode = null;

		/**
		 * Inter widget communication wrapper
		 * @type {Object}
		 */

		var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.VIEWCANVAS);

		/**
		 * Entity currently selected
		 * @type {canvas_widget.AbstractNode|canvas_widget/AbstractEdge}
		 * @private
		 */
		var _selectedEntity = null;

        var _type = CONFIG.WIDGET.NAME.VIEWCANVAS;
        this.getType = function(){
            return _type;
        };
		/**
		 * Offset of the DOM node representating the canvas
		 * @type {{left: number, top: number, right: number, bottom: number}}
		 */
		var canvasOffset = _$node.offset();

		/**
		 * Apply a Tool Select Operation
		 * @param {ToolSelectOperation} operation
		 */
		var processToolSelectOperation = function (operation) {
			that.mountTool(operation.getSelectedToolName());
		};

		/**
		 * Apply a Node Add Operation
		 * @param {operations.ot.NodeAddOperation} operation
		 */
		var processNodeAddOperation = function (operation) {
			var node;
			if (operation.getJSON()) {
				node = EntityManager.createNodeFromJSON(operation.getType(), operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex(), operation.getJSON());
			} else {
				node = EntityManager.createNode(operation.getType(), operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex());
			}

			node.draw();
			node.addToCanvas(that);
			that.remountCurrentTool();
		};

		/**
		 * Propagate a Node Add Operation to the remote users and the local widgets
		 * @param {operations.ot.NodeAddOperation} operation
		 */
		var propagateNodeAddOperation = function (operation) {
			processNodeAddOperation(operation);
			if (_iwcot.sendRemoteOTOperation(operation)) {
				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
						"NodeAddActivity",
						operation.getEntityId(),
						_iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
						NodeAddOperation.getOperationDescription(operation.getType()), {
						nodeType : operation.getType()
					}).toNonOTOperation());
			}
		};

		/**
		 * Apply an Edge Add Operation
		 * @param {operations.ot.EdgeAddOperation} operation
		 */
		var processEdgeAddOperation = function (operation) {
			var edge;

			if (operation.getJSON()) {
				edge = EntityManager.createEdgeFromJSON(operation.getType(), operation.getEntityId(), operation.getSource(), operation.getTarget(), operation.getJSON());
			} else {
				edge = EntityManager.createEdge(operation.getType(), operation.getEntityId(), EntityManager.findNode(operation.getSource()), EntityManager.findNode(operation.getTarget()));
			}

			edge.connect();
			edge.addToCanvas(that);
			that.remountCurrentTool();
		};

		/**
		 * Propagate an Edge Add Operation to the remote users and the local widgets
		 * @param {operations.ot.EdgeAddOperation} operation
		 */
		var propagateEdgeAddOperation = function (operation) {
			var sourceNode = EntityManager.findNode(operation.getSource());
			var targetNode = EntityManager.findNode(operation.getTarget());

			processEdgeAddOperation(operation);
			if (_iwcot.sendRemoteOTOperation(operation)) {
				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
						"EdgeAddActivity",
						operation.getEntityId(),
						_iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
						EdgeAddOperation.getOperationDescription(operation.getType(), "", sourceNode.getLabel().getValue().getValue(), sourceNode.getType(), targetNode.getType(), targetNode.getLabel().getValue().getValue()), {
						nodeType : operation.getType(),
						sourceNodeId : operation.getSource(),
						sourceNodeLabel : sourceNode.getLabel().getValue().getValue(),
						sourceNodeType : sourceNode.getType(),
						targetNodeId : operation.getTarget(),
						targetNodeLabel : targetNode.getLabel().getValue().getValue(),
						targetNodeType : targetNode.getType()
					}).toNonOTOperation());
			}
		};

		/**
		 * Callback for a remote Node Add Operation
		 * @param {operations.ot.NodeAddOperation} operation
		 */
		var remoteNodeAddCallback = function (operation) {
			if (operation instanceof NodeAddOperation && operation.getToCanvas() === CONFIG.WIDGET.NAME.VIEWCANVAS && operation.getViewId() === $('#lblCurrentView').text()) {
				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
						"NodeAddActivity",
						operation.getEntityId(),
						operation.getOTOperation().getSender(),
						NodeAddOperation.getOperationDescription(operation.getType()), {
						nodeType : operation.getType()
					}).toNonOTOperation());
				processNodeAddOperation(operation);
			}
		};

		/**
		 * Callback for a remote Edge Add Operation
		 * @param {operations.ot.EdgeAddOperation} operation
		 */
		var remoteEdgeAddCallback = function (operation) {
			if (operation instanceof EdgeAddOperation) {
				var sourceNode = EntityManager.findNode(operation.getSource());
				var targetNode = EntityManager.findNode(operation.getTarget());

				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
						"EdgeAddActivity",
						operation.getEntityId(),
						operation.getOTOperation().getSender(),
						EdgeAddOperation.getOperationDescription(operation.getType(), "", sourceNode.getLabel().getValue().getValue(), sourceNode.getType(), targetNode.getLabel().getValue().getValue(), targetNode.getType()), {
						nodeType : operation.getType(),
						sourceNodeId : operation.getSource(),
						sourceNodeLabel : sourceNode.getLabel().getValue().getValue(),
						sourceNodeType : sourceNode.getType(),
						targetNodeId : operation.getTarget(),
						targetNodeLabel : targetNode.getLabel().getValue().getValue(),
						targetNodeType : targetNode.getType()
					}).toNonOTOperation());
				processEdgeAddOperation(operation);
			}
		};

		/**
		 * Callback for a local Tool Select Operation
		 * @param {operations.non_ot.ToolSelectOperation} operation
		 */
		var localToolSelectCallback = function (operation) {
			if (operation instanceof ToolSelectOperation) {
				processToolSelectOperation(operation);
			}
		};

		/**
		 * Callback for a local Export Data Operation
		 * @param {operations.non_ot.ExportDataOperation} operation
		 */
		var localExportDataCallback = function (operation) {
			if (operation instanceof ExportDataOperation) {
				operation.setData(EntityManager.graphToJSON());
				_iwcot.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
			}
		};

		/**
		 * Callback for a local Export Data Operation
		 * @param {operations.non_ot.ExportMetaModelOperation} operation
		 */
		var localExportMetaModelCallback = function (operation) {
			if (operation instanceof ExportMetaModelOperation) {
				if (operation.getData() === null) {
					operation.setData(EntityManager.generateMetaModel());
					_iwcot.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
				} else {
					var data = operation.getData();
					var op = new ActivityOperation(
							"EditorGenerateActivity",
							"-1",
							_iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
							"..generated new Editor <a href=\"" + data.spaceURI + "\" target=\"_blank\">" + data.spaceTitle + "</a>", {}).toNonOTOperation();
					_iwcot.sendRemoteNonOTOperation(op);
					_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, op);
				}

			}
		};

		/**
		 * Callback for a local Export Data Operation
		 * @param {operations.non_ot.ExportImageOperation} operation
		 */
		var localExportImageCallback = function (operation) {
			if (operation instanceof ExportImageOperation) {
				that.toPNG().then(function (url) {
					operation.setData(url);
					_iwcot.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
				});
			}
		};

		/**
		 * Callback for an undone resp. redone Node Add Operation
		 * @param {operations.ot.NodeAddOperation} operation
		 */
		var historyNodeAddCallback = function (operation) {
			if (operation instanceof NodeAddOperation) {
				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				processNodeAddOperation(operation);
			}
		};

		/**
		 * Callback for an undone resp. redone Edge Add Operation
		 * @param {operations.non_ot.EdgeAddOperation} operation
		 */
		var historyEdgeAddCallback = function (operation) {
			if (operation instanceof EdgeAddOperation) {
				_iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
				processEdgeAddOperation(operation);
			}
		};

		var init = function () {
			var $canvasFrame = _$node.parent();

			that.addTool(MoveTool.TYPE, new MoveTool());

			jsPlumb.importDefaults({
				ConnectionsDetachable : false
			});

			jsPlumb.Defaults.Container = _$node;

			_$node.css({
				width : _canvasWidth,
				height : _canvasHeight,
				left : (-_canvasWidth + $canvasFrame.width()) / 2,
				top : (-_canvasHeight + $canvasFrame.height()) / 2
			});

			_$node.draggable({
				start : function (event, ui) {
					_$node.draggable("option", "containment", [-_canvasWidth + $canvasFrame.width(), -_canvasHeight + $canvasFrame.height(), 0, 0]);
					_$node.draggable("option", "containment", [-_canvasWidth + $canvasFrame.width(), -_canvasHeight + $canvasFrame.height(), 0, 0]);
				},
				drag : function (event, ui) {
					//ui.position.left = Math.round(ui.position.left  / _zoom);
					//ui.position.top = Math.round(ui.position.top / _zoom);
				}
			});
			if (_$node.transformable != null) { // since recently, this method doesnt exist anymore.  BUGFIX
				_$node.transformable({
					rotatable : false,
					skewable : false,
					scalable : false
				});
			}
			_$node.mousewheel(function (event) {
				that.setZoom(that.getZoom() + 0.1 * event.deltaY);
				event.preventDefault();
			});
		};

		/**
		 * Get jQuery object of DOM node representing the canvas
		 * @returns {jQuery}
		 */
		this.get$node = function () {
			return _$node;
		};

		/**
		 * Set model attributes
		 * @param {canvas_widget.ModelAttributesNode} node
		 */
		this.setModelAttributesNode = function (node) {
			_modelAttributesNode = node;
		};

		/**
		 * Get model attributes
		 * @returns {canvas_widget.ModelAttributesNode}
		 */
		this.getModelAttributesNode = function () {
			return _modelAttributesNode;
		};

		//noinspection JSUnusedGlobalSymbols
		/**
		 * Calls an event listener
		 */
		this.callListeners = function () {
			var i,
			numOfCallbacks;
			//noinspection JSAccessibilityCheck
			var args = Array.prototype.splice.call(arguments, 0);

			var name = args.shift();
			if (_listeners.hasOwnProperty(name)) {
				for (i = 0, numOfCallbacks = _listeners[name].length; i < numOfCallbacks; i++) {
					_listeners[name][i].apply(this, args);
				}
			}
		};

		/**
		 * Register an event listener
		 * @param {string} name Name of event
		 * @param {function} callback Event Listener
		 */
		this.registerListener = function (name, callback) {
			if (CONFIG.CANVAS.LISTENERS.hasOwnProperty(name) && typeof callback === "function") {
				this.unregisterListener(name, callback);
				(_listeners[name] || (_listeners[name] = [])).push(callback);
			}
		};

		/**
		 * Unregister an event listener
		 * @param {string} name Name of event
		 * @param {function} callback Event Listener which has previously been registered
		 */
		this.unregisterListener = function (name, callback) {
			var i,
			numOfCallbacks;

			if (_listeners[name] && typeof callback === "function") {
				for (i = 0, numOfCallbacks = _listeners[name].length; i < numOfCallbacks; i++) {
					if (callback === _listeners[name][i]) {
						_listeners[name].splice(i, 1);
					}
				}
			}
		};

		/**
		 * Bind events for move tool
		 */
		this.bindMoveToolEvents = function () {

			//Enable Canvas Dragging
			_$node.draggable("enable");

			_$node.transformable({
				rotatable : false,
				skewable : false,
				scalable : false
			});

			//Define Node Rightclick Menu
			$.contextMenu({
				selector : '#' + _$node.attr('id'),
				zIndex : AbstractEntity.CONTEXT_MENU_Z_INDEX,
				build : function ($trigger, e) {
					if (_selectedEntity === null) {
						return {
							items : {
								addNode : {
									name : "Add node..",
									items : EntityManager.generateAddNodeMenu(that, e.originalEvent.offsetX, e.originalEvent.offsetY)
								},
                                Paste: {
                                    name: "Paste",
                                    callback:function(){
                                        var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                                        require(["promise!Space"], function(Space){
                                            resourceSpace.getSubResources({
                                                relation: openapp.ns.role + "data",
                                                type: CONFIG.NS.MY.COPY+":"+Space.user[CONFIG.NS.PERSON.JABBERID],
                                                onAll: function(items) {
                                                    if(items.length ==1){
                                                        items[0].getRepresentation("rdfjson",function(rep){
                                                          that.createNode(rep.type, e.originalEvent.offsetX, e.originalEvent.offsetY, rep.width, rep.height, rep.zIndex, rep);
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
							}
						};
					} else {
						that.select(null);
						return false;
					}
				}

			});
		};

		/**
		 * Bind events for move tool
		 */
		this.unbindMoveToolEvents = function () {

			//Disable Canvas Dragging
			_$node.draggable("disable");

			_$node.transformable('destroy');

			//Unbind Node and Edge Events
			this.select(null);

			//Disable Canvas Rightclick Menu
			_$node.unbind("contextmenu");
		};

		/**
		 * Select an entity
		 * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} entity
		 */
		this.select = function (entity) {
			if (_selectedEntity != entity) {
				if (_selectedEntity)
					_selectedEntity.unselect();
				if (entity)
					entity.select();
				_selectedEntity = entity;
				var operation = new EntitySelectOperation(entity ? entity.getEntityId() : null, CONFIG.WIDGET.NAME.VIEWCANVAS);
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.toNonOTOperation());
				_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, operation.toNonOTOperation());
				_iwcot.sendRemoteNonOTOperation(operation.toNonOTOperation());
				//this.callListeners(CONFIG.CANVAS.LISTENERS.NODESELECT,entity ? entity.getEntityId() :null);
			}
		};

		/**
		 * Get entity currently selected
		 * @return {canvas_widget.AbstractNode|canvas_widget/AbstractEdge}
		 */
		this.getSelectedEntity = function () {
			return _selectedEntity;
		};

		/**
		 * Set zoom level (between 0.5 and 2, default is 1)
		 * @param {number} zoom
		 */
		this.setZoom = function (zoom) {
			if (zoom < 0.5 || zoom > 2) {
				return;
			}
			_zoom = zoom;
			// var p = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ],
			//     s = "scale(" + zoom + ")";

			// for (var i = 0; i < p.length; i++)
			//     _$node.css(p[i] + "transform", s);

			//Used by jquery.transformable to make dragging of the canvas
			//work correctly
			_$node.setTransform('scalex', zoom);
			_$node.setTransform('scaley', zoom);

			jsPlumb.setZoom(zoom);
		};

		/**
		 * Get zoom level
		 * @returns {number}
		 */
		this.getZoom = function () {
			return _zoom;
		};

		/**
		 * Reset the currently mounted tool back to the Move Tool
		 */
		this.resetTool = function () {
			var operation = new ToolSelectOperation(MoveTool.TYPE);

			_iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
			this.mountTool(MoveTool.TYPE);
			//this.callListeners(CONFIG.CANVAS.LISTENERS.RESET);
		};

		/**
		 * Create a new node and draw it on the canvas
		 * @param {string} type Type of node
		 * @param {Number} left x-coordinate of node position
		 * @param {number} top y-coordinate of node position
		 * @param {number} width Width of node
		 * @param {number} height Height of node
		 * @param {number} [zIndex] Position of node on z-axis
		 * @param {object} [json] representation of node
         * @param {string} identifier the identifier of the node, if null a new id is generated
         * @param {string} toCanvas the canvas the node is added to e.g. CONFIG.WIDGET.NAME.MAIN OR CONFIG.WIDGET.NAME.VIEWCANVAS
         * @param {string} viewId  the viewId the node is added to
		 * @return {number} id of new node
		 */
		this.createNode = function (type, left, top, width, height, zIndex, json, identifier, toCanvas, viewId) {
            var id;
            if(identifier)
                id = identifier;
            else
			 id= Util.generateRandomId(24);
			zIndex = zIndex || AbstractEntity.maxZIndex + 1;
			var operation = new NodeAddOperation(id, type, left, top, width, height, zIndex, json || null,toCanvas, viewId);
			propagateNodeAddOperation(operation);
			return id;
		};

		/**
		 * Create a new edge and draw it on the canvas
		 * @param {string} type Type of edge
		 * @param {canvas_widget.AbstractNode} source Source node entity id
		 * @param {canvas_widget.AbstractNode} target Target node entity id
		 * @param {object} [json] representation of edge
         * @param {string} identifier the identifier of the edge
		 * @return {number} id of new edge
		 */
		this.createEdge = function (type, source, target, json, identifier) {
			//if(source !== target){
			var id = null;
            if(identifier)
                id = identifier;
            else
                id = Util.generateRandomId(24);
			var operation = new EdgeAddOperation(id, type, source, target, json || null);

			propagateEdgeAddOperation(operation);
			return id;
			//}
		};

		/**
		 * Convert current canvas content to PNG image file
		 * @return {string} Data-URI of generated PNG image
		 */
		this.toPNG = function () {
			var $renderedCanvas = $('<canvas></canvas>').insertAfter(_$node).attr('width', _$node.width()).attr('height', _$node.height()),
			ctx = $renderedCanvas[0].getContext('2d'),
			deferred = $.Deferred(),
			promises = [],
			oldZoom = this.getZoom();

			$("#loading").show();

			this.setZoom(1);

			canvasOffset = _$node.offset();

			ctx.beginPath();
			ctx.rect(0, 0, _canvasWidth, _canvasHeight);
			ctx.fillStyle = _$node.css('backgroundColor');
			ctx.fill();

			_.each(_.sortBy($.makeArray(_$node.contents()), function (e) {
					return $(e).css('zIndex');
				}), function (e) {
				var $this = $(e);
				if ($this.attr('id') !== 'modelAttributes') {
					promises.push(convertNodeTreeToCanvas($this, ctx));
				}
			});

			$.when.apply($, promises).then(function () {
				var tempCanvas = document.createElement("canvas"),
				tCtx = tempCanvas.getContext("2d"),
				minLeft = _canvasWidth,
				minTop = _canvasHeight,
				maxRight = 0,
				maxBottom = 0,
				nodes = EntityManager.getNodes(),
				nodeId,
				appearance,
				width,
				height,
				padding = 20,
				nodeExists = false;

				for (nodeId in nodes) {
					if (nodes.hasOwnProperty(nodeId)) {
						nodeExists = true;
						appearance = nodes[nodeId].getAppearance();
						//noinspection JSAccessibilityCheck
						minLeft = Math.min(minLeft, appearance.left);
						minTop = Math.min(minTop, appearance.top);
						//noinspection JSAccessibilityCheck
						maxRight = Math.max(maxRight, appearance.left + appearance.width);
						maxBottom = Math.max(maxBottom, appearance.top + appearance.height);
					}
				}

				if (!nodeExists) {
					minLeft = _canvasWidth / 2;
					minTop = _canvasHeight / 2;
					maxRight = _canvasWidth / 2;
					maxBottom = _canvasHeight / 2;
				}

				minLeft -= padding;
				minTop -= padding;
				maxRight += padding;
				maxBottom += padding;

				width = maxRight - minLeft;
				height = maxBottom - minTop;

				tempCanvas.width = width;
				tempCanvas.height = height;

				tCtx.drawImage($renderedCanvas[0], minLeft, minTop, width, height, 0, 0, width, height);

				that.setZoom(oldZoom);
				$("#loading").hide();
				deferred.resolve(tempCanvas.toDataURL());
			});

			return deferred.promise();
		};

		/**
		 * Draw DOM node onto canvas
		 * @param $node jquery object of node
		 * @param ctx Canvas context
		 * @returns {promise}
		 */
		var convertNodeTreeToCanvas = function ($node, ctx) {

			function drawSVGOnCanvas(ctx, svgMarkup, x, y) {
				var svg = new Blob([svgMarkup], {
						type : "image/svg+xml;charset=utf-8"
					}),
				DOMURL = self.URL || self.webkitURL || self,
				url = DOMURL.createObjectURL(svg),
				img = new Image(),
				deferred = $.Deferred();

				img.onload = function () {
					ctx.drawImage(img, x, y);
					DOMURL.revokeObjectURL(url);
					deferred.resolve();
				};
				img.src = url;
				setTimeout(function () {
					deferred.resolve();
				}, 500);
				return deferred.promise();
			}

			function convertNodeToSVG($node) {

				if ($node[0].nodeType === Node.TEXT_NODE) {
					if ($.trim($node.text()) === '') {
						return $.Deferred().resolve().promise();
					} else {
						$node = $node.wrap($('<span></span>')).parent();
					}
				}

				if (!$node.is(":visible")) {
					return $.Deferred().resolve().promise();
				}

				var height = $node.height(),
				width = $node.width(),
				padding = {
					left : parseInt($node.css('paddingLeft'), 10),
					top : parseInt($node.css('paddingTop'), 10),
					right : parseInt($node.css('paddingRight'), 10),
					bottom : parseInt($node.css('paddingBottom'), 10)
				},
				border = {
					width : parseInt($node.css('borderWidth')),
					color : $node.css('borderColor'),
					left : {
						width : parseInt($node.css('borderLeftWidth')),
						color : $node.css('borderLeftColor')
					},
					top : {
						width : parseInt($node.css('borderTopWidth')),
						color : $node.css('borderTopColor')
					},
					right : {
						width : parseInt($node.css('borderRightWidth')),
						color : $node.css('borderRightColor')
					},
					bottom : {
						width : parseInt($node.css('borderBottomWidth')),
						color : $node.css('borderBottomColor')
					}
				},
				borderMarkup = [],
				backgroundColor = $node.css('backgroundColor'),
				color = $node.css('color'),
				font = $node.css('font'),
				fontSize = parseInt($node.css('fontSize'), 10),
				textDecoration = $node.css('textDecoration').split(' ')[0],
				offset = $node.offset(),
				value,
				textX,
				textY = height,
				textAnchor,
				contents = $node.contents();

				if ($node[0].nodeName.toLowerCase() === 'svg') {

					$node.attr('width', width);
					$node.attr('height', height);

					return drawSVGOnCanvas(
						ctx,
						$node[0].outerHTML
						.replace(/style="[^"]*"/, "")
						.replace(/http:\/\/www\.w3\.org\/1999\/xhtml/g, "http://www.w3.org/2000/svg"),
						offset.left - canvasOffset.left,
						offset.top - canvasOffset.top);
				}

				if (contents.length === 1 && contents[0].nodeType === Node.TEXT_NODE) {
					value = $node.text();
				} else {
					value = $node.val();
				}

				var tagsToReplace = {
					'&' : '&amp;',
					'<' : '&lt;',
					'>' : '&gt;'
				};

				value = $.trim(value).replace(/[&<>]/g, function (tag) {
						return tagsToReplace[tag] || tag;
					});

				switch ($node.css('textAlign')) {
				case "right":
					textX = width;
					textAnchor = "right";
					break;
				case "center":
					textX = width / 2;
					textAnchor = "middle";
					break;
				default:
				case "left":
					textX = 0;
					textAnchor = "left";
					break;

				}

				textX += padding.left;
				textY += padding.top + border.width - Math.ceil((height - fontSize) / 2) - 1;
				height += padding.top + padding.bottom + 2 * border.width;
				width += padding.left + padding.right + 2 * border.width;

				if (border.color.split(' ').length !== 1 || border.width.split(' ').length !== 1) {
					border.width = 0;
					if (border.left.width > 0) {
						borderMarkup.push('<line x1="0" y1="0" x2="0" y2="' + height + '" style="stroke:' + border.left.color + '; stroke-width:' + border.left.width + '" />');
					}
					if (border.top.width > 0) {
						borderMarkup.push('<line x1="0" y1="0" x2="' + width + '" y2="0" style="stroke:' + border.top.color + '; stroke-width:' + border.top.width + '" />');
					}
					if (border.right.width > 0) {
						borderMarkup.push('<line x1="' + width + '" y1="0" x2="' + width + '" y2="' + height + '" style="stroke:' + border.right.color + '; stroke-width:' + border.right.width + '" />');
					}
					if (border.bottom.width > 0) {
						borderMarkup.push('<line x1="0" y1="' + height + '" x2="' + width + '" y2="' + height + '" style="stroke:' + border.bottom.color + '; stroke-width:' + border.bottom.width + '" />');
					}
				}

				return drawSVGOnCanvas(
					ctx,
					'<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
					'<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' + backgroundColor + '" style="stroke: ' + border.color + '; stroke-width: ' + border.width + '"/>' +
					borderMarkup.join('\n') +
					'<text x="' + textX + '" y="' + textY + '" fill="' + color + '" style="text-anchor: ' + textAnchor + '; font: ' + font + '; text-decoration: ' + textDecoration + ';">' + value + '</text>' +
					'</svg>',
					offset.left - canvasOffset.left,
					offset.top - canvasOffset.top);
			}

			var contents = $node.contents();

			return convertNodeToSVG($node).then(function () {
				var promises = [];
				if (contents.length !== 1 || contents[0].nodeType !== Node.TEXT_NODE) {
					contents.each(function () {
						var $this = $(this);
						if ($node[0].nodeName.toLowerCase() !== 'svg') {
							promises.push(convertNodeTreeToCanvas($this, ctx));
						}
					});
				}
				return $.when.apply($, promises).then(function () {
					return true;
				});
			});
		};

		/**
		 * Register inter widget communication callbacks
		 */
		this.registerCallbacks = function () {
			_iwcot.registerOnRemoteDataReceivedCallback(remoteNodeAddCallback);
			_iwcot.registerOnRemoteDataReceivedCallback(remoteEdgeAddCallback);
			_iwcot.registerOnLocalDataReceivedCallback(localToolSelectCallback);
			_iwcot.registerOnLocalDataReceivedCallback(localExportDataCallback);
			_iwcot.registerOnLocalDataReceivedCallback(localExportMetaModelCallback);
			_iwcot.registerOnLocalDataReceivedCallback(localExportImageCallback);
			_iwcot.registerOnHistoryChangedCallback(historyNodeAddCallback);
			_iwcot.registerOnHistoryChangedCallback(historyEdgeAddCallback);
		};

		/**
		 * Unregister inter widget communication callbacks
		 */
		this.unregisterCallbacks = function () {
			_iwcot.unregisterOnRemoteDataReceivedCallback(remoteNodeAddCallback);
			_iwcot.unregisterOnRemoteDataReceivedCallback(remoteEdgeAddCallback);
			_iwcot.unregisterOnLocalDataReceivedCallback(localToolSelectCallback);
			_iwcot.unregisterOnLocalDataReceivedCallback(localExportDataCallback);
			_iwcot.unregisterOnLocalDataReceivedCallback(localExportMetaModelCallback);
			_iwcot.unregisterOnLocalDataReceivedCallback(localExportImageCallback);
			_iwcot.unregisterOnHistoryChangedCallback(historyNodeAddCallback);
			_iwcot.unregisterOnHistoryChangedCallback(historyEdgeAddCallback);
		};

		init();

		if (_iwcot) {
			that.registerCallbacks();
		}

	}

	return Canvas;

});
