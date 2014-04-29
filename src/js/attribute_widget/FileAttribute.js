define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'attribute_widget/AbstractAttribute',
    'attribute_widget/FileValue',
    'text!templates/attribute_widget/file_attribute.html'
],/** @lends FileAttribute */function($,jsPlumb,_,Util,AbstractAttribute,FileValue,fileAttributeHtml) {

    FileAttribute.prototype = new AbstractAttribute();
	FileAttribute.prototype.constructor = FileAttribute;
    /**
     * FileAttribute
     * @class attribute_widget.FileAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options as key value object
     */
    function FileAttribute(id,name,subjectEntity,options){
        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {attribute_widget.FileValue}
         * @private
         */
        var _value  = new FileValue(id,name,this,this.getRootSubjectEntity(),options);

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(fileAttributeHtml,{}));

        /**
         * Set Value object of value
         * @param {attribute_widget.FileValue} value
         */
        this.setValue = function(value){
            _value = value;
        };

        /**
         * Get Value object of value
         * @return {attribute_widget.FileValue} value
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
         * Set attribute value by its JSON representation
         * @param {Object} json
         */
        this.setValueFromJSON = function(json){
            _value.setValueFromJSON(json.value);
        };

        _$node.find(".name").text(this.getName());
        _$node.find(".value").append(_value.get$node());
    }

    return FileAttribute;

});