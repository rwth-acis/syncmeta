define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcotw',
    'Util',
    'operations/ot/AttributeAddOperation',
    'operations/ot/AttributeDeleteOperation',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/KeySelectionValueAttribute',
    'text!templates/canvas_widget/list_attribute.html'
],/** @lends KeySelectionValueListAttribute */function($,jsPlumb,_,IWCOT,Util,AttributeAddOperation,AttributeDeleteOperation,AbstractAttribute,KeySelectionValueAttribute,keySelectionValueListAttributeHtml) {

    KeySelectionValueListAttribute.TYPE = "KeySelectionValueListAttribute";

    KeySelectionValueListAttribute.prototype = new AbstractAttribute();
    KeySelectionValueListAttribute.prototype.constructor = KeySelectionValueListAttribute;
    /**
     * KeySelectionValueListAttribute
     * @class canvas_widget.KeySelectionValueListAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options
     */
    function KeySelectionValueListAttribute(id,name,subjectEntity,options){
        var that = this;



        AbstractAttribute.call(this,id,name,subjectEntity);

        /**
         * Selection options
         * @type {Object}
         * @private
         */
        var _options = options;

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
        var _$node = $(_.template(keySelectionValueListAttributeHtml,{}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Apply an Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var processAttributeAddOperation = function(operation){
            var ynode = that.getRootSubjectEntity().getYMap();
            if (ynode) {
                ynode.get(operation.getEntityId()+'[key]').then(function (ytext) {
                    var attribute = new KeySelectionValueAttribute(operation.getEntityId(), "Attribute", that, _options);
                    attribute.registerYMap(ytext);
                    that.addAttribute(attribute);
                    _$node.find(".list").append(attribute.get$node());

                });
            }
            else {
                var attribute = new KeySelectionValueAttribute(operation.getEntityId(), "Attribute", that, _options);
                that.addAttribute(attribute);
                _$node.find(".list").append(attribute.get$node());
            }

        };

        var createYTypeForValueOfAttribute = function(map,id, yType){
            var deferred = $.Deferred();
            map.set(id, yType).then(function(){
                deferred.resolve();
            });
            deferred.promise();
        };

        /**
         * Propagate an Attribute Add Operation to the remote users and the local widgets
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var propagateAttributeAddOperation = function(operation){
            //processAttributeAddOperation(operation);
            //_iwcot.sendRemoteOTOperation(operation);
            var ynode = that.getRootSubjectEntity().getYMap();
            if(ynode){
                $.when(createYTypeForValueOfAttribute(ynode,operation.getEntityId()+'[key]', Y.Text)).done(function(){
                    ynode.set(AttributeAddOperation.TYPE, operation.toJSON());
                });
            }
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
            //processAttributeDeleteOperation(operation);
            //_iwcot.sendRemoteOTOperation(operation);
            var ynode = that.getRootSubjectEntity().getYMap();
            if(ynode){
                ynode.set(operation.getEntityId(), Y.Map).then(function(){
                    ynode.set(AttributeDeleteOperation.TYPE, operation.toJSON());
                });
            }

        };

        /**
         * Callback for a remote Attrbute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var remoteAttributeAddCallback = function(operation){
            if(operation instanceof AttributeAddOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for a remote Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var remoteAttributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeDeleteOperation(operation);
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
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var historyAttributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
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
            json.type = KeySelectionValueListAttribute.TYPE;
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
                var attribute = new KeySelectionValueAttribute(key,key,that,_options);
                attribute.setValueFromJSON(json.list[key]);
                that.addAttribute(attribute);
                _$node.find(".list").append(attribute.get$node());
            });
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            //_iwcot.registerOnRemoteDataReceivedCallback(remoteAttributeAddCallback);
            //_iwcot.registerOnRemoteDataReceivedCallback(remoteAttributeDeleteCallback);
            _iwcot.registerOnLocalDataReceivedCallback(localAttributeAddCallback);
            _iwcot.registerOnLocalDataReceivedCallback(localAttributeDeleteCallback);
            _iwcot.registerOnHistoryChangedCallback(historyAttributeAddCallback);
            _iwcot.registerOnHistoryChangedCallback(historyAttributeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            //_iwcot.unregisterOnRemoteDataReceivedCallback(remoteAttributeAddCallback);
            //_iwcot.unregisterOnRemoteDataReceivedCallback(remoteAttributeDeleteCallback);
            _iwcot.unregisterOnLocalDataReceivedCallback(localAttributeAddCallback);
            _iwcot.unregisterOnLocalDataReceivedCallback(localAttributeDeleteCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyAttributeAddCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyAttributeDeleteCallback);
        };

        _$node.find(".name").text(this.getName());

        for(var attributeId in _list){
            if(_list.hasOwnProperty(attributeId)){
                _$node.find(".list").append(_list[attributeId].get$node());
            }
        }

        if(_iwcot){
            that.registerCallbacks();
        }

        this.getYMap = function(){
            return _ymap;
        };

        this.registerYjsMap = function(){
            that.getRootSubjectEntity().getYMap().observe(function(events){
                for (var i in events) {
                    console.log("Yjs log: The following event-type was thrown: " + events[i].type);
                    console.log("Yjs log: The event was executed on: " + events[i].name);
                    console.log("Yjs log: The event object has more information:");
                    console.log(events[i]);

                    var operation;
                    var data = that.getRootSubjectEntity().getYMap().get(events[i].name);
                    switch (events[i].name) {
                        case AttributeAddOperation.TYPE:
                        {
                            operation = new AttributeAddOperation(data.entityId, data.subjectEntityId, data.rootSubjectEntityId,data.type);
                            remoteAttributeAddCallback(operation);
                            break;
                        }
                        case AttributeDeleteOperation.TYPE:{
                            operation = new AttributeDeleteOperation(data.entityId, data.subjectEntityId, data.rootSubjectEntityId,data.type);
                            remoteAttributeDeleteCallback(operation);
                            break;
                        }
                    }
                }
            });
        }
    }

    return KeySelectionValueListAttribute;

});