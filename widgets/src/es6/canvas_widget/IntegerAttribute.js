import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import Util from 'Util';
import AbstractAttribute from 'canvas_widget/AbstractAttribute';
import IntegerValue from 'canvas_widget/IntegerValue';
import integerAttributeHtml from 'text!templates/canvas_widget/single_selection_attribute.html';

    IntegerAttribute.prototype = new AbstractAttribute();
    IntegerAttribute.prototype.constructor = IntegerAttribute;
    /**
     * IntegerAttribute
     * @class canvas_widget.IntegerAttribute
     * @extends canvas_widget.AbstractAttribute
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function IntegerAttribute(id,name,subjectEntity, useAttributeHtml){
        useAttributeHtml = typeof(useAttributeHtml) !== 'undefined' ? useAttributeHtml : false;
        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {canvas_widget.IntegerValue}
         * @private
         */
        var _value = new IntegerValue(id,name,this,this.getRootSubjectEntity(), useAttributeHtml);

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(integerAttributeHtml)());

        /**
         * Set Value object of value
         * @param {canvas_widget.IntegerValue} value
         */
        this.setValue = function(value){
            _value = value;
            _$node.val(value);
        };

        /**
         * Get Value object of value
         * @return {canvas_widget.IntegerValue} value
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
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.value = _value.toJSON();
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

    export default IntegerAttribute;

