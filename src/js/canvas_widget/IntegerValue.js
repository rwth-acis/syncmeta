define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcotw',
    'canvas_widget/AbstractValue',
    'canvas_widget/AbstractAttribute',
    'operations/ot/ValueChangeOperation',
    'operations/non_ot/ActivityOperation',
    'text!templates/canvas_widget/integer_value.html',
    'text!templates/attribute_widget/integer_value.html'
],/** @lends IntegerValue */function($,jsPlumb,_,IWCOT,AbstractValue,AbstractAttribute,ValueChangeOperation,ActivityOperation,integerValueHtml, attributeIntegerValueHtml) {

    IntegerValue.prototype = new AbstractValue();
    IntegerValue.prototype.constructor = IntegerValue;
    /**
     * IntegerValue
     * @class canvas_widget.IntegerValue
     * @extends canvas_widget.AbstractValue
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     */
    function IntegerValue(id,name,subjectEntity,rootSubjectEntity, useAttributeHtml){
        var that = this;

        if(useAttributeHtml)
            integerValueHtml = attributeIntegerValueHtml;

        AbstractValue.call(this,id,name,subjectEntity,rootSubjectEntity);

        /**
         * Value
         * @type {number}
         * @private
         */
        var _value = 0;

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(integerValueHtml,{value: _value}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var _iwcot = IWCOT.getInstance(CONFIG.WIDGET.NAME.MAIN);

        /**
         * Get chain of entities the attribute is assigned to
         * @returns {string[]}
         */
        var getEntityIdChain = function(){
            var chain = [that.getEntityId()],
                entity = that;
            while(entity instanceof AbstractAttribute){
                chain.unshift(entity.getSubjectEntity().getEntityId());
                entity = entity.getSubjectEntity();
            }
            return chain;
        };

        /**
         * Apply a Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var processValueChangeOperation = function(operation){
            that.setValue(operation.getValue());
        };

        /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var propagateValueChangeOperation = function(operation){
            operation.setEntityIdChain(getEntityIdChain());
            processValueChangeOperation(operation);
            if(_iwcot.sendRemoteOTOperation(operation)){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "ValueChangeActivity",
                    that.getEntityId(),
                    _iwcot.getUser()[CONFIG.NS.PERSON.JABBERID],
                    ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(),that.getRootSubjectEntity().getType(),that.getRootSubjectEntity().getLabel().getValue().getValue()),
                    {
                        value: operation.getValue(),
                        subjectEntityName: that.getSubjectEntity().getName(),
                        rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                        rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                    }
                ).toNonOTOperation());
            }
        };

        /**
         * Callback for a remote Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var remoteValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                _iwcot.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY,new ActivityOperation(
                    "ValueChangeActivity",
                    that.getEntityId(),
                    operation.getOTOperation().getSender(),
                    ValueChangeOperation.getOperationDescription(that.getSubjectEntity().getName(),that.getRootSubjectEntity().getType(),that.getRootSubjectEntity().getLabel().getValue().getValue()),
                    {
                        value: operation.getValue(),
                        subjectEntityName: that.getSubjectEntity().getName(),
                        rootSubjectEntityType: that.getRootSubjectEntity().getType(),
                        rootSubjectEntityId: that.getRootSubjectEntity().getEntityId()
                    }
                ).toNonOTOperation());
                processValueChangeOperation(operation);
            }
        };

        /**
         * Callback for a local Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var localValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                propagateValueChangeOperation(operation);
            }
        };

        /**
         * Callback for an undone resp. redone Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var historyValueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                _iwcot.sendLocalOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE,operation.getOTOperation());
                processValueChangeOperation(operation);
            }
        };

        var propagateValueChange = function(type,value,position){
            var operation = new ValueChangeOperation(that.getEntityId(),value,type,position);
            propagateValueChangeOperation(operation);
        };

        var init = function(){
            _$node.off();
            _$node.change(function(){
                var value = parseInt(_$node.val());
                if(isNaN(value)){
                    value = 0;
                }
                propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE,value,0);
            });
        };

        /**
         * Set value
         * @param {number} value
         */
        this.setValue = function(value){
            _value = value;
            if(useAttributeHtml)
                _$node.val(value);
            else
                _$node.text(value);
        };

        /**
         * Get value
         * @returns {number}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Get jQuery object of DOM node representing the value
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractValue.prototype.toJSON.call(this);
            json.value = _value;
            return json;
        };

        /**
         * Set value by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            this.setValue(json.value);
        };

        /**
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwcot.registerOnRemoteDataReceivedCallback(remoteValueChangeCallback);
            _iwcot.registerOnLocalDataReceivedCallback(localValueChangeCallback);
            _iwcot.registerOnHistoryChangedCallback(historyValueChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwcot.unregisterOnRemoteDataReceivedCallback(remoteValueChangeCallback);
            _iwcot.unregisterOnLocalDataReceivedCallback(localValueChangeCallback);
            _iwcot.unregisterOnHistoryChangedCallback(historyValueChangeCallback);
        };

        init();
        if(_iwcot){
            that.registerCallbacks();
        }
    }

    return IntegerValue;

});