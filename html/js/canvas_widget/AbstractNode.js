define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'iwcotw',
    'operations/ot/NodeDeleteOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeMoveZOperation',
    'operations/ot/NodeResizeOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/EntitySelectOperation',
    'canvas_widget/AbstractEntity',
    'canvas_widget/SingleValueAttribute',
    'text!templates/canvas_widget/abstract_node.html',
    'jquery.transformable'
],/** @lends AbstractNode */function(require,$,jsPlumb,_,Util,IWCOT,NodeDeleteOperation,NodeMoveOperation,NodeMoveZOperation,NodeResizeOperation,ActivityOperation,EntitySelectOperation,AbstractEntity,SingleValueAttribute,abstractNodeHtml) {

    AbstractNode.prototype = new AbstractEntity();
    AbstractNode.prototype.constructor = AbstractNode;
    /**
     * AbstractNode
     * @class canvas_widget.AbstractNode
     * @extends canvas_widget.AbstractEntity
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {string} type Type of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     */
    function AbstractNode(id,type,left,top,width,height,zIndex){
        var that = this;

        AbstractEntity.call(this,id);

        /**
         * Type of node
         * @type {string}
         * @private
         */
        var _type = type;

        /**
         * Label of edge
         * @type {canvas_widget.SingleValueAttribute}
         * @private
         */
        var _label = new SingleValueAttribute(id+"[label]","Label",this);

        /**
         * Appearance information of edge
         * @type {{left: number, top: number, width: number, height: number}}
         * @private
         */
        var _appearance = {
            left: left,
            top: top,
            width: width,
            height: height
        };

        /**
         * Position of node on z-axis
         * @type {number}
         * @private
         */
        var _zIndex = zIndex;

        /**
         * Canvas the node is drawn on
         * @type {canvas_widget.AbstractCanvas}
         * @private
         */
        var _canvas = null;

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(abstractNodeHtml,{id: id}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Attributes of node
         * @type {Object}
         * @private
         */
        var _attributes = {};

        /**
         * Stores if node is selected
         * @type {boolean}
         * @private
         */
        var _isSelected = false;

        /**
         * Stores current highlighting color
         * @type {string}
         * @private
         */
        var _highlightColor = null;

        /**
         * Stores current highlighting user name
         * @type {string}
         * @private
         */
        var _highlightUsername = null;

        /**
         * Callback to generate list of context menu items
         * @type {function}
         */
        var _contextMenuItemCallback = function(){return{};};

        /**
         * Set of ingoing edges
         * @type {Object}
         * @private
         */
        var _ingoingEdges = {};

        /**
         * Set of outgoing edges
         * @type {Object}
         * @private
         */
        var _outgoingEdges = {};

        /**
         * Set of nodes with an edge to the node
         * @type {Object}
         * @private
         */
        var _ingoingNeighbors = {};

        /**
         * Set of nodes with an edge from the node
         * @type {Object}
         * @private
         */
        var _outgoingNeighbors = {};

        /**
         * Apply a Node Move Operation
         * @param {operations.ot.NodeMoveOperation} operation
         */
        var processNodeMoveOperation = function(operation){
            that.move(operation.getOffsetX(),operation.getOffsetY(),0);
        };

        /**
         * Apply a Node Move Z Operation
         * @param {operations.ot.NodeMoveZOperation} operation
         */
        var processNodeMoveZOperation = function(operation){
            that.move(0,0,operation.getOffsetZ());
        };

        /**
         * Propagate a Node Move Operation to the remote users and the local widgets
         * @param {operations.ot.NodeMoveOperation} operation
         */
        var propagateNodeMoveOperation = function(operation){
            processNodeMoveOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeMoveActivity",
                    operation.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    NodeMoveOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
            }
        };

        /**
         * Propagate a Node Move Z Operation to the remote users and the local widgets
         * @param {operations.ot.NodeMoveZOperation} operation
         */
        var propagateNodeMoveZOperation = function(operation){
            processNodeMoveZOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeMoveActivity",
                    operation.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    NodeMoveOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
            }
        };

        /**
         * Apply a Node Resize Operation
         * @param {operations.ot.NodeResizeOperation} operation
         */
        var processNodeResizeOperation = function(operation){
            that.resize(operation.getOffsetX(),operation.getOffsetY());
        };

        /**
         * Propagate a Node Resize Operation to the remote users and the local widgets
         * @param {operations.ot.NodeResizeOperation} operation
         */
        var propagateNodeResizeOperation = function(operation){
            processNodeResizeOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeResizeActivity",
                    operation.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    NodeResizeOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
            }
        };

        //noinspection JSUnusedLocalSymbols
        /**
         * Apply a Node Delete Operation
         * @param {operations.ot.NodeDeleteOperation} operation
         */
        var processNodeDeleteOperation = function(operation){
            var edges = that.getEdges(),
                edgeId,
                edge;

            for(edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edge = edges[edgeId];
                    edge.remove();
                }
            }
            that.remove();
        };

        /**
         * Propagate a Node Delete Operation to the remote users and the local widgets
         * @param {operations.ot.NodeDeleteOperation} operation
         */
        var propagateNodeDeleteOperation = function(operation){
            processNodeDeleteOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeDeleteActivity",
                    operation.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    NodeDeleteOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {}
                ).toNonOTOperation());
            }
        };

        /**
         * Callback for a remote Entity Select Operation
         * @param {EntitySelectOperation} operation
         */
        var remoteEntitySelectCallback = function(operation){
            var senderJabberId,
                color,
                username;

            if(operation instanceof EntitySelectOperation && operation.getDestination() === CONFIG.WIDGET.NAME.MAIN){
                senderJabberId = operation.getNonOTOperation().getSender();
                color = _iwcot.getUserColor(senderJabberId);
                username = _iwcot.getMembers()[senderJabberId][CONFIG.NS.PERSON.TITLE];
                if(!_isSelected){
                    if(operation.getSelectedEntityId() === that.getEntityId()){
                        _highlightColor = color;
                        _highlightUsername = username;
                        that.highlight(color,username);
                    } else {
                        _highlightColor = null;
                        _highlightUsername = null;
                        that.unhighlight();
                    }
                } else {
                    if(operation.getSelectedEntityId() === that.getEntityId()){
                        _highlightColor = color;
                        _highlightUsername = username;
                    } else {
                        _highlightColor = null;
                        _highlightUsername = null;
                    }
                }
            }
        };

        /**
         * Callback for a remote Node Move Operation
         * @param {operations.ot.NodeMoveOperation} operation
         */
        var remoteNodeMoveCallback = function(operation){
            if(operation instanceof NodeMoveOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeMoveActivity",
                    operation.getEntityId(),
                    operation.getOTOperation().getSender(),
                    NodeMoveOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
                processNodeMoveOperation(operation);
            }
        };

        /**
         * Callback for a remote Node Move Z Operation
         * @param {operations.ot.NodeMoveZOperation} operation
         */
        var remoteNodeMoveZCallback = function(operation){
            if(operation instanceof NodeMoveZOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeMoveActivity",
                    operation.getEntityId(),
                    operation.getOTOperation().getSender(),
                    NodeMoveOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
                processNodeMoveZOperation(operation);
            }
        };

        /**
         * Callback for a remote Node Resize Operation
         * @param {operations.ot.NodeResizeOperation} operation
         */
        var remoteNodeResizeCallback = function(operation){
            if(operation instanceof NodeResizeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeResizeActivity",
                    operation.getEntityId(),
                    operation.getOTOperation().getSender(),
                    NodeResizeOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {nodeType: that.getType()}
                ).toNonOTOperation());
                processNodeResizeOperation(operation);
            }
        };

        /**
         * Callback for a remote Node Delete Operation
         * @param {operations.ot.NodeDeleteOperation} operation
         */
        var remoteNodeDeleteCallback = function(operation){
            if(operation instanceof NodeDeleteOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "NodeDeleteActivity",
                    operation.getEntityId(),
                    operation.getOTOperation().getSender(),
                    NodeDeleteOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue()),
                    {}
                ).toNonOTOperation());
                processNodeDeleteOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Node Move Operation
         * @param {operations.ot.NodeMoveOperation} operation
         */
        var historyNodeMoveCallback = function(operation){
            if(operation instanceof NodeMoveOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processNodeMoveOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Node Move Operation
         * @param {operations.ot.NodeMoveZOperation} operation
         */
        var historyNodeMoveZCallback = function(operation){
            if(operation instanceof NodeMoveZOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processNodeMoveZOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Node Resize Operation
         * @param {operations.ot.NodeResizeOperation} operation
         */
        var historyNodeResizeCallback = function(operation){
            if(operation instanceof NodeResizeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processNodeResizeOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Node Delete Operation
         * @param {operations.ot.NodeDeleteOperation} operation
         */
        var historyNodeDeleteCallback = function(operation){
            if(operation instanceof NodeDeleteOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processNodeDeleteOperation(operation);
            }
        };

        var init = function(){
            //Define Node Rightclick Menu
            $.contextMenu({
                selector: "#"+id,
                zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
                build: function($trigger, e){
                    var menuItems,
                        offsetClick,
                        offsetCanvas;

                    offsetClick = $(e.target).offset();
                   	offsetCanvas = that.getCanvas().get$node().offset();
					
					if(_canvas.getSelectedEntity() === null || _canvas.getSelectedEntity() === that){
                        menuItems = _.extend(_contextMenuItemCallback(),{
                            connectTo: require('canvas_widget/EntityManager').generateConnectToMenu(that),
                            sepMove: "---------",
                            moveToForeground: {
                                name: "Move to Foreground",
                                callback: function(/*key, opt*/){
                                    var operation = new NodeMoveZOperation(that.getEntityId(),++AbstractEntity.maxZIndex-_zIndex);
                                    propagateNodeMoveZOperation(operation);
                                }
                            },
                            moveToBackground: {
                                name: "Move to Background",
                                callback: function(/*key, opt*/){
                                    var operation = new NodeMoveZOperation(that.getEntityId(),--AbstractEntity.minZIndex-_zIndex);
                                    propagateNodeMoveZOperation(operation);
                                }
                            },
                            sepDelete: "---------",
                            delete: {
                                name: "Delete",
                                callback: function(/*key, opt*/){
                                    that.triggerDeletion();
                                }
                            },
                            sepAdd: "-----------",
                            sepAdd2: "-----------",
                            addNode: {
                                name: "Add node..",
                                items: require('canvas_widget/EntityManager').generateAddNodeMenu(that.getCanvas(), e.originalEvent.offsetX+offsetClick.left-offsetCanvas.left, e.originalEvent.offsetY+offsetClick.top-offsetCanvas.top)
                            },
                            copy:{
                                name:'Copy',
                                callback:function(){
                                    var resourceSpace = new openapp.oo.Resource(openapp.param.space());
                                    require(["promise!Space"], function(Space){
                                        resourceSpace.getSubResources({
                                            relation: openapp.ns.role + "data",
                                            type: CONFIG.NS.MY.COPY+":"+Space.user[CONFIG.NS.PERSON.JABBERID],
                                            onAll: function(items) {
                                                for(var i=0;i<items.length;i++) {
                                                    openapp.resource.del(items[i].uri);
                                                }
                                                resourceSpace.create({
                                                    relation: openapp.ns.role + "data",
                                                    type: CONFIG.NS.MY.COPY+":"+Space.user[CONFIG.NS.PERSON.JABBERID],
                                                    representation: that.toJSON()
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        });

                        return {
                            items: menuItems,
                            events: {
                                show: function(/*opt*/){
                                    _canvas.select(that);
                                }
                            }
                        };
                    } else {
                        _canvas.select(null);
                        return false;
                    }

                }
            });

        };

        /**
         * Triggers jsPlumb's repaint function and adjusts the angle of the edge labels
         */
        var repaint = function(){
            //var edgeId,
            //    edges = that.getEdges();
            jsPlumb.repaint(_$node);
            /*for(edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edges[edgeId].repaintOverlays();
                    edges[edgeId].setZIndex();
                }
            }*/
            _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        /**
         * Anchor options for new connections
         * @type {object}
         */
        var _anchorOptions = [ "Perimeter",{ shape:"Rectangle", anchorCount: 10} ];

        /**
         * Get options for new connections
         * @returns {Object}
         */
        this.getAnchorOptions = function(){
            return _anchorOptions;
        };

        /**
         * Send NodeDeleteOperation for node
         */
        this.triggerDeletion = function(){
            var edgeId,
                edges = this.getEdges(),
                edge;

            _canvas.select(null);
            for(edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edge = edges[edgeId];
                    edge.triggerDeletion();
                }
            }
            //noinspection JSAccessibilityCheck
            var operation = new NodeDeleteOperation(id,that.getType(),_appearance.left,_appearance.top,_appearance.width,_appearance.height,_zIndex,that.toJSON());
            propagateNodeDeleteOperation(operation);
            //that.canvas.callListeners(CONFIG.CANVAS.LISTENERS.NODEDELETE,nodeId);
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get callback to generate list of context menu items
         * @returns {object}
         */
        this.getContextMenuItemCallback = function(){
            return _contextMenuItemCallback;
        };

        /**
         * Set callback to generate list of context menu items
         * @param {function} contextMenuItemCallback
         */
        this.setContextMenuItemCallback = function(contextMenuItemCallback){
            if(typeof contextMenuItemCallback === 'function'){
                _contextMenuItemCallback = contextMenuItemCallback;
            }
        };

        /**
         * Get node appearance
         * @returns {{left: number, top: number, width: number, height: number}}
         */
        this.getAppearance = function(){
            return _appearance;
        };

        /**
         * Get position of node on z-axis
         * @return {number}
         */
        this.getZIndex = function(){
            return _zIndex;
        };

        /**
         * Adds node to canvas
         * @param {canvas_widget.AbstractCanvas} canvas
         */
        this.addToCanvas = function(canvas){
            _canvas = canvas;
            canvas.get$canvas().append(_$node);
        };

        /**
         * Get associated canvas
         * @returns {canvas_widget.AbstractCanvas}
         */
        this.getCanvas = function(){
            return _canvas;
        };

        /**
         * Removes edge from canvas
         */
        this.removeFromCanvas = function(){
            _canvas = null;
            _$node.remove();
        };

        /**
         * Add attribute to node
         * @param {canvas_widget.AbstractAttribute} attribute
         */
        this.addAttribute = function(attribute){
            var id = attribute.getEntityId();
            if(!_attributes.hasOwnProperty(id)){
                _attributes[id] = attribute;
            }
        };

        /**
         * Get attribute by id
         * @param {String} id Attribute's entity id
         * @returns {canvas_widget.AbstractAttribute}
         */
        this.getAttribute = function(id){
            if(_attributes.hasOwnProperty(id)){
                return _attributes[id];
            }
            return null;
        };

        /**
         * Delete attribute by id
         * @param {String} id Attribute's entity id
         */
        this.deleteAttribute = function(id){
            if(_attributes.hasOwnProperty(id)){
                delete _attributes[id];
            }
        };

        /**
         * Set node's attributes
         * @param {Object} attributes
         */
        this.setAttributes = function(attributes){
            _attributes = attributes;
        };

        /**
         * Get node's attributes
         * @returns {Object}
         */
        this.getAttributes = function(){
            return _attributes;
        };

        /**
         * Set edge label
         * @param {canvas_widget.SingleValueAttribute} label
         */
        this.setLabel = function(label){
            _label = label;
        };

        /**
         * Get edge label
         * @returns {canvas_widget.SingleValueAttribute}
         */
        this.getLabel = function(){
            return _label;
        };

        /**
         * Get edge type
         * @returns {string}
         */
        this.getType = function(){
            return _type;
        };

        /**
         * Get jQuery object of DOM node representing the node
         * @returns {jQuery}
         * @private
         */
        this._get$node = function(){
            return _$node;
        };

        /**
         * Apply position and dimension attributes to the node
         * @private
         */
        this._draw = function(){
            //noinspection JSAccessibilityCheck
            _$node.css({
                left: _appearance.left,
                top: _appearance.top,
                width: _appearance.width,
                height: _appearance.height,
                zIndex: _zIndex
            });
        };

        /**
         * Move the node
         * @param {number} offsetX Offset in x-direction
         * @param {number} offsetY Offset in y-direction
         * @param {number} offsetZ Offset in z-direction
         */
        this.move = function(offsetX,offsetY,offsetZ){
            //noinspection JSAccessibilityCheck
            _appearance.left += offsetX;
            _appearance.top += offsetY;

            _zIndex += offsetZ;

            this._draw();
            repaint();
        };

        /**
         * Resize the node
         * @param {number} offsetX Offset in x-direction
         * @param {number} offsetY Offset in y-direction
         */
        this.resize = function(offsetX,offsetY){
            _appearance.width += offsetX;
            _appearance.height += offsetY;
            this._draw();
            repaint();
        };

        /**
         * Add ingoing edge
         * @param {canvas_widget.AbstractEdge} edge
         */
        this.addIngoingEdge = function(edge){
            var id = edge.getEntityId();
            var source = edge.getSource();
            var sourceEntityId = source.getEntityId();
            if(!_ingoingEdges.hasOwnProperty(id)){
                _ingoingEdges[id] = edge;
                if(!_ingoingNeighbors.hasOwnProperty(sourceEntityId)){
                    _ingoingNeighbors[sourceEntityId] = source;
                }
            }
        };

        /**
         * Add outgoing edge
         * @param {canvas_widget.AbstractEdge} edge
         */
        this.addOutgoingEdge = function(edge){
            var id = edge.getEntityId();
            var target = edge.getTarget();
            var targetEntityId = target.getEntityId();
            if(!_outgoingEdges.hasOwnProperty(id)){
                _outgoingEdges[id] = edge;
                if(!_outgoingNeighbors.hasOwnProperty(targetEntityId)){
                    _outgoingNeighbors[targetEntityId] = target;
                }
            }
        };

        /**
         * Delete ingoing edge
         * @param {canvas_widget.AbstractEdge} edge
         */
        this.deleteIngoingEdge = function(edge){
            var id = edge.getEntityId();
            var source = edge.getSource();
            var sourceEntityId = source.getEntityId();
            var isMultiEdge = false;
            if(_ingoingEdges.hasOwnProperty(id)){
                delete _ingoingEdges[id];
                for(var edgeId in _ingoingEdges){
                    if(_ingoingEdges.hasOwnProperty(edgeId) && _ingoingEdges[edgeId].getSource().getEntityId() === sourceEntityId){
                        isMultiEdge = true;
                    }
                }
                if(!isMultiEdge){
                    delete _ingoingNeighbors[sourceEntityId];
                }
            }
        };

        /**
         * Delete outgoing edge
         * @param {canvas_widget.AbstractEdge} edge
         */
        this.deleteOutgoingEdge = function(edge){
            var id = edge.getEntityId();
            var target = edge.getTarget();
            var targetEntityId = target.getEntityId();
            var isMultiEdge = false;
            if(_outgoingEdges.hasOwnProperty(id)){
                delete _outgoingEdges[id];
                for(var edgeId in _outgoingEdges){
                    if(_outgoingEdges.hasOwnProperty(edgeId) && _outgoingEdges[edgeId].getTarget().getEntityId() === targetEntityId){
                        isMultiEdge = true;
                    }
                }
                if(!isMultiEdge){
                    delete _outgoingNeighbors[targetEntityId];
                }
            }
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get ingoing edges
         * @returns {Object}
         */
        this.getIngoingEdges = function(){
            return _ingoingEdges;
        };

        /**
         * Get outgoing edges
         * @returns {Object}
         */
        this.getOutgoingEdges = function(){
            return _outgoingEdges;
        };

        /**
         * Get all ingoing and outgoing edges
         * @returns {Array}
         */
        this.getEdges = function(){
            return Util.union(_ingoingEdges,_outgoingEdges);
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get neighbors with an edge to the node
         * @returns {Object}
         */
        this.getIngoingNeighbors = function(){
            return _ingoingNeighbors;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get neighbors with an edge from the node
         * @returns {Object}
         */
        this.getOutgoingNeighbors = function(){
            return _outgoingNeighbors;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get neighbors with an edge to or from the node
         * @returns {Object}
         */
        this.getNeighbors = function(){
            return Util.union(_ingoingNeighbors,_outgoingNeighbors);
        };

        /**
         * Lowlight the node
         */
        this.lowlight = function(){
            _$node.addClass('lowlighted');
        };

        /**
         * Unlowlight the node
         */
        this.unlowlight = function(){
            _$node.removeClass('lowlighted');
        };

        /**
         * Select the node
         */
        this.select = function(){
            _isSelected = true;
            this.unhighlight();
            _$node.addClass("selected");
            Util.delay(100).then(function(){_.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});});
        };

        /**
         * Unselect the node
         */
        this.unselect = function(){
            _isSelected = false;
            this.highlight(_highlightColor,_highlightUsername);
            _$node.removeClass("selected");
            Util.delay(100).then(function(){_.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});});
        };

        /**
         * Highlight the node by assigning it the passed color and label it with the passed username
         * @param {String} color
         * @param {String} username
         */
        this.highlight = function(color,username){
            if(color && username){
                _$node.css({border: "2px solid " + color});
                _$node.append($('<div></div>').addClass('user_highlight').css('color',color).text(username));
                Util.delay(100).then(function(){_.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});});
            }
        };

        /**
         * Unhighlight the node
         */
        this.unhighlight = function(){
            _$node.css({border: ""});
            _$node.find('.user_highlight').remove();
            Util.delay(100).then(function(){
                var EntityManager = null;
                try{
                    EntityManager = require('canvas_widget/EntityManager');
                    _.each(EntityManager.getEdges(),function(e){
                        e.setZIndex();
                    });
                }
                catch(error){
                    require(['canvas_widget/EntityManager'], function(EntityManager){
                        _.each(EntityManager.getEdges(),function(e){
                            e.setZIndex();
                        });
                    });
                }

            });
        };

        /**
         * Remove the node
         */
        this.remove = function(){
            this.removeFromCanvas();
            //this.unregisterCallbacks();
            require('canvas_widget/EntityManager').deleteNode(this.getEntityId());
        };

        /**
         * Get JSON representation of the node
         * @returns {Object}
         * @private
         */
        this._toJSON = function(){
            var attr = {};
            _.forEach(this.getAttributes(),function(val,key){
                attr[key] = val.toJSON();
            });
            //noinspection JSAccessibilityCheck
            return {
                label: _label.toJSON(),
                left: _appearance.left,
                top: _appearance.top,
                width: _appearance.width,
                height: _appearance.height,
                zIndex: _zIndex,
                type: _type,
                attributes: attr
            };
        };

        /**
         * Bind events for move tool
         */
        this.bindMoveToolEvents = function(){

            //$canvas.find(".node.ui-draggable").draggable("option","disabled",false);
            var originalPos = {
                left: 0,
                top: 0
            };

            //Enable Node Selection
            var drag = false;
            var $sizePreview = $("<div class=\"size-preview\"></div>").hide();
            _$node.on("click",function(){
                _canvas.select(that);
            })
            //Enable Node Resizing
            .resizable({
                containment: "parent",
                start: function(ev/*,ui*/){
                    $sizePreview.show();
                    _$node.css({opacity:0.5});
                    _$node.append($sizePreview);
                    _$node.resizable("option","aspectRatio",ev.shiftKey);
                    _$node.resizable("option","grid",ev.ctrlKey ? [20,20] : '');
                },
                resize:function(ev,ui){
                    $sizePreview.text(Math.round(ui.size.width) + "x" + Math.round(ui.size.height));
                    repaint();
                    _$node.resizable("option","aspectRatio",ev.shiftKey);
                    _$node.resizable("option","grid",ev.ctrlKey ? [20,20] : '');
                },
                stop:function(ev,ui){
                    $sizePreview.hide();
                    _$node.css({opacity:''});
                    var $target = ui.helper;
                    $target.css({width: ui.originalSize.width, height: ui.originalSize.height});
                    var offsetX = ui.size.width-ui.originalSize.width;
                    var offsetY = ui.size.height-ui.originalSize.height;
                    var operation = new NodeResizeOperation(id,offsetX,offsetY);
                    propagateNodeResizeOperation(operation);
                    //that.canvas.callListeners(CONFIG.CANVAS.LISTENERS.NODERESIZE,id,offsetX,offsetY);
                    _$node.resizable("option","aspectRatio",false);
                    _$node.resizable("option","grid",'');
                    $(event.toElement).one('click',function(ev){ev.stopImmediatePropagation();});
                }
            })

            //Enable Node Dragging
            .draggable({
                containment: "parent",
                start: function(ev,ui){
                    console.log("dragStart");
                    originalPos.top = ui.position.top;
                    originalPos.left = ui.position.left;
                    //ui.position.top = 0;
                    //ui.position.left = 0;
                    _canvas.select(that);
                    _$node.css({opacity:0.5});
                    _$node.resizable("disable");
                    drag = false;
                    _$node.draggable("option","grid",ev.ctrlKey ? [20,20] : '');
                },
                drag: function(ev,ui){
                    // ui.position.left = Math.round(ui.position.left  / _canvas.getZoom());
                    // ui.position.top = Math.round(ui.position.top / _canvas.getZoom());

                    if(drag) repaint();
                    drag = true;
                    _$node.draggable("option","grid",ev.ctrlKey ? [20,20] : '');
                },
                stop: function(ev,ui){
                    _$node.css({opacity:''});
                    _$node.resizable("enable");
                    var id = _$node.attr("id");
                    //_$node.css({top: originalPos.top / _canvas.getZoom(), left: originalPos.left / _canvas.getZoom()});
                    var offsetX = Math.round((ui.position.left - originalPos.left) / _canvas.getZoom());
                    var offsetY = Math.round((ui.position.top - originalPos.top) / _canvas.getZoom());
                    var operation = new NodeMoveOperation(id,offsetX,offsetY);
                    propagateNodeMoveOperation(operation);
                    //that.canvas.callListeners(CONFIG.CANVAS.LISTENERS.NODEMOVE,id,offsetX,offsetY);
                    //Avoid node selection on drag stop
                    _$node.draggable("option","grid",'');
                    $(event.toElement).one('click',function(ev){ev.stopImmediatePropagation();});
                }
            })

            //Enable Node Rightclick menu
            .contextMenu(true)

            .transformable({
                rotatable: false,
                skewable: false,
                scalable: false
            })

            .find("input").prop("disabled",false).css('pointerEvents','');

        };

        /**
         * Unbind events for move tool
         */
        this.unbindMoveToolEvents = function(){
            //Disable Node Selection
            _$node.off("click")

            //$canvas.find(".node.ui-draggable").draggable( "option", "disabled", true);

            //Disable Node Resizing
            .resizable().resizable("destroy")

            //Disable Node Draggin
            .draggable().draggable("destroy")

            //Disable Node Rightclick Menu
            .contextMenu(false)

            .transformable('destroy')

            .find("input").prop("disabled",true).css('pointerEvents','none');
        };

        /**
         * Bind source node events for edge tool
         */
        this.makeSource = function(){
            _$node.addClass("source");
            jsPlumb.makeSource(_$node,{
                connectorPaintStyle:{ strokeStyle:"#aaaaaa", lineWidth:2 },
                endpoint: "Blank",
                anchor: _anchorOptions,
                //maxConnections:1,
                uniqueEndpoint:false,
                deleteEndpointsOnDetach:true,
                onMaxConnections:function(info/*, originalEvent*/) {
                    console.log("element is ", info.element, "maxConnections is", info.maxConnections);
                }
            });
        };

        /**
         * Bind target node events for edge tool
         */
        this.makeTarget = function(){
            _$node.addClass("target");
            jsPlumb.makeTarget(_$node,{
                isTarget:false,
                endpoint: "Blank",
                anchor: _anchorOptions,
                uniqueEndpoint:false,
                //maxConnections:1,
                deleteEndpointsOnDetach:true,
                onMaxConnections:function(info/*, originalEvent*/) {
                    console.log("user tried to drop connection", info.connection, "on element", info.element, "with max connections", info.maxConnections);
                }
            });
        };

        /**
         * Unbind events for edge tool
         */
        this.unbindEdgeToolEvents = function(){
            _$node.removeClass("source target");
            jsPlumb.unmakeSource(_$node);
            jsPlumb.unmakeTarget(_$node);
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwcot.registerOnRemoteDataReceivedCallback(remoteNodeMoveCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(remoteNodeMoveZCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(remoteNodeResizeCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(remoteNodeDeleteCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(remoteEntitySelectCallback);
            _iwcot.registerOnHistoryChangedCallback(historyNodeMoveCallback);
            _iwcot.registerOnHistoryChangedCallback(historyNodeMoveZCallback);
            _iwcot.registerOnHistoryChangedCallback(historyNodeResizeCallback);
            _iwcot.registerOnHistoryChangedCallback(historyNodeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteNodeMoveCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteNodeMoveZCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteNodeResizeCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteNodeDeleteCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteEntitySelectCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyNodeMoveCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyNodeMoveZCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyNodeResizeCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyNodeDeleteCallback);
        };

        init();

        if(_iwcot){
            that.registerCallbacks();
        }
    }

    /**
     * Apply position and dimension attributes to the node
     */
    AbstractNode.prototype.draw = function(){
        return this._draw();
    };

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     */
    AbstractNode.prototype.get$node = function(){
        return this._get$node();
    };

    /**
     * Get JSON representation of the node
     * @returns {{label: Object, left: number, top: number, width: number, height: number, type: string, attributes: Object}}
     */
    AbstractNode.prototype.toJSON = function(){
        return this._toJSON();
    };

    return AbstractNode;

});