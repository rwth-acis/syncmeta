define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',
    'canvas_widget/SelectionValue',
    'text!templates/canvas_widget/key_value_attribute.html'
],/** @lends KeySelectionValueAttribute */function($,jsPlumb,_,Util,AbstractAttribute,Value,SelectionValue,keySelectionValueAttributeHtml) {

    KeySelectionValueAttribute.prototype = new AbstractAttribute();
    KeySelectionValueAttribute.prototype.constructor = KeySelectionValueAttribute;
    /**
     * KeySelectionValueAttribute
     * @class canvas_widget.KeySelectionValueAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options
     */
    function KeySelectionValueAttribute(id,name,subjectEntity,options){
        var that = this;

        AbstractAttribute.call(this,id,name,subjectEntity);

        var _ymap = null;

        //noinspection UnnecessaryLocalVariableJS
        /**
         * Selection options
         * @type {Object}
         * @private
         */
        var _options = options;
        
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

        /**
         * jQuery object of the DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(keySelectionValueAttributeHtml,{}));

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


        this.registerYMap = function(map){
            var deferred = $.Deferred();
            $.when(that.registerYTypeForValue(map,_key) ,that.registerYTypeForValue(map, _value)).done(function(){
                deferred.resolve();
            });
            return deferred.promise();
        };

        this.getYMap = function(){
            return _ymap;
        };

        _$node.find(".key").append(_key.get$node());
        _$node.find(".value").append(_value.get$node());
    }

    return KeySelectionValueAttribute;

});