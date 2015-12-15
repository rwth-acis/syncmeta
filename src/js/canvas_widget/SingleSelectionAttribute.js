define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/SelectionValue',
    'text!templates/canvas_widget/single_selection_attribute.html'
],/** @lends SingleSelectionAttribute */function($,jsPlumb,_,Util,AbstractAttribute,SelectionValue,singleSelectionAttributeHtml) {

    SingleSelectionAttribute.prototype = new AbstractAttribute();
    SingleSelectionAttribute.prototype.constructor = SingleSelectionAttribute;
    /**
     * SingleSelectionAttribute
     * @class canvas_widget.SingleSelectionAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options as key value object
     */
    function SingleSelectionAttribute(id,name,subjectEntity,options){
        var that = this;

        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {canvas_widget.SelectionValue}
         * @private
         */
        var _value = new SelectionValue(id,name,this,this.getRootSubjectEntity(),options);

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(singleSelectionAttributeHtml,{}));

        /**
         * Set Value object of value
         * @param {canvas_widget.SelectionValue} value
         */
        this.setValue = function(value){
            _value = value;
            _$node.val(value);
        };

        /**
         * Get Value object of value
         * @return {canvas_widget.SelectionValue} value
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * jQuery object of DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Get the options object for the Attribute
         * @returns {Object}
         */
        this.getOptionValue = function(){
            return  options.hasOwnProperty(_value.getValue()) ? options[_value.getValue()] : null;
        };

        /**
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.value = _value.toJSON();
            json.option = that.getOptionValue();
            return json;
        };

        /**
         * Set attribute value by its JSON representation
         * @param {Object} json
         */
        this.setValueFromJSON = function(json){
            _value.setValueFromJSON(json.value);
        };

        _$node.find(".name").text(this.getName());
        _$node.find(".value").append(_value.get$node());
    }

    return SingleSelectionAttribute;

});