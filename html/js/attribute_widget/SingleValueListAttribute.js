define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'Util',
    'operations/ot/AttributeAddOperation',
    'operations/ot/AttributeDeleteOperation',
    'attribute_widget/AbstractAttribute',
    'attribute_widget/ListSingleValueAttribute',
    'text!templates/attribute_widget/list_attribute.html'
],function($,jsPlumb,_,IWCW,Util,AttributeAddOperation,AttributeDeleteOperation,AbstractAttribute,SingleValueAttribute,singleValueListAttributeHtml) {

    SingleValueListAttribute.prototype = new AbstractAttribute();
    SingleValueListAttribute.prototype.constructor = SingleValueListAttribute;
    /**
     * Abstract Attribute
     * @class attribute_widget.SingleValueListAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function SingleValueListAttribute(id,name,subjectEntity){
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
        var _$node = $(_.template(singleValueListAttributeHtml,{}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         */
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

        /**
         * Apply an Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var processAttributeAddOperation = function(operation){
            var attribute = new SingleValueAttribute(operation.getEntityId(),"Attribute",that);
            that.addAttribute(attribute);
            _$node.find(".list").append(attribute.get$node());
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
         * Propagate an Attribute Add Operation to the remote users and the local widgets
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var propagateAttributeAddOperation = function(operation){
            iwc.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.getOTOperation());
        };

        /**
         * Callback for an Attribute Add Operation
         * @param {operations.ot.AttributeAddOperation} operation
         */
        var attributeAddCallback = function(operation){
            if(operation instanceof AttributeAddOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                processAttributeAddOperation(operation);
            }
        };

        /**
         * Callback for an Attribute Delete Operation
         * @param {operations.ot.AttributeDeleteOperation} operation
         */
        var attributeDeleteCallback = function(operation){
            if(operation instanceof AttributeDeleteOperation && operation.getRootSubjectEntityId() === that.getRootSubjectEntity().getEntityId() && operation.getSubjectEntityId() === that.getEntityId()){
                processAttributeDeleteOperation(operation);
            }
        };

        /**
         * Add attribute to attribute list
         * @param {attribute_widget.AbstractAttribute} attribute
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
         * @returns {attribute_widget.AbstractAttribute}
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
         * Set attribute list by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _.forEach(json.list,function(val,key){
                var attribute = new SingleValueAttribute(key,key,that);
                attribute.setValueFromJSON(json.list[key]);
                that.addAttribute(attribute);
                _$node.find(".list").append(attribute.get$node());
            });
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            iwc.registerOnDataReceivedCallback(attributeAddCallback);
            iwc.registerOnDataReceivedCallback(attributeDeleteCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            iwc.unregisterOnDataReceivedCallback(attributeAddCallback);
            iwc.unregisterOnDataReceivedCallback(attributeDeleteCallback);
        };

        _$node.find(".name").text(this.getName());
        for(var attrId in _list){
            if(_list.hasOwnProperty(attrId)){
                _$node.find(".list").append(_list[attrId].get$node());
            }
        }
        _$node.find(".ui-icon-plus").click(function(){
            var id = Util.generateRandomId();
            var operation = new AttributeAddOperation(id,that.getEntityId(),that.getRootSubjectEntity().getEntityId(),SingleValueAttribute.TYPE);
            propagateAttributeAddOperation(operation);
        });

        if(iwc){
            that.registerCallbacks();
        }
    }

    return SingleValueListAttribute;

});