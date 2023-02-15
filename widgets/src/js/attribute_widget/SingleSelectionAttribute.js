define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'attribute_widget/AbstractAttribute',
    'attribute_widget/SelectionValue',
    'text!templates/attribute_widget/single_selection_attribute.html'
],/** @lends SingleSelectionAttribute */function($,jsPlumb,_,Util,AbstractAttribute,SelectionValue,singleSelectionAttributeHtml) {

    SingleSelectionAttribute.prototype = new AbstractAttribute();
	SingleSelectionAttribute.prototype.constructor = SingleSelectionAttribute;
    /**
     * SingleSelectionAttribute
     * @class attribute_widget.SingleSelectionAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options as key value object
     */
    function SingleSelectionAttribute(id,name,subjectEntity,options){
        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {attribute_widget.SelectionValue}
         * @private
         */
        var _value  = new SelectionValue(id,name,this,this.getRootSubjectEntity(),options);

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(singleSelectionAttributeHtml)());

        /**
         * Set Value object of value
         * @param {attribute_widget.SelectionValue} value
         */
        this.setValue = function(value){
            _value = value;
        };

        /**
         * Get Value object of value
         * @return {attribute_widget.SelectionValue} value
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Get the options object for the Attribute
         * @returns {Object}
         */
        this.getOptionValue = function(){
            return  options.hasOwnProperty(_value.getValue()) ? options[_value.getValue()] : null;
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
         * Set attribute value by its JSON representation
         * @param {Object} json
         */
        this.setValueFromJSON = function(json){
            _value.setValueFromJSON(json.value);
        };

        _$node.find(".name").text(this.getName());
        _$node.find(".value").append(_value.get$node());

        // check if view only mode is enabled for the property browser
        // because then the input fields should be disabled
        if (window.hasOwnProperty("y")) {
            const widgetConfigMap = y.getMap("widgetConfig");
            if (widgetConfigMap.get("view_only_property_browser")) {
              _$node.find(".val").attr("disabled", "true");
            }
        }
    }

    return SingleSelectionAttribute;

});
