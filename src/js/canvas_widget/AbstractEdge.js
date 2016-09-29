define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'Util',
    'operations/ot/EdgeDeleteOperation',
    'operations/non_ot/ActivityOperation',
    'canvas_widget/HistoryManager',
    'canvas_widget/AbstractEntity',
    'canvas_widget/SingleValueAttribute',
    'text!templates/canvas_widget/abstract_edge.html'
],/** @lends AbstractEdge */function (require, $, jsPlumb, _, IWCW, Util, EdgeDeleteOperation, ActivityOperation, HistoryManager, AbstractEntity, SingleValueAttribute, abstractEdgeHtml) {

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
     */
    function AbstractEdge(id, type, source, target, overlayRotate) {
        var that = this;

        /**
        * Inter widget communication wrapper
        * @type {Object}
        */
        var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        AbstractEntity.call(this, id);

        var _ymap = null;

        if (window.hasOwnProperty("y")) {
            if (y.share.edges.keys().indexOf(id) != -1) {
                _ymap = y.share.edges.get(id);

            }
            else {
                _ymap = y.share.edges.set(id, Y.Map);
                _ymap.set('id', id);
                _ymap.set('type', type);
                _ymap.set('source', source.getEntityId());
                _ymap.set('target', target.getEntityId());
                _ymap.set('jabberId', _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
            }
        }
        this.getYMap = function () {
            return _ymap;
        };

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
        var _label = new SingleValueAttribute(id + "[label]", "Label", this);

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
        var _$overlay = $(_.template(abstractEdgeHtml, { type: type })).find('.edge_label').append(_label.get$node()).parent();

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
        var _contextMenuItemCallback = function () { return {}; };

        //noinspection JSUnusedLocalSymbols
        /**
         * Apply an Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var processEdgeDeleteOperation = function (operation) {
            that.remove();
        };

        /**
         * Propagate an Edge Delete Operation to the remote users and the local widgets
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var propagateEdgeDeleteOperation = function (operation) {
            processEdgeDeleteOperation(operation);
            $('#save').click();

            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
            _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.getOTOperation());

            y.share.activity.set(ActivityOperation.TYPE, new ActivityOperation(
                "EdgeDeleteActivity",
                operation.getEntityId(),
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                EdgeDeleteOperation.getOperationDescription(that.getType(), that.getLabel().getValue().getValue()),
                {}
            ));

        };

        /**
         * Callback for a remote Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        this.remoteEdgeDeleteCallback = function (operation) {
            if (operation instanceof EdgeDeleteOperation && operation.getEntityId() == that.getEntityId()) {
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation.getOTOperation());
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.GUIDANCE, operation.getOTOperation());
                processEdgeDeleteOperation(operation);
            }
        };

        /**
         * Get jQuery object of all DOM nodes belonging to the edge
         */
        var getAllAssociatedDOMNodes = function () {
            var overlays,
                i,
                numOfOverlays,
                $e = $('.' + id);

            if (_jsPlumbConnection) {
                overlays = _jsPlumbConnection.getOverlays();
                for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
                    if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
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
         * Set the default paint style
         * @param paintStyle
         */
        this.setDefaultPaintStyle = function (paintStyle) {
            _defaultPaintStyle = paintStyle;
        };

        /**
         * Get the default paint style
         * @returns {*}
         */
        this.getDefaultPaintStyle = function () {
            return _defaultPaintStyle;
        };

        /**
         * Send NodeDeleteOperation for node
         */
        this.triggerDeletion = function (historyFlag) {
            _canvas.select(null);
            var operation = new EdgeDeleteOperation(id, that.getType(), that.getSource().getEntityId(), that.getTarget().getEntityId());

            if (_ymap) {
                propagateEdgeDeleteOperation(operation);
                y.share.edges.delete(that.getEntityId());
            }
            else {
                propagateEdgeDeleteOperation(operation);
            }
            if (!historyFlag)
                HistoryManager.add(operation);
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get callback to generate list of context menu items
         * @returns {object}
         */
        this.getContextMenuItemCallback = function () {
            return _contextMenuItemCallback;
        };

        /**
         * Set callback to generate list of context menu items
         * @param {function} contextMenuItemCallback
         */
        this.setContextMenuItemCallback = function (contextMenuItemCallback) {
            _contextMenuItemCallback = contextMenuItemCallback;
        };

        /**
         * Adds edge to canvas
         * @param {canvas_widget.AbstractCanvas} canvas
         */
        this.addToCanvas = function (canvas) {
            _canvas = canvas;
        };

        /**
         * Get associated canvas
         * @returns {canvas_widget.AbstractCanvas}
         */
        this.getCanvas = function () {
            return _canvas;
        };

        /**
         * Removes edge from canvas
         */
        this.removeFromCanvas = function () {
            _canvas = null;
            $.contextMenu('destroy', '.' + that.getEntityId());
            jsPlumb.detach(_jsPlumbConnection, { fireEvent: false });
            _jsPlumbConnection = null;
        };

        /**
         * Add attribute to edge
         * @param {canvas_widget.AbstractAttribute} attribute
         */
        this.addAttribute = function (attribute) {
            var id = attribute.getEntityId();
            if (!_attributes.hasOwnProperty(id)) {
                _attributes[id] = attribute;
            }
        };

        /**
         * Set edge's attributes
         * @param {Object} attributes
         */
        this.setAttributes = function (attributes) {
            _attributes = attributes;
        };

        /**
         * Get edge's attributes
         * @returns {Object}
         */
        this.getAttributes = function () {
            return _attributes;
        };

        /**
         * Get attribute by id
         * @param {String} id Attribute's entity id
         * @returns {canvas_widget.AbstractAttribute}
         */
        this.getAttribute = function (id) {
            if (_attributes.hasOwnProperty(id)) {
                return _attributes[id];
            }
            return null;
        };

        /**
         * Delete attribute by id
         * @param {String} id Attribute's entity id
         */
        this.deleteAttribute = function (id) {
            if (!_attributes.hasOwnProperty(id)) {
                delete _attributes[id];
            }
        };

        /**
         * Set edge label
         * @param {canvas_widget.SingleValueAttribute} label
         */
        this.setLabel = function (label) {
            _label = label;
        };

        /**
         * Get edge label
         * @returns {canvas_widget.SingleValueAttribute}
         */
        this.getLabel = function () {
            return _label;
        };

        /**
         * Get edge type
         * @returns {string}
         */
        this.getType = function () {
            return _type;
        };

        /**
         * Get source node
         * @returns {canvas_widget.AbstractNode}
         */
        this.getSource = function () {
            return _appearance.source;
        };

        /**
         * Get target node
         * @returns {canvas_widget.AbstractNode}
         */
        this.getTarget = function () {
            //noinspection JSAccessibilityCheck
            return _appearance.target;
        };

        /**
         * Get jQuery object of DOM node representing the edge's overlay
         * @returns {jQuery}
         */
        this.get$overlay = function () {
            return _$overlay;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set flag if edge overlay should be flipped automatically to avoid being upside down
         * @param {boolean} rotateOverlay
         */
        this.setRotateOverlay = function (rotateOverlay) {
            _overlayRotate = rotateOverlay;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get flag if edge overlay should be flipped automatically to avoid being upside down
         * @return {boolean} rotateOverlay
         */
        this.isRotateOverlay = function () {
            return _overlayRotate;
        };

        /**
         * Set jsPlumb object representing the edge
         * @param {Object} jsPlumbConnection
         */
        this.setJsPlumbConnection = function (jsPlumbConnection) {
            _jsPlumbConnection = jsPlumbConnection;
            _defaultPaintStyle = jsPlumbConnection.getPaintStyle();
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Get jsPlumb object representing the edge
         * @return {Object} jsPlumbConnection
         */
        this.getJsPlumbConnection = function () {
            return _jsPlumbConnection;
        };

        /**
         * Repaint edge overlays (adjust angle of fixed overlays)
         */
        this.repaintOverlays = function () {
            function makeRotateOverlayCallback(angle) {
                return function rotateOverlay() {
                    var $this = $(this),
                        oldTransform = $this.css('transform', '').css('transform');

                    if (oldTransform === "none") oldTransform = "";

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

            if (_jsPlumbConnection) {
                sourceEndpoint = _jsPlumbConnection.endpoints[0].endpoint;
                targetEndpoint = _jsPlumbConnection.endpoints[1].endpoint;
                angle = Math.atan2(sourceEndpoint.y - targetEndpoint.y, sourceEndpoint.x - targetEndpoint.x);
                if (!_overlayRotate || Math.abs(angle) > Math.PI / 2) {
                    angle += Math.PI;
                }
                overlays = _jsPlumbConnection.getOverlays();
                for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
                    if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
                        $(overlays[i].getElement()).find('.fixed').not('.segmented').each(makeRotateOverlayCallback(angle));
                        //Always flip type overlay
                        $(overlays[i].getElement()).find('.fixed.type').not('.segmented').each(makeRotateOverlayCallback(Math.abs(angle - Math.PI) > Math.PI / 2 ? angle : angle + Math.PI));
                    }
                }
            }
        };

        /**
         * Sets position of edge on z-axis as max of the z-indices of source and target
         */
        this.setZIndex = function () {
            var $e = getAllAssociatedDOMNodes(),
                zIndex = Math.max(source.getZIndex(), target.getZIndex());
            $e.css('zIndex', zIndex);
        };

        /**
         * Connect source and target node and draw the edge on canvas
         */
        this.connect = function () {
            source.addOutgoingEdge(this);
            target.addIngoingEdge(this);
            //noinspection JSAccessibilityCheck
            _jsPlumbConnection = jsPlumb.connect({
                source: _appearance.source.get$node(),
                target: _appearance.target.get$node(),
                paintStyle: { strokeStyle: "#aaaaaa", lineWidth: 2 },
                endpoint: "Blank",
                connector: ["Flowchart", { gap: 0 }],
                anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                overlays: [
                    ["Custom", {
                        create: function () {
                            return _$overlay;
                        },
                        location: 0.5,
                        id: "label"
                    }]
                ],
                cssClass: id
            });
            this.repaintOverlays();
            _.each(require('canvas_widget/EntityManager').getEdges(), function (e) { e.setZIndex(); });
        };

        /**
         * Lowlight the edge
         */
        this.lowlight = function () {
            $("." + id).addClass('lowlighted');
        };

        /**
         * Unlowlight the edge
         */
        this.unlowlight = function () {
            $("." + id).removeClass('lowlighted');
        };

        /**
         * Select the edge
         */
        this.select = function () {
            var paintStyle = _.clone(_defaultPaintStyle),
                overlays,
                i,
                numOfOverlays;

            function makeBold() {
                $(this).css('fontWeight', 'bold');
            }

            _isSelected = true;
            this.unhighlight();
            if (_jsPlumbConnection) {
                paintStyle.lineWidth = 4;
                _jsPlumbConnection.setPaintStyle(paintStyle);
                overlays = _jsPlumbConnection.getOverlays();
                for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
                    if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
                        $(overlays[i].getElement()).find('.fixed').each(makeBold);
                    }
                }
            }
        };

        /**
         * Unselect the edge
         */
        this.unselect = function () {
            var overlays,
                i,
                numOfOverlays;

            function unmakeBold() {
                $(this).css('fontWeight', '');
            }

            _isSelected = false;
            this.highlight(_highlightColor);
            if (_jsPlumbConnection) {
                _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
                overlays = _jsPlumbConnection.getOverlays();
                for (i = 0, numOfOverlays = overlays.length; i < numOfOverlays; i++) {
                    if (overlays[i] instanceof jsPlumb.Overlays.Custom) {
                        $(overlays[i].getElement()).find('.fixed').each(unmakeBold);
                    }
                }
            }
            $('#save').click();
        };

        /**
         * Highlight the edge
         * @param {String} color
         */
        this.highlight = function (color) {
            var paintStyle = _.clone(_defaultPaintStyle);

            if (color) {
                paintStyle.strokeStyle = color;
                paintStyle.lineWidth = 4;
                if (_jsPlumbConnection) _jsPlumbConnection.setPaintStyle(paintStyle);
            }
        };

        /**
         * Unhighlight the edge
         */
        this.unhighlight = function () {
            if (_jsPlumbConnection) {
                _jsPlumbConnection.setPaintStyle(_defaultPaintStyle);
            }
        };

        /**
         * Remove the edge
         */
        this.remove = function () {
            source.deleteOutgoingEdge(this);
            target.deleteIngoingEdge(this);
            this.removeFromCanvas();
            //this.unregisterCallbacks();
            require('canvas_widget/EntityManager').deleteEdge(this.getEntityId());
            if (_ymap) {
                _ymap = null;
            }
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         * @private
         */
        this._toJSON = function () {
            var attr = {};
            _.forEach(this.getAttributes(), function (val, key) {
                attr[key] = val.toJSON();
            });
            return {
                label: _label.toJSON(),
                source: source.getEntityId(),
                target: target.getEntityId(),
                attributes: attr,
                type: _type
            };
        };

        /**
         * Bind events for move tool
         */
        this.bindMoveToolEvents = function () {

            if (_jsPlumbConnection) {
                //Enable Edge Select
                _jsPlumbConnection.bind("click", function (/*conn*/) {
                    _canvas.select(that);
                });

                $(_jsPlumbConnection.getOverlay("label").canvas).find("input").prop("disabled", false).css('pointerEvents', '');

                /*$(_jsPlumbConnection.getOverlay("label").canvas).find("input[type=text]").autoGrowInput({
                 comfortZone: 10,
                 minWidth: 40,
                 maxWidth: 100
                 }).trigger("blur");*/
            }
            //Define Edge Rightclick Menu
            $.contextMenu({
                selector: "." + id,
                zIndex: AbstractEntity.CONTEXT_MENU_Z_INDEX,
                build: function () {
                    var menuItems = _.extend(_contextMenuItemCallback(), {
                        delete: {
                            name: "Delete", callback: function (/*key, opt*/) {
                                that.triggerDeletion();
                            }
                        }
                    });

                    return {
                        items: menuItems,
                        events: {
                            show: function (/*opt*/) {
                                _canvas.select(that);
                            }
                        }
                    };
                }
            });

            //$("."+id).contextMenu(true);

        };

        /**
         * Unbind events for move tool
         */
        this.unbindMoveToolEvents = function () {
            if (_jsPlumbConnection) {
                //Disable Edge Select
                _jsPlumbConnection.unbind("click");

                $(_jsPlumbConnection.getOverlay("label").canvas).find("input").prop("disabled", true).css('pointerEvents', 'none');
            }

            //$("."+id).contextMenu(false);
        };

        this._registerYMap = function () {
            that.getLabel().getValue().registerYType();
        }

    }

    /**
     * Get JSON representation of the edge
     * @returns {{label: Object, source: string, target: string, attributes: Object, type: string}}
     */
    AbstractEdge.prototype.toJSON = function () {
        return this._toJSON();
    };

    /**
     * Hide a jsPlumb connection
     */
    AbstractEdge.prototype.hide = function () {
        var connector = this.getJsPlumbConnection();
        connector.setVisible(false);
    };

    /**
     * Show a jsPlumb connection
     */
    AbstractEdge.prototype.show = function () {
        var connector = this.getJsPlumbConnection();
        connector.setVisible(true);
    };

    AbstractEdge.prototype.registerYMap = function () {
        this._registerYMap();
    };

    return AbstractEdge;

});