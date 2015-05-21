define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcotw',
    'operations/ot/EdgeDeleteOperation',
    'operations/non_ot/ActivityOperation',
    'operations/non_ot/EntitySelectOperation',
    'canvas_widget/AbstractEntity',
    'viewcanvas_widget/SingleValueAttribute',
    'text!templates/canvas_widget/abstract_edge.html'
],/** @lends AbstractEdge */function (require,$,jsPlumb,_,IWCOT,EdgeDeleteOperation,ActivityOperation,EntitySelectOperation,AbstractEntity,SingleValueAttribute,abstractEdgeHtml) {

    AbstractEdge.prototype = new AbstractEntity();
    AbstractEdge.prototype.constructor = AbstractEdge;
    /**
     * AbstractEdge
     * @class canvas_widget.AbstractEdge
     * @extends canvas_widget.AbstractEntity
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of edge
     * @param {string} type Type of edge
     * @param {canvas_widget.AbstractNode} source Source node
     * @param {canvas_widget.AbstractNode} target Target node
     * @param {boolean} [overlayRotate] Flag if edge overlay should be flipped automatically to avoid being upside down
     * @param {string} origin the identifier of the element in the base model
     */
    function AbstractEdge(id,type,source,target,overlayRotate, origin){
        var that = this;

        AbstractEntity.call(this,id);

        var _origin = origin;


        /**
         * Type of edge
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
         * @type {{source: (canvas_widget.AbstractNode), target: (canvas_widget.AbstractNode)}}
         * @private
         */
        var _appearance = {
            source: source,
            target: target
        };

        /**
         * Flag if edge overlay should be flipped automatically to avoid being upside down
         * @type {boolean}
         * @private
         */
        var _overlayRotate = overlayRotate !== false;

        /**
         * jQuery object of DOM node representing the edge's overlay
         * @type {jQuery}
         * @private
         */
        var _$overlay = $(_.template(abstractEdgeHtml,{type: type})).find('.edge_label').append(_label.get$node()).parent();

        /**
         * Canvas the edge is drawn on
         * @type {canvas_widget.AbstractCanvas}
         * @private
         */
        var _canvas = null;

        /**
         * jsPlumb object representing the edge
         * @type {Object}
         * @private
         */
        var _jsPlumbConnection = null;

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.VIEWCANVAS);

        /**
         * Attributes of edge
         * @type {Object}
         * @private
         */
        var _attributes = {};

        /**
         * Stores if edge is selected
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
         * Callback to generate list of context menu items
         * @type {function}
         */
        var _contextMenuItemCallback = function(){return{};};

        //noinspection JSUnusedLocalSymbols
        /**
         * Apply an Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var processEdgeDeleteOperation = function(operation){
            that.remove();
        };

        /**
         * Propagate an Edge Delete Operation to the remote users and the local widgets
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var propagateEdgeDeleteOperation = function(operation){
            processEdgeDeleteOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "EdgeDeleteActivity",
                    operation.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    EdgeDeleteOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue(), $('#lblCurrentView').text()),
                    {}
                ).toNonOTOperation());
            }
            if(CONFIG.INSTANCE_FLAG)
                propagateEdgeDeleteToMainCanvas(operation);
        };

        var propagateEdgeDeleteToMainCanvas = function(operation){
            //propagate change to main canvas
            var EntityManager = require('viewcanvas_widget/EntityManager');
            var originType = EntityManager.getTargetType($('#lblCurrentView').text(),operation.getType());
            if(originType) {
                var mainOp = new EdgeDeleteOperation(that.getOrigin(), originType, that.getSource().getOrigin(), that.getTarget().getOrigin(), operation.getJSON());
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN, mainOp.getOTOperation());
            }
        };

        /**
         * Callback for a remote Entity Select Operation
         * @param {operations.non_ot.EntitySelectOperation} operation
         */
        var remoteEntitySelectCallback = function(operation){
            var color;
            if(operation instanceof EntitySelectOperation && operation.getDestination() === CONFIG.WIDGET.NAME.VIEWCANVAS){
                color = _iwcot.getUserColor(operation.getNonOTOperation().getSender());
                if(!_isSelected){
                    if(operation.getSelectedEntityId() === that.getEntityId()){
                        _highlightColor = color;
                        that.highlight(color);
                    } else {
                        _highlightColor = null;
                        that.unhighlight();
                    }
                } else {
                    if(operation.getSelectedEntityId() === that.getEntityId()){
                        _highlightColor = color;
                    } else {
                        _highlightColor = null;
                    }
                }
            }
        };

        /**
         * Callback for a remote Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var remoteEdgeDeleteCallback = function(operation){
            if(operation instanceof EdgeDeleteOperation && operation.getEntityId() == that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "EdgeDeleteActivity",
                    operation.getEntityId(),
                    operation.getOTOperation().getSender(),
                    EdgeDeleteOperation.getOperationDescription(that.getType(),that.getLabel().getValue().getValue(),$('#lblCurrentView').text()),
                    {}
                ).toNonOTOperation());
                processEdgeDeleteOperation(operation);
                if(CONFIG.INSTANCE_FLAG)
                    propagateEdgeDeleteToMainCanvas(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var historyEdgeDeleteCallback = function(operation){
            if(operation instanceof EdgeDeleteOperation && operation.getEntityId() == that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processEdgeDeleteOperation(operation);
            }
        };

        /**
         * Get jQuery object of all DOM nodes belonging to the edge
         */
        var getAllAssociatedDOMNodes = function(){
            var overlays,
                i,
                numOfOverlays,
                $e = $('.'+id);

            if(_jsPlumbConnection){
                overlays = _jsPlumbConnection.getOverlays();
                for(i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++){
                    if(overlays[i] instanceof jsPlumb.Overlays.Custom){
                        $e = $e.add(overlays[i].getElement());
                    }
                }
            }
            return $e;
        };


        /**
         * Default paint style of edge
         */
        var _defaultPaintStyle;

        /**
         * Send NodeDeleteOperation for node
         */
        this.triggerDeletion = function(){
            _canvas.select(null);
            var operation = new EdgeDeleteOperation(id,that.getType(),that.getSource().getEntityId(),that.getTarget().getEntityId());
            propagateEdgeDeleteOperation(operation);
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
            _contextMenuItemCallback = contextMenuItemCallback;
        };

        /**
         * Adds edge to canvas
         * @param {canvas_widget.AbstractCanvas} canvas
         */
        this.addToCanvas = function(canvas){
            _canvas = canvas;
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
            jsPlumb.detach(_jsPlumbConnection,{fireEvent: false});
            _jsPlumbConnection = null;
        };

        /**
         * Add attribute to edge
         * @param {canvas_widget.AbstractAttribute} attribute
         */
        this.addAttribute = function(attribute){
            var id = attribute.getEntityId();
            if(!_attributes.hasOwnProperty(id)){
                _attributes[id] = attribute;
            }
        };

        /**
         * Set edge's attributes
         * @param {Object} attributes
         */
        this.setAttributes = function(attributes){
            _attributes = attributes;
        };

        /**
         * Get edge's attributes
         * @returns {Object}
         */
        this.getAttributes = function(){
            return _attributes;
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
            if(!_attributes.hasOwnProperty(id)){
                delete _attributes[id];
            }
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
         * Get source node
         * @returns {canvas_widget.AbstractNode}
         */
        this.getSource = function(){
            return _appearance.source;
        };

        /**
         * Get target node
         * @returns {canvas_widget.AbstractNode}
         */
        this.getTarget = function(){
            //noinspection JSAccessibilityCheck
            return _appearance.target;
        };

        /**
         * get the origin of the viewpoint element
         * @returns {string}
         */
        this.getOrigin = function(){
            return _origin;
        };

        /**
         * set the origin
         * origin is a identifier of a element of a base node
         * @param origin
         */
        this.setOrigin = function(origin){
            _origin = origin;
        };

        /**
         * Get jQuery object of DOM node representing the edge's overlay
         * @returns {jQuery}
         */
        this.get$overlay = function(){
            return _$overlay;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set flag if edge overlay should be flipped automatically to avoid being upside down
         * @param {boolean} rotateOverlay
         */
        this.setRotateOverlay = function(rotateOverlay){
            _overlayRotate = rotateOverlay;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get flag if edge overlay should be flipped automatically to avoid being upside down
         * @return {boolean} rotateOverlay
         */
        this.isRotateOverlay = function(){
            return _overlayRotate;
        };

        /**
         * Set jsPlumb object representing the edge
         * @param {Object} jsPlumbConnection
         */
        this.setJsPlumbConnection = function(jsPlumbConnection){
            _jsPlumbConnection = jsPlumbConnection;
            _defaultPaintStyle = jsPlumbConnection.getPaintStyle();
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set jsPlumb object representing the edge
         * @return {Object} jsPlumbConnection
         */
        this.getJsPlumbConnection = function(){
            return _jsPlumbConnection;
        };

        /**
         * Repaint edge overlays (adjust angle of fixed overlays)
         */
        this.repaintOverlays = function(){
            function makeRotateOverlayCallback(angle){
                return function rotateOverlay(){
                    var $this = $(this),
                        oldTransform = $this.css('transform','').css('transform');

                    if(oldTransform === "none") oldTransform = "";

                    $this.css({
                        'transform': oldTransform + ' rotate(' + angle + 'rad)',
                        '-o-transform': oldTransform + ' rotate(' + angle + 'rad)',
                        '-ms-transform': oldTransform + ' rotate(' + angle + 'rad)',
                        '-moz-transform': oldTransform + ' rotate(' + angle + 'rad)',
                        '-webkit-transform': oldTransform + ' rotate(' + angle + 'rad)'
                    });
                };
            }

            var i,
                numOfOverlays,
                overlays,
                sourceEndpoint,
                targetEndpoint,
                angle;

            if(_jsPlumbConnection){
                sourceEndpoint = _jsPlumbConnection.endpoints[0].endpoint;
                targetEndpoint = _jsPlumbConnection.endpoints[1].endpoint;
                angle = Math.atan2(sourceEndpoint.y-targetEndpoint.y,sourceEndpoint.x-targetEndpoint.x);
                if(!_overlayRotate || Math.abs(angle) > Math.PI/2) {
                    angle += Math.PI;
                }
                overlays = _jsPlumbConnection.getOverlays();
                for(i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++){
                    if(overlays[i] instanceof jsPlumb.Overlays.Custom){
                        $(overlays[i].getElement()).find('.fixed').not('.segmented').each(makeRotateOverlayCallback(angle));
                        //Always flip type overlay
                        $(overlays[i].getElement()).find('.fixed.type').not('.segmented').each(makeRotateOverlayCallback(Math.abs(angle - Math.PI) > Math.PI/2 ? angle : angle + Math.PI));
                    }
                }
            }
        };

        /**
         * Sets position of edge on z-axis as max of the z-indices of source and target
         */
        this.setZIndex = function(){
            var $e = getAllAssociatedDOMNodes(),
                zIndex = Math.max(source.getZIndex(),target.getZIndex());
            $e.css('zIndex',zIndex);
        };

        /**
         * Connect source and target node and draw the edge on canvas
         */
        this.connect = function(){
            source.addOutgoingEdge(this);
            target.addIngoingEdge(this);
            //noinspection JSAccessibilityCheck
            _jsPlumbConnection = jsPlumb.connect({
                source: _appearance.source.get$node(),
                target: _appearance.target.get$node(),
                paintStyle:{ strokeStyle:"#aaaaaa", lineWidth:2},
                endpoint: "Blank",
                connector: ["Flowchart", {gap: 0}],
                anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                overlays:[
                    ["Custom", {
                        create:function() {
                            return _$overlay;
                        },
                        location:0.5,
                        id:"label"
                    }]
                ],
                cssClass: id
            });
            this.repaintOverlays();
            _.each(require('viewcanvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        /**
         * Lowlight the edge
         */
        this.lowlight = function(){
            $("."+id).addClass('lowlighted');
        };

        /**
         * Unlowlight the edge
         */
        this.unlowlight = function(){
            $("."+id).removeClass('lowlighted');
        };

        /**
         * Select the edge
         */
        this.select = function(){
            var paintStyle = _.clone(_defaultPaintStyle),
                overlays,
                i,
                numOfOverlays;

            function makeBold(){
                $(this).css('fontWeight','bold');
            }

            _isSelected = true;
            this.unhighlight();
            if(_jsPlumbConnection) {
                paintStyle.lineWidth = 4;
                _jsPlumbConnection.setPaintStyle(paintStyle);
                overlays = _jsPlumbConnection.getOverlays();
                for(i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++){
                    if(overlays[i] instanceof jsPlumb.Overlays.Custom){
                        $(overlays[i].getElement()).find('.fixed').each(makeBold);
                    }
                }
            }
        };

        /**
         * Unselect the edge
         */
        this.unselect = function(){
            var overlays,
                i,
                numOfOverlays;

            function unmakeBold(){
                $(this).css('fontWeight','');
            }

            _isSelected = false;
            this.highlight(_highlightColor);
            if(_jsPlumbConnection){
                _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
                overlays = _jsPlumbConnection.getOverlays();
                for(i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++){
                    if(overlays[i] instanceof jsPlumb.Overlays.Custom){
                        $(overlays[i].getElement()).find('.fixed').each(unmakeBold);
                    }
                }
            }
        };

        /**
         * Highlight the edge
         * @param {String} color
         */
        this.highlight = function(color){
            var paintStyle = _.clone(_defaultPaintStyle);

            if(color){
                paintStyle.strokeStyle = color;
                paintStyle.lineWidth = 4;
                if(_jsPlumbConnection) _jsPlumbConnection.setPaintStyle(paintStyle);
            }
        };

        /**
         * Unhighlight the edge
         */
        this.unhighlight = function(){
            if(_jsPlumbConnection){
                _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
            }
        };

        /**
         * Remove the edge
         */
        this.remove = function(){
            source.deleteOutgoingEdge(this);
            target.deleteIngoingEdge(this);
            this.removeFromCanvas();
            //this.unregisterCallbacks();
            require('viewcanvas_widget/EntityManager').deleteEdge(this.getEntityId());
        };

         /**
         * Get JSON representation of the edge
         * @returns {Object}
         * @private
         */
        this._toJSON = function(){
            var attr = {};
            _.forEach(this.getAttributes(),function(val,key){
                attr[key] = val.toJSON();
            });
            return  {
                label: _label.toJSON(),
                source: source.getEntityId(),
                target: target.getEntityId(),
                attributes: attr,
                type: _type,
                origin:_origin
            };
        };

        /**
         * Bind events for move tool
         */
        this.bindMoveToolEvents = function(){

            if(_jsPlumbConnection){
                //Enable Edge Select
                _jsPlumbConnection.bind("click", function(/*conn*/) {
                    _canvas.select(that);
                });

                $(_jsPlumbConnection.getOverlay("label").canvas).find("input").prop("disabled",false).css('pointerEvents','');

                /*$(_jsPlumbConnection.getOverlay("label").canvas).find("input[type=text]").autoGrowInput({
                    comfortZone: 10,
                    minWidth: 40,
                    maxWidth: 100
                }).trigger("blur");*/
            }
            //Define Edge Rightclick Menu
            $.contextMenu({
                selector: "."+id,
                zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
                build: function(){
                    var menuItems = _.extend(_contextMenuItemCallback(),{
                        delete: {name: "Delete", callback: function(/*key, opt*/){
                            that.triggerDeletion();
                        }}
                    });

                    return {
                        items: menuItems,
                        events: {
                            show: function(/*opt*/){
                                _canvas.select(that);
                            }
                        }
                    };
                }
            });

            $("."+id).contextMenu(true);

        };

        /**
         * Unbind events for move tool
         */
        this.unbindMoveToolEvents = function(){
            if(_jsPlumbConnection){
                //Disable Edge Select
                _jsPlumbConnection.unbind("click");

                $(_jsPlumbConnection.getOverlay("label").canvas).find("input").prop("disabled",true).css('pointerEvents','none');
            }

            $("."+id).contextMenu(false);
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwcot.registerOnRemoteDataReceivedCallback(remoteEntitySelectCallback);
            _iwcot.registerOnRemoteDataReceivedCallback(remoteEdgeDeleteCallback);
            _iwcot.registerOnHistoryChangedCallback(historyEdgeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteEntitySelectCallback);
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteEdgeDeleteCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyEdgeDeleteCallback);
        };

        if(_iwcot){
            that.registerCallbacks();
        }
    }

    /**
     * Get JSON representation of the edge
     * @returns {{label: Object, source: string, target: string, attributes: Object, type: string}}
     */
    AbstractEdge.prototype.toJSON = function(){
        return this._toJSON();
    };

    return AbstractEdge;

});