define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'attribute_widget/AbstractAttribute',
    'attribute_widget/Value',
    'text!templates/attribute_widget/single_value_attribute.html'
],/** @lends SingleValueAttribute */function($,jsPlumb,_,Util,AbstractAttribute,Value,singleValueAttributeHtml) {

    SingleValueAttribute.prototype = new AbstractAttribute();
	SingleValueAttribute.prototype.constructor = SingleValueAttribute;
    /**
     * SingleValueAttribute
     * @class attribute_widget.SingleValueAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function SingleValueAttribute(id,name,subjectEntity){
        var that = this;

        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {attribute_widget.Value}
         * @private
         */
        var _value  = new Value(id,name,this,this.getRootSubjectEntity());

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(singleValueAttributeHtml,{}));

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

        /**
         * jQuery object of DOM node representing the attribute
         * @type {jQuery}
         * @public
         */
        this.get$node = function(){
            return _$node;
        };

        /**
         * Set attribute value by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _value.setValueFromJSON(json.value);
        };

        _$node.find(".name").text(this.getName());
        _$node.find(".value").append(_value.get$node());
    }

    return SingleValueAttribute;

});