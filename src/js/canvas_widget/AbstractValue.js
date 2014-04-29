define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcotw',
    'canvas_widget/AbstractAttribute',
    'operations/ot/ValueChangeOperation',
    'text!templates/canvas_widget/abstract_value.html'
],/** @lends AbstractValue */function($,jsPlumb,_,IWCOT,AbstractAttribute,ValueChangeOperation,abstractValueHtml) {

    /**
     * AbstractValue
     * @class canvas_widget.AbstractValue
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     */
    function AbstractValue(id,name,subjectEntity,rootSubjectEntity){
        var that = this;

        /**
         * The entity identifier
         * @returns {string} entity id
         */
        var _id = id;

        /**
         * Name of Attribute
         * @type {string}
         * @private
         */
        var _name = name;

        /**
         * Entity the attribute is assigned to
         * @type {canvas_widget.AbstractEntity}
         * @private
         */
        var _subjectEntity = subjectEntity;

        /**
         * Topmost entity in the chain of entity the attribute is assigned to
         * @type {canvas_widget.AbstractEdge|canvas_widget.AbstractNode}
         * @private
         */
        var _rootSubjectEntity = rootSubjectEntity;


        /**
         * Get the entity identifier
         * @returns {string} entity id
         */
        this.getEntityId = function(){
            return _id;
        };

        /**
         * Get value
         * @returns {string}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Get name of value
         * @returns {string}
         */
        this.getName = function(){
            return _name;
        };

        /**
         * Get entity the attribute is assigned to
         * @returns {canvas_widget.AbstractEntity}
         */
        this.getSubjectEntity = function(){
            return _subjectEntity;
        };

        /**
         * Get topmost entity in the chain of entity the attribute is assigned to
         * @returns {canvas_widget.AbstractEdge|canvas_widget.AbstractNode}
         */
        this.getRootSubjectEntity = function(){
            return _rootSubjectEntity;
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         */
        this._toJSON = function(){
            return {
                id: that.getEntityId(),
                name: _name
            };
        };

    }

    //noinspection JSAccessibilityCheck
    AbstractValue.prototype.toJSON = function(){
        return this._toJSON();
    };

    return AbstractValue;

});