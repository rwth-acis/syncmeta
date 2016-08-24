define([
    'jqueryui',
    'lodash',
    'Util',
    'operations/ot/AttributeDeleteOperation',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',
    'canvas_widget/SelectionValue',
    'text!templates/attribute_widget/renaming_attribute.html'
],/** @lends RenamingAttribute */ function($,_,Util,AttributeDeleteOperation,AbstractAttribute,Value,SelectionValue,renamingAttrHTML) {

    RenamingAttribute.TYPE = "RenamingAttribute";

    RenamingAttribute.prototype = new AbstractAttribute();
    RenamingAttribute.prototype.constructor = RenamingAttribute;
    /**
     * RenamingAttribute
     * @class attribute_widget.ConditionPredicateAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {Object} options Selection options
     * @constructor
     */
    function RenamingAttribute(id,name,subjectEntity,options){

        AbstractAttribute.call(this,id,name,subjectEntity);

        //noinspection UnnecessaryLocalVariableJS
        /**
         * Selection options
         * @type {Object}
         * @private
         */
        var _options = options;

        /**
         * Value object of key
         * @type {attribute_widget.Value}
         * @private
         */
        var _key = new Value(id+"[val]","Attribute Name",this,this.getRootSubjectEntity());

        /***
         * Value object of ref
         * @type {attribute_widget.Value}
         * @private
         */
        var _ref = new Value(id+"[ref]","Attribute Reference",this,this.getRootSubjectEntity());

        /***
         * Value object of vis
         * @type {attribute_widget.Value}
         * @private
         */
        var _vis = new SelectionValue(id+"[vis]","Attribute Visibility",this,this.getRootSubjectEntity(),_options);

        /**
         * jQuery object of the DOM node representing the attribute
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(renamingAttrHTML,{}));

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
         * Get Value object of value
         * @returns {attribute_widget.Value}
         */
        this.getRef = function(){
            return _ref;
        };

        /**
         * Get Visibility object of value
         * @returns {attribute_widget.Value}
         */
        this.getVis = function(){
            return _vis;
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Set Value object of value
         * @param {attribute_widget.Value} value
         */
        this.setVis = function(value){
            _vis = value;
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
            _ref.setValueFromJSON(json.ref);
            _vis.setValueFromJSON(json.vis||{value: ""});
            //_value3.setValueFromJSON(json.operator2 || {value: ""});
        };

        /**
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.val = _key.toJSON();
            json.ref = _ref.toJSON();
            json.vis = _vis.toJSON();
            return json;
        };
        _$node.find(".val").append(_key.get$node());
        _$node.find(".ref").append(_ref.get$node()).hide();
        _$node.find(".vis").append(_vis.get$node());

        this.registerYMap = function(ytext){
            if(ytext){
                _key.registerYType(ytext);
            }
            _vis.registerYType();
        }

    }

    return RenamingAttribute;

});