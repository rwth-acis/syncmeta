define([
    'jqueryui',
    'jsplumb',
    'iwcw',
    'Util',
    'operations/ot/NodeAddOperation',
    'operations/ot/EdgeAddOperation',
    'operations/non_ot/ToolSelectOperation',
    'operations/non_ot/EntitySelectOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/ExportDataOperation',
    'operations/non_ot/ExportMetaModelOperation',
    'operations/non_ot/ExportLogicalGuidanceRepresentationOperation',
    'operations/non_ot/ExportImageOperation',
    'operations/non_ot/PerformCvgOperation',
    'operations/non_ot/DeleteCvgOperation',
    'operations/non_ot/ShowGuidanceBoxOperation',
    'operations/non_ot/CanvasViewChangeOperation',
    'operations/non_ot/RevokeSharedActivityOperation',
    'operations/non_ot/MoveCanvasOperation',
    'operations/non_ot/GuidanceStrategyOperation',
    'canvas_widget/AbstractEntity',
    'canvas_widget/ModelAttributesNode',
    'canvas_widget/EntityManager',
    'canvas_widget/HistoryManager',
    'canvas_widget/AbstractCanvas',
    'canvas_widget/MoveTool',
    'canvas_widget/guidance_modeling/GuidanceBox',
    'canvas_widget/guidance_modeling/SelectToolGuidance',
    'canvas_widget/guidance_modeling/SetPropertyGuidance',
    'canvas_widget/guidance_modeling/GhostEdgeGuidance',
    'canvas_widget/guidance_modeling/CollaborationGuidance',
    'jquery.transformable-PATCHED'
], /** @lends Canvas */
function ($, jsPlumb, IWCW, Util, NodeAddOperation, EdgeAddOperation, ToolSelectOperation, EntitySelectOperation, ActivityOperation, ExportDataOperation, ExportMetaModelOperation,ExportLogicalGuidanceRepresentationOperation, ExportImageOperation,PerformCvgOperation, DeleteCvgOperation,ShowGuidanceBoxOperation,CanvasViewChangeOperation,RevokeSharedActivityOperation,MoveCanvasOperation,GuidanceStrategyOperation, AbstractEntity, ModelAttributesNode, EntityManager, HistoryManager,AbstractCanvas, MoveTool, GuidanceBox,SelectToolGuidance, SetPropertyGuidance, GhostEdgeGuidance,CollaborationGuidance) {

    Canvas.prototype = new AbstractCanvas();
    Canvas.prototype.constructor = Canvas;

    /**
     * Canvas
     * @class canvas_widget.Canvas
     * @extends canvas_widget.AbstractCanvas
     * @memberof canvas_widget
     * @constructor
     * @param {jQuery} $node jquery Selector of canvas node
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
        var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Entity currently selected
         * @type {canvas_widget.AbstractNode|canvas_widget/AbstractEdge}
         * @private
         */
        var _selectedEntity = null;

        /**
         * Offset of the DOM node representating the canvas
         * @type {{left: number, top: number, right: number, bottom: number}}
         */
        var canvasOffset = _$node.offset();

        var _guidanceBox = null;
        var _guidanceBoxLabel = "";
        var _guidanceDefinition = null;
        var _ghostEdges = [];
        var _guidanceBoxEntityId = null;

        $(window).resize(function(){
            sendViewChangeOperation();
        });

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
         * @param {boolean} isRemote
         */
        var processNodeAddOperation = function(operation){
            var node;
            if (operation.getJSON()) {
                node = EntityManager.createNodeFromJSON(operation.getType(), operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex(), operation.getJSON());
            } else {
                node = EntityManager.createNode(operation.getType(), operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex());
            }
            if(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] !== operation.getJabberId()){
                var color = _iwcw.getUserColor(operation.getJabberId());
                node.refreshTraceAwareness(color);
            }

            if(y){
                y.share.nodes.get(node.getEntityId()).then(function(map){
                    node.registerYMap(map);

                    node.draw();
                    node.addToCanvas(that);
                    that.remountCurrentTool();
                });
            }
            else {
                node.draw();
                node.addToCanvas(that);
                that.remountCurrentTool();
            }
        };

        /**
         * Propagate a Node Add Operation to the remote users and the local widgets
         * @param {operations.ot.NodeAddOperation} operation
         */
        var propagateNodeAddOperation = function (operation) {
            processNodeAddOperation(operation);

            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.getOTOperation());
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.HEATMAP,operation.getOTOperation());
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                "NodeAddActivity",
                operation.getEntityId(),
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                NodeAddOperation.getOperationDescription(operation.getType()), {
                    nodeType : operation.getType()
                }).toNonOTOperation());
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

            if(y){
                y.share.edges.get(edge.getEntityId()).then(function(map){
                    edge.registerYMap(map);
                    edge.connect();
                    edge.addToCanvas(that);
                    that.remountCurrentTool();
                })
            }else {
                edge.connect();
                edge.addToCanvas(that);
                that.remountCurrentTool();
            }
        };

        /**
         * Propagate an Edge Add Operation to the remote users and the local widgets
         * @param {operations.ot.EdgeAddOperation} operation
         */
        var propagateEdgeAddOperation = function (operation) {
            var sourceNode = EntityManager.findNode(operation.getSource());
            var targetNode = EntityManager.findNode(operation.getTarget());

            processEdgeAddOperation(operation);

            //if(_iwcw.sendRemoteOTOperation(operation)){
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.getOTOperation());
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                "EdgeAddActivity",
                operation.getEntityId(),
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                EdgeAddOperation.getOperationDescription(operation.getType(), "", sourceNode.getLabel().getValue().getValue(), sourceNode.getType(), targetNode.getType(), targetNode.getLabel().getValue().getValue()), {
                    nodeType : operation.getType(),
                    sourceNodeId : operation.getSource(),
                    sourceNodeLabel : sourceNode.getLabel().getValue().getValue(),
                    sourceNodeType : sourceNode.getType(),
                    targetNodeId : operation.getTarget(),
                    targetNodeLabel : targetNode.getLabel().getValue().getValue(),
                    targetNodeType : targetNode.getType()
                }).toNonOTOperation());
            //}
        };

        /**
         * Callback for a remote Node Add Operation
         * @param {operations.ot.NodeAddOperation} operation
         */

        var remoteNodeAddCallback = function (operation) {
            if (operation instanceof NodeAddOperation) {
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.HEATMAP,operation.getOTOperation());
                if(operation.getViewId() === EntityManager.getViewId() || EntityManager.getLayer() === CONFIG.LAYER.META) {
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
                        "NodeAddActivity",
                        operation.getEntityId(),
                        operation.getJabberId(),
                        NodeAddOperation.getOperationDescription(operation.getType()), {
                            nodeType: operation.getType()
                        }).toNonOTOperation());
                    processNodeAddOperation(operation);

                } else if(EntityManager.getLayer() === CONFIG.LAYER.MODEL) {

                    var type, node, viewType;

                    if(!operation.getViewId()){
                        type = operation.getType();
                    }
                    else{
                        type = operation.getOriginType();
                    }

                    if(EntityManager.getViewId()){
                        viewType = EntityManager.getNodeType(type).VIEWTYPE;
                        if(viewType){
                            type = viewType;
                        }
                    }
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
                        "NodeAddActivity",
                        operation.getEntityId(),
                        operation.getJabberId(),
                        NodeAddOperation.getOperationDescription(type), {
                            nodeType: type
                        }).toNonOTOperation());

                    //processNodeAddOperation
                    if (operation.getJSON()) {
                        node = EntityManager.createNodeFromJSON(type, operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex(), operation.getJSON());
                    } else {
                        node = EntityManager.createNode(type, operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), operation.getZIndex());
                    }

                    node.draw();
                    node.addToCanvas(that);

                    //if we are in a view but the view type got no mapping in this view -> hide the element
                    if(!viewType && EntityManager.getViewId()){
                        node.hide();
                    }
                    that.remountCurrentTool();

                }
            }
        };

        var sendViewChangeOperation = function(){
            var canvasFrame = $("#canvas-frame");
            var operation = new CanvasViewChangeOperation(_$node.position().left, _$node.position().top, canvasFrame.width(), canvasFrame.height(), _zoom);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.HEATMAP,operation.toNonOTOperation());
        };

        /**
         * Callback for a remote Edge Add Operation
         * @param {operations.ot.EdgeAddOperation} operation
         */
        var remoteEdgeAddCallback = function (operation) {
            if (operation instanceof EdgeAddOperation) {
                var sourceNode = EntityManager.findNode(operation.getSource());
                var targetNode = EntityManager.findNode(operation.getTarget());

                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());

                if(operation.getViewId() === EntityManager.getViewId() || EntityManager.getLayer() === CONFIG.LAYER.META) {
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, new ActivityOperation(
                        "EdgeAddActivity",
                        operation.getEntityId(),
                        operation.getJabberId(),
                        EdgeAddOperation.getOperationDescription(operation.getType(), "", sourceNode.getLabel().getValue().getValue(), sourceNode.getType(), targetNode.getLabel().getValue().getValue(), targetNode.getType()), {
                            nodeType: operation.getType(),
                            sourceNodeId: operation.getSource(),
                            sourceNodeLabel: sourceNode.getLabel().getValue().getValue(),
                            sourceNodeType: sourceNode.getType(),
                            targetNodeId: operation.getTarget(),
                            targetNodeLabel: targetNode.getLabel().getValue().getValue(),
                            targetNodeType: targetNode.getType()
                        }).toNonOTOperation());
                    processEdgeAddOperation(operation);

                }
                else if(EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                    var type, edge, viewType;

                    if(!operation.getViewId()){
                        type = operation.getType();
                    }
                    else{
                        type = operation.getOriginType();
                    }

                    if(EntityManager.getViewId()){
                        viewType = EntityManager.getEdgeType(type).VIEWTYPE;
                        if(viewType){
                            type = viewType;
                        }
                    }


                    if (operation.getJSON()) {
                        edge = EntityManager.createEdgeFromJSON(type, operation.getEntityId(), operation.getSource(), operation.getTarget(), operation.getJSON());
                    } else {
                        edge = EntityManager.createEdge(type, operation.getEntityId(), EntityManager.findNode(operation.getSource()), EntityManager.findNode(operation.getTarget()));
                    }

                    edge.connect();
                    edge.addToCanvas(that);

                    //if we are in a view but the view type got no mapping in this view -> hide the element
                    if(!viewType && EntityManager.getViewId()){
                        edge.hide();
                    }
                    that.remountCurrentTool();
                }
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

        var localShowGuidanceBoxCallback = function(operation){
            if(operation instanceof ShowGuidanceBoxOperation){
                processShowGuidanceBoxOperation(operation);
            }
        };

        var processShowGuidanceBoxOperation = function(operation){
            _guidanceDefinition = operation.getGuidance();
            _guidanceBoxLabel = operation.getLabel();
            that.showGuidanceBox(operation.getEntityId());
        };

        /**
         * Callback for a local Export Data Operation
         * @param {operations.non_ot.ExportDataOperation} operation
         */
        var localExportDataCallback = function (operation) {
            if (operation instanceof ExportDataOperation) {
                operation.setData(EntityManager.graphToJSON());
                _iwcw.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
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
                    _iwcw.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
                } else {
                    var data = operation.getData();
                    var op = new ActivityOperation(
                        "EditorGenerateActivity",
                        "-1",
                        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                        "..generated new Editor <a href=\"" + data.spaceURI + "\" target=\"_blank\">" + data.spaceTitle + "</a>", {}).toNonOTOperation();
                    //TODO
                    //_iwcw.sendRemoteNonOTOperation(op);
                    _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, op);
                }

            }
        };

        var localMoveCanvasOperation = function(operation){
            if(operation instanceof MoveCanvasOperation){
                that.scrollNodeIntoView(operation.getObjectId(), operation.getTransition());
            }
        };

        var localExportLogicalGuidanceRepresentationCallback = function(operation){
            if(operation instanceof ExportLogicalGuidanceRepresentationOperation){
                if(operation.getData() === null){
                    operation.setData(EntityManager.generateLogicalGuidanceRepresentation());
                    _iwcw.sendLocalNonOTOperation(operation.getRequestingComponent(),operation.toNonOTOperation());
                } else {
                    //Do nothing here
                }

            }
        };

        var localGuidanceStrategyOperationCallback = function(operation){
            if(operation instanceof GuidanceStrategyOperation){
                //Just forward the message to remote users
                //TODO
                //_iwcw.sendRemoteNonOTOperation(operation.toNonOTOperation());
            }
        };

        var localRevokeSharedActivityOperationCallback = function(operation){
            if(operation instanceof RevokeSharedActivityOperation){
                //Just forward the message to remote users
                //TODO
                //_iwcw.sendRemoteNonOTOperation(operation.toNonOTOperation());
            }
        };

        var remoteGuidanceStrategyOperation = function(operation){
            if(operation instanceof GuidanceStrategyOperation){
                //Just forward the message to the local guidance widget
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.toNonOTOperation());
            }
        };

        var remoteRevokeSharedActivityOperationCallback = function(operation){
            if(operation instanceof RevokeSharedActivityOperation){
                //Just forward the message to the local guidance widget
                _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.toNonOTOperation());
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
                    _iwcw.sendLocalNonOTOperation(operation.getRequestingComponent(), operation.toNonOTOperation());
                });
            }
        };

        /**
         * Callback for an undone resp. redone Node Add Operation
         * @param {operations.ot.NodeAddOperation} operation
         */

        var historyNodeAddCallback = function(operation){
            if(operation instanceof NodeAddOperation){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.getOTOperation());
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.HEATMAP,operation.getOTOperation());
                processNodeAddOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Edge Add Operation
         * @param {operations.non_ot.EdgeAddOperation} operation
         */

        var historyEdgeAddCallback = function(operation){
            if(operation instanceof EdgeAddOperation){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.getOTOperation());
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
                start : function () {
                    _$node.draggable("option", "containment", [-_canvasWidth + $canvasFrame.width(), -_canvasHeight + $canvasFrame.height(), 0, 0]);
                    _$node.draggable("option", "containment", [-_canvasWidth + $canvasFrame.width(), -_canvasHeight + $canvasFrame.height(), 0, 0]);
                },
                drag: function(event, ui) {

                    //ui.position.left = Math.round(ui.position.left  / _zoom);
                    //ui.position.top = Math.round(ui.position.top / _zoom);
                },
                stop: function(){
                    sendViewChangeOperation();

                }
            });


            if(_$node.transformable != null){ // since recently, this method doesnt exist anymore.  BUGFIX
                _$node.transformable({
                    rotatable: false,
                    skewable: false,
                    scalable: false
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

        this.showGuidanceBox = function(entityId){
            this.hideGuidanceBox();
            var entity;
            if(typeof(entityId) == 'undefined'){
                entityId = _guidanceBoxEntityId;
            }
            else{
                _guidanceBoxEntityId = entityId;
            }
            if(_guidanceDefinition === null)
                return;
            if(_guidanceDefinition.length == 0)
                return;
            if(!entityId)
                entityId = _selectedEntity.getEntityId();

            entity = EntityManager.findNode(entityId);
            if(!entity)
                return;

            var itemWidth = 100;
            var itemHeight = 100;
            var entityAppearance = entity.getAppearance();
            var appearance = {
                top: entityAppearance.top,
                left: entityAppearance.left,
                width: entityAppearance.width,
                height: entityAppearance.height
            };
            appearance.top += entityAppearance.height + 10;
            appearance.left += entityAppearance.width / 2;
            _guidanceBox = new GuidanceBox(Util.generateRandomId(), _guidanceBoxLabel, appearance.left, appearance.top);
            var inView = false;
            if(EntityManager.getViewId() != null && EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                inView = true;
            }
            for(var i = 0; i < _guidanceDefinition.length; i++){
                var guidanceItem = null;
                switch(_guidanceDefinition[i].type){
                    case "SELECT_TOOL_GUIDANCE":
                        var tool;
                        if(inView && EntityManager.getNodeType(_guidanceDefinition[i].tool).VIEWTYPE === null)
                            continue;
                        else if(inView)
                            tool = EntityManager.getNodeType(_guidanceDefinition[i].tool).VIEWTYPE;
                        else
                            tool = _guidanceDefinition[i].tool;

                        guidanceItem = new SelectToolGuidance(_guidanceDefinition[i].id, _guidanceDefinition[i].label, tool, that, _guidanceDefinition[i].icon);
                        break;
                    case "SET_PROPERTY_GUIDANCE":
                        var entity = EntityManager.findNode(_guidanceDefinition[i].entityId);
                        if(!entity)
                            entity = EntityManager.findEdge(_guidanceDefinition[i].entityId);
                        guidanceItem = new SetPropertyGuidance(_guidanceDefinition[i].id, _guidanceDefinition[i].label, entity, _guidanceDefinition[i].propertyName, that);
                        break;
                    case "COLLABORATION_GUIDANCE":
                        guidanceItem = new CollaborationGuidance("", _guidanceDefinition[i].label, _guidanceDefinition[i].activityId, _guidanceDefinition[i].objectId, that);
                        break;
                    case "GHOST_EDGE_GUIDANCE":
                        var relationshipType;
                        if(inView && EntityManager.getEdgeType(_guidanceDefinition[i].relationshipType).VIEWTYPE === undefined)
                            continue;
                        else if(inView){
                            relationshipType = EntityManager.getEdgeType(_guidanceDefinition[i].relationshipType).VIEWTYPE;
                        }
                        else {
                            relationshipType = _guidanceDefinition[i].relationshipType;
                        }
                        that.showGhostEdge(_guidanceDefinition[i].sourceId, _guidanceDefinition[i].targetId, relationshipType);
                        break;
                }
                if(guidanceItem)
                    _guidanceBox.addGuidance(guidanceItem);
            }

            _guidanceBox.addToCanvas(that);
            _guidanceBox.draw();
        };

        this.hideGuidanceBox = function(){
            if(_guidanceBox !== null)
                _guidanceBox.remove();
            _guidanceBox = null;
            for(var i = 0; i < _ghostEdges.length; i++){
                _ghostEdges[i].remove();
            }
            _ghostEdges = [];
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
                                hide:{
                                    name:"Hide entities..",
                                    items: {
                                        nodes: {
                                            name: "nodes..",
                                            items: EntityManager.generateVisibilityNodeMenu('hide')
                                        },
                                        edges: {
                                            name: "edges..",
                                            items: EntityManager.generateVisibilityEdgeMenu('hide')
                                        }
                                    }
                                },
                                show:{
                                    name:"Show entities..",
                                    items: {
                                        nodes: {
                                            name: "nodes..",
                                            items: EntityManager.generateVisibilityNodeMenu('show')
                                        },
                                        edges: {
                                            name: "edges..",
                                            items: EntityManager.generateVisibilityEdgeMenu('show')
                                        }
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
            //this.select(null);

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
            }
            var operation = new EntitySelectOperation(entity ? entity.getEntityId() : null, entity ? entity.getType() : null,_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.toNonOTOperation());
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,operation.toNonOTOperation());
            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.GUIDANCE,operation.toNonOTOperation());

            if(entity === null) {
                if(_selectedEntity)
                    _selectedEntity.getYMap().set(EntitySelectOperation.TYPE, operation.toJSON());
            }
            else {
                entity.getYMap().set(EntitySelectOperation.TYPE, operation.toJSON());

            }
            _selectedEntity = entity;

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
            if (zoom < 0.1 || zoom > 2) {
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
            sendViewChangeOperation();
        };

        this.showGhostEdge = function(sourceId, targetId, relationshipType){
            var source = EntityManager.findNode(sourceId);
            var target = EntityManager.findNode(targetId);
            if(!source || !target) {
                //console.error('GhostEdge guidance not possible. Bad params: src' + source + ' target: ' + target + ' type: ' + relationshipType);
                return;
            }
            var ghostEdgeGuidance = null;
            //Check if there already is a ghost edge between the two nodes
            for(var i = 0; i < _ghostEdges.length; i++){
                var ghostEdge = _ghostEdges[i];
                var node1 = ghostEdge.getNode1();
                var node2 = ghostEdge.getNode2();
                if((source == node1 && target == node2) || (source == node2 && target == node1)){
                    ghostEdgeGuidance = ghostEdge;
                    break;
                }
            }
            if(!ghostEdgeGuidance){
                ghostEdgeGuidance = new GhostEdgeGuidance(that, source, target);
                _ghostEdges.push(ghostEdgeGuidance);
            }
            if(EntityManager.getViewId() !== null && EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                ghostEdgeGuidance.addEdge(EntityManager.getViewEdgeType(relationshipType), source, target);
            }
            else {
                ghostEdgeGuidance.addEdge(EntityManager.getEdgeType(relationshipType), source, target);
            }
            for(var i = 0; i < _ghostEdges.length; i++){
                _ghostEdges[i].show();
            }
        };

        this.highlightEntity = function(entityId){
            var entity = EntityManager.findNode(entityId);

            if(entity)
                entity.highlight("blue", "Set property");
            else{
                entity = EntityManager.findEdge(entityId);
                entity.highlight("blue");
            }
        };

        this.unhighlightEntity = function(entityId){
            var entity = EntityManager.findNode(entityId);

            if(!entity)
                entity = EntityManager.findEdge(entityId);

            entity.unhighlight();
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

            _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation.toNonOTOperation());
            this.mountTool(MoveTool.TYPE);
            //this.callListeners(CONFIG.CANVAS.LISTENERS.RESET);
        };

        var createYTypeForValueOfAttribute = function(map,id, yType){
            var deferred = $.Deferred();
            map.set(id, yType).then(function(){
                deferred.resolve();
            });
            return deferred.promise();
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
         * @return {number} id of new node
         */
        this.createNode = function (type, left, top, width, height, zIndex, json, identifier) {
            var id, oType = null;
            if(identifier)
                id = identifier;
            else
                id= Util.generateRandomId(24);
            zIndex = zIndex || AbstractEntity.maxZIndex + 1;

            if(EntityManager.getViewId() !== null && EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                oType = EntityManager.getViewNodeType(type).getTargetNodeType().TYPE;
            }
            var operation = new NodeAddOperation(id, type, left, top, width, height, zIndex, json || null, EntityManager.getViewId(), oType);

            if(y){
                y.share.nodes.set(id, Y.Map).then(function(map){
                    //create the label element of the node
                    map.set('left', left);
                    map.set('top', top);
                    map.set('width', width);
                    map.set('height',height);
                    map.set('zIndex', zIndex);

                    if(EntityManager.getLayer() === CONFIG.LAYER.META) {
                        map.set(id + "[label]", Y.Text).then(function () {
                            if (type === 'Node Shape') {
                                var attrColorPromise = createYTypeForValueOfAttribute(map, id + "[color]", Y.Text);
                                var attrAnchorsPromise = createYTypeForValueOfAttribute(map, id + "[customAnchors]", Y.Text);
                                var attrCustomShapePromise = createYTypeForValueOfAttribute(map, id + "[customShape]", Y.Text);
                                $.when(attrColorPromise, attrAnchorsPromise, attrCustomShapePromise).done(function () {
                                    y.share.canvas.set(NodeAddOperation.TYPE, operation.toJSON());
                                });
                            }
                            else if (type === 'Edge Shape') {
                                var attrColorPromise = createYTypeForValueOfAttribute(map, id + "[color]", Y.Text);
                                var attrOverlayPromise = createYTypeForValueOfAttribute(map, id + "[overlay]", Y.Text);

                                $.when(attrColorPromise, attrOverlayPromise).done(function () {
                                    y.share.canvas.set(NodeAddOperation.TYPE, operation.toJSON());
                                });
                            }
                            else {
                                y.share.canvas.set(NodeAddOperation.TYPE, operation.toJSON());
                            }
                        });
                    }
                    else{
                        var attributes = EntityManager.getNodeType(type).getAttributes();
                        var attrPromises = [];
                        for(var attrKey in attributes){
                            if(attributes.hasOwnProperty(attrKey)&& attributes[attrKey].value === 'string'){
                                var attrId =  id+'['+attributes[attrKey].key+']';
                                attrPromises.push(createYTypeForValueOfAttribute(map,attrId.toLowerCase(), Y.Text));
                            }
                        }
                        if(attrPromises.length > 0) {
                            $.when.apply(null, attrPromises).done(function () {
                                y.share.canvas.set(NodeAddOperation.TYPE, operation.toJSON());
                            });
                        }
                        else {
                            y.share.canvas.set(NodeAddOperation.TYPE, operation.toJSON());
                        }
                    }
                })
            }else {
                propagateNodeAddOperation(operation);
            }
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
            var id = null, oType = null;
            if(identifier)
                id = identifier;
            else
                id = Util.generateRandomId(24);
            if(EntityManager.getViewId() !== null && EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                oType = EntityManager.getViewEdgeType(type).getTargetEdgeType().TYPE;
            }
            var operation = new EdgeAddOperation(id, type, source, target, json || null, EntityManager.getViewId(), oType);
            if(y){
                y.share.edges.set(id, Y.Map).then(function(map){
                    map.set(id+"[label]", Y.Text).then(function() {
                        y.share.canvas.set(EdgeAddOperation.TYPE, operation.toJSON());
                    });
                    map.set('id',id);
                    map.set('source', source);
                    map.set('target', target);

                })
            } else {
                propagateEdgeAddOperation(operation);
            }
            return id;
        };

        this.scrollNodeIntoView  = function(nodeId){
            var frameOffset = $("#canvas-frame").offset();
            var frameWidth = $("#canvas-frame").width();
            var frameHeight = $("#canvas-frame").height();

            var node = null;
            if(!nodeId)
                node = _selectedEntity;
            else{
                node = EntityManager.findNode(nodeId);
            }
            if(!node)
                return;
            var nodeOffset = node.get$node().offset();
            var nodeWidth = node.get$node().width();
            var nodeHeight = node.get$node().height();

            var scrollX = nodeOffset.left - frameOffset.left;
            var scrollY = nodeOffset.top - frameOffset.top;
            var canvasTop = _$node.position().top;
            var canvasLeft = _$node.position().left;


            _$node.animate({
                top: "+=" + (frameHeight / 2 - scrollY - nodeHeight / 2),
                left: "+=" + (frameWidth / 2 - scrollX - nodeWidth / 2)
            },1000);
            // _$node.css({
            //     top: canvasTop + frameHeight / 2 - scrollY - nodeHeight / 2,
            //     left: canvasLeft + frameWidth / 2 - scrollX - nodeWidth / 2
            // });
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


            _.each(_.sortBy($.makeArray(_$node.children()),function(e){
                return $(e).css('zIndex');
            }),function(e){
                var $this = $(e);
                if(typeof($this.attr('id')) === 'undefined' ||
                    (!$this.attr('id').startsWith('modelAttributes') &&
                    !$this.attr('id').endsWith('awareness'))){
                    promises.push(convertNodeTreeToCanvas($this,ctx));
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
            _iwcw.registerOnDataReceivedCallback(localToolSelectCallback);
            _iwcw.registerOnDataReceivedCallback(localExportDataCallback);
            _iwcw.registerOnDataReceivedCallback(localExportMetaModelCallback);
            _iwcw.registerOnDataReceivedCallback(localExportLogicalGuidanceRepresentationCallback);
            _iwcw.registerOnDataReceivedCallback(localExportImageCallback);
            _iwcw.registerOnDataReceivedCallback(localShowGuidanceBoxCallback);


            _iwcw.registerOnDataReceivedCallback(localRevokeSharedActivityOperationCallback);
            _iwcw.registerOnDataReceivedCallback(localMoveCanvasOperation);
            _iwcw.registerOnDataReceivedCallback(localGuidanceStrategyOperationCallback);

            _iwcw.registerOnDataReceivedCallback(CvgCallback);
            _iwcw.registerOnDataReceivedCallback(DeleteCvgCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function () {
            _iwcw.unregisterOnDataReceivedCallback(localToolSelectCallback);
            _iwcw.unregisterOnDataReceivedCallback(localExportDataCallback);
            _iwcw.unregisterOnDataReceivedCallback(localExportMetaModelCallback);
            _iwcw.unregisterOnDataReceivedCallback(localExportLogicalGuidanceRepresentationCallback);
            _iwcw.unregisterOnDataReceivedCallback(localExportImageCallback);
            _iwcw.unregisterOnDataReceivedCallback(localShowGuidanceBoxCallback);

            _iwcw.unregisterOnDataReceivedCallback(CvgCallback);
            _iwcw.unregisterOnDataReceivedCallback(DeleteCvgCallback);

            _iwcw.unregisterOnLocalDataReceivedCallback(localRevokeSharedActivityOperationCallback);
            _iwcw.unregisterOnLocalDataReceivedCallback(localMoveCanvasOperation);
            _iwcw.unregisterOnLocalDataReceivedCallback(localGuidanceStrategyOperationCallback);

        };

        /**
         * visualizes the results of a CVG operation.
         * CVG is computed on the attribute widget
         * @param {operation.non_ot.PerformCvgOperation} operation
         * @constructor
         */
        function CvgCallback(operation){
            if(operation instanceof PerformCvgOperation){
                require(['canvas_widget/ClosedViewGeneration'], function(CVG) {
                    CVG(that, operation.getJSON());
                });
            }
        }

        /**
         * Deletes the result of a CVG result on the canvas
         * @param {operation.non_ot.DeleteCvgOperation} operation
         * @constructor
         */
        function DeleteCvgCallback(operation){
            if(operation instanceof DeleteCvgOperation){
                var deleteList = operation.getDeleteList();
                for(var i=0;i<deleteList.length;i++){
                    var node = EntityManager.findNode(deleteList[i]);
                    node.triggerDeletion();
                }
            }
        }

        init();

        if(y){
            y.share.canvas.observe(function(events){
                var triggerSave = false;
                for(var i in events){
                    var event =events[i];
                    var operation;
                    var data = y.share.canvas.get(event.name);
                    var jabberId = y.share.users.get(event.object.map[event.name][0]);

                    switch(event.name){
                        case NodeAddOperation.TYPE:{
                            operation = new NodeAddOperation(data.id,data.type,data.left, data.top,data.width,data.height,data.zIndex,data.json,data.viewId,data.oType,jabberId);
                            remoteNodeAddCallback(operation);
                            if(!data.historyFlag)
                                HistoryManager.add(operation);
                            if(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] === jabberId) {
                                triggerSave = true;
                            }
                            break;
                        }
                        case EdgeAddOperation.TYPE:{
                            operation = new EdgeAddOperation(data.id, data.type, data.source, data.target, data.json, data.viewId, data.oType, jabberId);
                            remoteEdgeAddCallback(operation);
                            if(!data.historyFlag)
                                HistoryManager.add(operation);
                            if(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] === jabberId) {
                                triggerSave = true;
                            }
                            break;
                        }
                        case RevokeSharedActivityOperation.TYPE:{
                            if(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] !== jabberId) {
                                operation = new RevokeSharedActivityOperation(data.id);
                                remoteRevokeSharedActivityOperationCallback(operation);
                            }
                            break;
                        }
                        case GuidanceStrategyOperation.TYPE:{
                            if(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] !== jabberId) {
                                operation = new GuidanceStrategyOperation(data.data);
                                remoteGuidanceStrategyOperation(operation);
                            }
                            break;
                        }
                    }
                }
                if(triggerSave)
                    $('#save').click();
            })

        }
        if(_iwcw){
            that.registerCallbacks();
        }

    }

    return Canvas;

});
