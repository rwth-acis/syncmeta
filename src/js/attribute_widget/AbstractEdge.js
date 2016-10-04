define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'operations/non_ot/EntitySelectOperation',
    'operations/ot/EdgeDeleteOperation',
    'attribute_widget/SingleValueAttribute',
    'attribute_widget/AbstractEntity',
    'text!templates/attribute_widget/abstract_edge.html'
],/** @lends AbstractEdge */function (require, $, jsPlumb, _, IWCW, EntitySelectOperation, EdgeDeleteOperation, SingleValueAttribute, AbstractEntity, abstractEdgeHtml) {

    AbstractEdge.prototype = new AbstractEntity();
    AbstractEdge.prototype.constructor = AbstractEdge;
    /**
     * AbstractEdge
     * @class attribute_widget.AbstractEdge
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractEntity
     * @constructor
     * @param {string} id Entity identifier of edge
     * @param {string} type Type of edge
     * @param {attribute_widget.AbstractNode} source Source node
     * @param {attribute_widget.AbstractNode} target Target node
     * @param {string} viewId the identifier of the view the edge belongs to
     */
    function AbstractEdge(type, id, source, target, viewId) {
        var that = this;

        AbstractEntity.call(this, id);

        /**
         * Type of edge
         * @type {string}
         * @private
         */
        var _type = type;

        /**
         * identifier of the view the edge belongs to
         * @type {string}
         * @private
         */
        var _viewId = viewId;

        /**
         * Label of edge
         * @type {attribute_widget.SingleValueAttribute}
         * @private
         */
        var _label = new SingleValueAttribute(id + "[label]", "Label", this);

        /**
         * Appearance information of edge
         * @type {{source: (attribute_widget.AbstractNode), target: (attribute_widget.AbstractNode)}}
         * @private
         */
        var _appearance = {
            source: source,
            target: target
        };

        /**
         * jQuery object of DOM node representing the edge
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(abstractEdgeHtml, { id: id, type: type }));

        /**
         * Wrapper the edge is drawn on
         * @type {attribute_widget.AttributeWrapper}
         * @private
         */
        var _wrapper = null;

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

        /**
         * Attributes of edge
         * @type {Object}
         * @private
         */
        var _attributes = {};

        //noinspection JSUnusedLocalSymbols
        /**
         * Apply an Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var processEdgeDeleteOperation = function (operation) {
            that.getSource().deleteOutgoingEdge(that);
            that.getTarget().deleteIngoingEdge(that);
            that.remove();
        };

        /**
         * Callback for an Entity Select Operation
         * @param {operations.non_ot.EntitySelectOperation} operation
         */
        var entitySelectCallback = function (operation) {
            if (operation instanceof EntitySelectOperation && operation.getSelectedEntityId() === that.getEntityId()) {
                $('.ace-container').hide();
                if (_wrapper.get$node().is(':hidden'))
                    _wrapper.get$node().show();
                _wrapper.select(that);
            }
        };

        /**
         * Callback for an Edge Delete Operation
         * @param {operations.ot.EdgeDeleteOperation} operation
         */
        var edgeDeleteCallback = function (operation) {
            if (operation instanceof EdgeDeleteOperation && operation.getEntityId() === that.getEntityId()) {
                processEdgeDeleteOperation(operation);
            }
        };

        /**
         * Adds edge to wrapper
         * @param {attribute_widget.AttributeWrapper} wrapper
         */
        this.addToWrapper = function (wrapper) {
            _wrapper = wrapper;
            _wrapper.get$node().append(_$node.hide());
        };

        /**
         * Removes edge from wrapper
         */
        this.removeFromWrapper = function () {
            _wrapper = null;
            _$node.detach();
        };

        /**
         * Add attribute to edge
         * @param {attribute_widget.AbstractAttribute} attribute
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
         * @returns {attribute_widget.AbstractAttribute}
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
         * @param {attribute_widget.SingleValueAttribute} label
         */
        this.setLabel = function (label) {
            _label = label;
        };

        /**
         * Get edge label
         * @returns {attribute_widget.SingleValueAttribute}
         */
        this.getLabel = function () {
            return _label;
        };

        /**
         * return the identifier of the view the edge belongs to
         * @returns {string}
         */
        this.getViewId = function () {
            return _viewId;
        };

        /**
         * sets the identifier the edge belongs to
         * @param viewId the identifier of the view
         */
        this.setViewId = function (viewId) {
            _viewId = viewId;
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
         * @returns {attribute_widget.AbstractNode}
         */
        this.getSource = function () {
            return _appearance.source;
        };

        /**
         * Get target node
         * @returns {attribute_widget.AbstractNode}
         */
        this.getTarget = function () {
            //noinspection JSAccessibilityCheck
            return _appearance.target;
        };

        /**
         * Get jQuery object of DOM node representing the node
         * @returns {jQuery}
         * @private
         */
        this._get$node = function () {
            return _$node;
        };

        /**
         * Select the edge
         */
        this.select = function () {
            this.show();
        };

        /**
         * Unselect the edge
         */
        this.unselect = function () {
            this.hide();
        };

        /**
         * Hide edge
         */
        this.hide = function () {
            _$node.hide();
        };

        /**
         * Show edge
         */
        this.show = function () {
            _$node.show();
        };

        /**
         * Remove the edge
         */
        this.remove = function () {
            source.deleteOutgoingEdge(this);
            target.deleteIngoingEdge(this);
            this.removeFromWrapper();
            //this.unregisterCallbacks();
            var EntityManager = require('attribute_widget/EntityManager');
            EntityManager.deleteEdge(this.getEntityId());
            EntityManager.deleteFromMap(this.getViewId(), this.getEntityId());
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         */
        this.toJSON = function () {
            return {
                id: id,
                label: _label,
                appearance: _appearance
            };
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function () {
            iwc.registerOnDataReceivedCallback(entitySelectCallback);
            iwc.registerOnDataReceivedCallback(edgeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function () {
            iwc.unregisterOnDataReceivedCallback(entitySelectCallback);
            iwc.unregisterOnDataReceivedCallback(edgeDeleteCallback);
        };

        this._registerYType = function () {
            var ymap = y.share.edges.get(that.getEntityId());
            if(ymap){
                var ytext = ymap.get(that.getLabel().getValue().getEntityId());
                that.getLabel().getValue().registerYType(ytext);    
            }   
        };

        _$node.find(".label").append(this.getLabel().get$node());

        if (iwc) {
            that.registerCallbacks();
        }
    }

    /**
     * Get jQuery object of DOM node representing the node
     * @returns {jQuery}
     */
    AbstractEdge.prototype.get$node = function () {
        return this._get$node();
    };

    AbstractEdge.prototype.registerYType = function () {
        this._registerYType();
    };

    return AbstractEdge;

});