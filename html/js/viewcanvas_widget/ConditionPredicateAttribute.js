define([
    'jqueryui',
    'lodash',
    'Util',
    'operations/ot/AttributeDeleteOperation',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',
    'canvas_widget/SelectionValue',
    'text!templates/viewcanvas_widget/condition_predicate.html'
],/** @lends ConditionPredicateAttribute */ function($,_,Util,AttributeDeleteOperation,AbstractAttribute,Value,SelectionValue,condition_predicateHtml) {

    ConditionPredicateAttribute.TYPE = "ConditionPredicateAttribute";

    ConditionPredicateAttribute.prototype = new AbstractAttribute();
	ConditionPredicateAttribute.prototype.constructor = ConditionPredicateAttribute;
    /**
     * ConditionPredicateAttribute
     * @class attribute_widget.ConditionPredicateAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options
     * @param {Object} options2 Selection options
     * @constructor
     */
    function ConditionPredicateAttribute(id,name,subjectEntity,options,options2,options3){
        var that = this;

        AbstractAttribute.call(this,id,name,subjectEntity);

        //noinspection UnnecessaryLocalVariableJS
        /**
         * Selection options
         * @type {Object}
         * @private
         */
        var _options = options;

        //noinspection UnnecessaryLocalVariableJS
        /**
         * Selection options
         * @type {Object}
         * @private
         */
        var _options2 = options2;
		
		var _options3 = options3;
		
        /**
         * Value object of key
         * @type {attribute_widget.Value}
         * @private
         */
        var _key = new Value(id+"[val]","Attribute Value",this,this.getRootSubjectEntity());

        /***
         * Value object of value
         * @type {attribute_widget.Value}
         * @private
         */
        var _value = new SelectionValue(id+"[property]","Attribute Name",this,this.getRootSubjectEntity(),_options);

        /***
         * Value object of value
         * @type {attribute_widget.Value}
         * @private
         */
        var _value2 = new SelectionValue(id+"[operator]","Logical Operator",this,this.getRootSubjectEntity(),_options2);
		
		var _value3 = new SelectionValue(id+"[operator2]", "Logical Operator", this, this.getRootSubjectEntity(), _options3);
        /**
         * jQuery object of the DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(condition_predicateHtml,{}));



        //noinspection JSUnusedGlobalSymbols
        /**
         * Set Value object of key
         * @param {attribute_widget.Value} key
         */
        this.setKey = function(key){
            _key = key;
        };

        /**
         * Get Value object of key
         * @returns {attribute_widget.Value}
         */
        this.getKey = function(){
            return _key;
        };

        /**
         * Set Value object of value
         * @param {attribute_widget.Value} value
         */
        this.setValue = function(value){
            _value = value;
        };

        /**
         * Get Value object of value
         * @returns {attribute_widget.Value}
         */
        this.getValue = function(){
            return _value;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set Value object of value
         * @param {attribute_widget.Value} value
         */
        this.setValue2 = function(value){
            _value2 = value;
        };

        /**
         * Get Value object of value
         * @returns {attribute_widget.Value}
         */
        this.getValue2 = function(){
            return _value2;
        };
		
		 this.setValue3 = function(value){
            _value3 = value;
        };
		
		this.getValue3 = function(){
            return _value3;
        };
		
        /**
         * Get jQuery object of the DOM node representing the attribute
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Set value of key and value by their JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _key.setValueFromJSON(json.val);
            _value.setValueFromJSON(json.property);
            _value2.setValueFromJSON(json.operator||{value: ""});
			_value3.setValueFromJSON(json.operator2 || {value: ""});
        };
		/**
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.val = _key.toJSON();
            json.property = _value.toJSON();
            json.operator = _value2.toJSON();
			json.operator2 = _value3.toJSON();
            return json;
        };
		_$node.find(".val").append(_key.get$node());
        _$node.find(".property").append(_value.get$node());
        _$node.find(".operator").append(_value2.get$node());
		_$node.find(".operator2").append(_value3.get$node());
    }

    return ConditionPredicateAttribute;

});