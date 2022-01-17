define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',
    'text!templates/canvas_widget/key_value_attribute.html'
],/** @lends KeyValueAttribute */function($,jsPlumb,_,Util,AbstractAttribute,Value,keyValueAttributeHtml) {

    KeyValueAttribute.prototype = new AbstractAttribute();
    KeyValueAttribute.prototype.constructor = KeyValueAttribute;
    /**
     * KeyValueAttribute
     * @class canvas_widget.KeyValueAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function KeyValueAttribute(id,name,subjectEntity){

        AbstractAttribute.call(this,id,name,subjectEntity);

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
        var _value = new Value(id+"[value]","",this,this.getRootSubjectEntity());

        /**
         * jQuery object of the DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(keyValueAttributeHtml)());

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
            return json;
        };

        /**
         * Set value of key and value by their JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _key.setValueFromJSON(json.key);
            _value.setValueFromJSON(json.value);
        };

        _$node.find(".key").append(_key.get$node());
        _$node.find(".value").append(_value.get$node());
    }

    return KeyValueAttribute;

});