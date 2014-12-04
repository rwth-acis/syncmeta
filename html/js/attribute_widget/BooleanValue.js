define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'attribute_widget/AbstractValue',
    'operations/ot/ValueChangeOperation',
    'text!templates/attribute_widget/boolean_value.html'
],/** @lends BooleanValue */function($,jsPlumb,_,IWCW,AbstractValue,ValueChangeOperation,booleanValueHtml) {

    BooleanValue.prototype = new AbstractValue();
    BooleanValue.prototype.constructor = BooleanValue;
    /**
     * BooleanValue
     * @class attribute_widget.BooleanValue
     * @extends attribute_widget.AbstractValue
     * @memberof attribute_widget
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     * @param {Object} options Selection options
     * @constructor
     */
    function BooleanValue(id,name,subjectEntity,rootSubjectEntity,options){
        var that = this;

        AbstractValue.prototype.constructor.call(this,id,name,subjectEntity,rootSubjectEntity);

        /**
         * Value
         * @type {boolean}
         * @private
         */
        var _value = true;

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(booleanValueHtml,{name: name, options: options, value: _value}));

        /**
         * Inter widget communication wrapper
         * @type {Object}
         * @private
         */
        var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);

        /**
         * Apply a Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var processValueChangeOperation = function(operation){
            that.setValue(operation.getValue());
        };

        /**
         * Propagate a Value Change to the remote users and the local widgets
         * @param type Type of the update (CONFIG.OPERATION.TYPE.INSERT,DELETE)
         * @param value Char that was inserted or deleted
         * @param position Position the change took place
         */
        var propagateValueChange = function(type,value,position){
            var operation = new ValueChangeOperation(that.getEntityId(),value,type,position);
            propagateValueChangeOperation(operation);
        };
        /**
         * Propagate a Value Change Operation to the remote users and the local widgets
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var propagateValueChangeOperation = function(operation){
            processValueChangeOperation(operation);
            _iwc.sendLocalOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.getOTOperation());
        };

        /**
         * Callback for a Value Change Operation
         * @param {operations.ot.ValueChangeOperation} operation
         */
        var valueChangeCallback = function(operation){
            if(operation instanceof ValueChangeOperation && operation.getEntityId() === that.getEntityId()){
                processValueChangeOperation(operation);
            }
        };

        var init = function(){
            _$node.off();
            _$node.change(function(){
                propagateValueChange(CONFIG.OPERATION.TYPE.UPDATE,this.checked,0);
            });
        };

        /**
         * Set value
         * @param {boolean} value
         */
        this.setValue = function(value){
            _value = value;
            _$node.prop('checked',value);
        };

        /**
         * Get value
         * @returns {boolean}
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
         * Register inter widget communication callbacks
         */
        this.registerCallbacks = function(){
            _iwc.registerOnDataReceivedCallback(valueChangeCallback);
        };

        /**
         * Unregister inter widget communication callbacks
         */
        this.unregisterCallbacks = function(){
            _iwc.unregisterOnDataReceivedCallback(valueChangeCallback);
        };

        this.setValueFromJSON = function(json){
            this.setValue(json.value);
        };

        init();

        if(_iwc){
            that.registerCallbacks();
        }
    }

    return BooleanValue;

});