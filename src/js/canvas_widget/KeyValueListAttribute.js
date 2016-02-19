define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'Util',
    'operations/ot/AttributeAddOperation',
    'operations/ot/AttributeDeleteOperation',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/KeyValueAttribute',
    'text!templates/canvas_widget/list_attribute.html'
],/** @lends KeyValueListAttribute */function($,jsPlumb,_,IWCW,Util,AttributeAddOperation,AttributeDeleteOperation,AbstractAttribute,KeyValueAttribute,keyValueListAttributeHtml) {

    KeyValueListAttribute.TYPE = "KeyValueListAttribute";

    KeyValueListAttribute.prototype = new AbstractAttribute();
    KeyValueListAttribute.prototype.constructor = KeyValueListAttribute;
    /**
     * KeyValueListAttribute
     * @class canvas_widget.KeyValueListAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function KeyValueListAttribute(id,name,subjectEntity){
        var that = this;

        AbstractAttribute.call(this,id,name,subjectEntity);

        /**
         * List of attributes
         * @type {Object}
         * @private
         */
        var _list = {};

        /**
         * jQuery object of DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(keyValueListAttributeHtml,{}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Apply an Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var processAttributeAddOperation = function(operation){
            var attribute = new KeyValueAttribute(operation.getEntityId(),"Attribute",that);
            that.addAttribute(attribute);
            _$node.find(".list").append(attribute.get$node());
        };

        /**
         * Propagate an Attribute Add Operation to the remote users and the local widgets
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var propagateAttributeAddOperation = function(operation){
            processAttributeAddOperation(operation);
            _iwcw.sendRemoteOTOperation(operation);
        };

        /**
         * Apply an Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var processAttributeDeleteOperation = function(operation){
            var attribute = that.getAttribute(operation.getEntityId());
            if(attribute){
                that.deleteAttribute(attribute.getEntityId());
                attribute.get$node().remove();
            }
        };

        /**
         * Propagate an Attribute Delete Operation to the remote users and the local widgets
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var propagateAttributeDeleteOperation = function(operation){
            processAttributeDeleteOperation(operation);
            _iwcw.sendRemoteOTOperation(operation);
        };

        /**
         * Callback for a remote Attrbute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var remoteAttributeAddCallback = function(operation){
            if(operation instanceof AttributeAddOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for a remote Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var remoteAttributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for a local Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var localAttributeAddCallback = function(operation){
            if(operation instanceof AttributeAddOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                propagateAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for a local Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var localAttributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                propagateAttributeDeleteOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var historyAttributeAddCallback = function(operation){
            if(operation instanceof AttributeAddOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var historyAttributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcw.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeDeleteOperation(operation);
            }
        };

        /**
         * Add attribute to attribute list
         * @param {canvas_widget.AbstractAttribute} attribute
         */
        this.addAttribute = function(attribute){
            var id = attribute.getEntityId();
            if(!_list.hasOwnProperty(id)){
                _list[id] = attribute;
            }
        };

        /**
         * Get attribute of attribute list by its entity id
         * @param id
         * @returns {canvas_widget.AbstractAttribute}
         */
        this.getAttribute = function(id){
            if(_list.hasOwnProperty(id)){
                return _list[id];
            }
            return null;
        };

        /**
         * Delete attribute from attribute list by its entity id
         * @param {string} id
         */
        this.deleteAttribute = function(id){
            if(_list.hasOwnProperty(id)){
                delete _list[id];
            }
        };

        /**
         * Get attribute list
         * @returns {Object}
         */
        this.getAttributes = function(){
            return _list;
        };

        /**
         * Set attribute list
         * @param {Object} list
         */
        this.setAttributes = function(list){
            _list = list;
        };

        /**
         * Get jQuery object of the DOM node representing the attribute (list)
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Get JSON representation of the attribute (list)
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.type = KeyValueListAttribute.TYPE;
            var attr = {};
            _.forEach(this.getAttributes(),function(val,key){
                attr[key] = val.toJSON();
            });
            json.list = attr;
            return json;
        };

        /**
         * Set attribute list by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _.forEach(json.list,function(val,key){
                var attribute = new KeyValueAttribute(key,key,that);
                attribute.setValueFromJSON(json.list[key]);
                that.addAttribute(attribute);
                _$node.find(".list").append(attribute.get$node());
            });
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            //_iwcw.registerOnRemoteDataReceivedCallback(remoteAttributeAddCallback);
            //_iwcw.registerOnRemoteDataReceivedCallback(remoteAttributeDeleteCallback);
            _iwcw.registerOnDataReceivedCallback(localAttributeAddCallback);
            _iwcw.registerOnDataReceivedCallback(localAttributeDeleteCallback);
            //_iwcw.registerOnHistoryChangedCallback(historyAttributeAddCallback);
            //_iwcw.registerOnHistoryChangedCallback(historyAttributeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            //_iwcw.unregisterOnRemoteDataReceivedCallback(remoteAttributeAddCallback);
            //_iwcw.unregisterOnRemoteDataReceivedCallback(remoteAttributeDeleteCallback);
            _iwcw.unregisterOnDataReceivedCallback(localAttributeAddCallback);
            _iwcw.unregisterOnDataReceivedCallback(localAttributeDeleteCallback);
            //_iwcw.unregisterOnHistoryChangedCallback(historyAttributeAddCallback);
            //_iwcw.unregisterOnHistoryChangedCallback(historyAttributeDeleteCallback);
        };

        _$node.find(".name").text(this.getName());

        for(var attributeId in _list){
            if(_list.hasOwnProperty(attributeId)){
                _$node.find(".list").append(_list[attributeId].get$node());
            }
        }

        if(_iwcw){
            that.registerCallbacks();
        }
    }

    return KeyValueListAttribute;

});