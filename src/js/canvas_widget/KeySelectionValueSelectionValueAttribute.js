define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',
    'canvas_widget/SelectionValue',
    'text!templates/canvas_widget/key_value_attribute.html'
],/** @lends KeySelectionValueSelectionValueAttribute */function($,jsPlumb,_,Util,AbstractAttribute,Value,SelectionValue,keySelectionValueSelectionValueAttributeHtml) {

    KeySelectionValueSelectionValueAttribute.prototype = new AbstractAttribute();
    KeySelectionValueSelectionValueAttribute.prototype.constructor = KeySelectionValueSelectionValueAttribute;
    /**
     * KeySelectionValueSelectionValueAttribute
     * @class canvas_widget.KeySelectionValueSelectionValueAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options
     * @param {Object} options2 Selection options
     */
    function KeySelectionValueSelectionValueAttribute(id,name,subjectEntity,options,options2){

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

        /**
         * Value object of key
         * @type {canvas_widget.Value}
         * @private
         */
        var _key = new Value(id+"[key]","",this,this.getRootSubjectEntity());

        /***
         * Value object of value
         * @type {canvas_widget.Value}
         * @private
         */
        var _value = new SelectionValue(id+"[value]","",this,this.getRootSubjectEntity(),_options);

        /***
         * Value object of value
         * @type {canvas_widget.Value}
         * @private
         */
        var _value2 = new SelectionValue(id+"[value2]","",this,this.getRootSubjectEntity(),_options2);

        /**
         * jQuery object of the DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(keySelectionValueSelectionValueAttributeHtml,{}));

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set Value object of key
         * @param {canvas_widget.Value} key
         */
        this.setKey = function(key){
            _key = key;
        };

        /**
         * Get Value object of key
         * @returns {canvas_widget.Value}
         */
        this.getKey = function(){
            return _key;
        };

        /**
         * Set Value object of value
         * @param {canvas_widget.Value} value
         */
        this.setValue = function(value){
            _value = value;
        };

        /**
         * Get Value object of value
         * @returns {canvas_widget.Value}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Set Value object of value
         * @param {canvas_widget.Value} value
         */
        this.setValue2 = function(value){
            _value2 = value;
        };

        /**
         * Get Value object of value
         * @returns {canvas_widget.Value}
         */
        this.getValue2 = function(){
            return _value2;
        };

        /**
         * Get jQuery object of the DOM node representing the attribute
         * @returns {jQuery}
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.key = _key.toJSON();
            json.value = _value.toJSON();
            json.value2 = _value2.toJSON();
            return json;
        };

        /**
         * Set value of key and value by their JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _key.setValueFromJSON(json.key);
            _value.setValueFromJSON(json.value);
            _value2.setValueFromJSON(json.value2||{value: ""});
        };

        this.registerYType = function(ytext){
            if(ytext)
                _key.registerYType(ytext);
            _value.registerYType();
            _value2.registerYType();
        };

        _$node.find(".key").append(_key.get$node());
        _$node.find(".value").append(_value.get$node());
    }

    return KeySelectionValueSelectionValueAttribute;

});